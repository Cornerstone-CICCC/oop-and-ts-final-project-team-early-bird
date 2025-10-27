// src/components/ModalController.ts
import { Modal } from "./Modal.js";

type TaskItem = { id: number; title: string; description: string; status: string };

export class ModalController {
  private interceptPaused = false;

  // Kanban의 실제 라벨(칼럼 제목/배지/스토리지 키와 동일)
  private STATUS = {
    TODO: "To Do",
    INPROG: "In Progress",
    DONE: "Done",
  };
  private BUCKETS = ["To Do", "In Progress", "Done"] as const;

  constructor() {
    this.init();
  }

  // ---------- utils ----------
  private escape(s: string) {
    return (s || "")
      .split("&").join("&amp;")
      .split("<").join("&lt;")
      .split(">").join("&gt;")
      .split('"').join("&quot;");
  }
  private key = (s: string) => `task_${s}`;

  private load(status: string): TaskItem[] {
    try {
      const raw = localStorage.getItem(this.key(status));
      return raw ? (JSON.parse(raw) as TaskItem[]) : [];
    } catch {
      return [];
    }
  }
  private save(status: string, arr: TaskItem[]) {
    localStorage.setItem(this.key(status), JSON.stringify(arr));
  }
  private findById(id: number) {
    for (const s of this.BUCKETS) {
      const arr = this.load(s);
      const idx = arr.findIndex((t) => t && t.id === id);
      if (idx !== -1) return { status: s, idx, arr };
    }
    return null;
  }
  private parseId(text: string | null | undefined) {
    const n = parseInt((text || "").split("#").join(""), 10);
    return isNaN(n) ? -1 : n;
  }
  private getTaskEl(target: HTMLElement | null) {
    return (target?.closest(".task") as HTMLElement | null) || null;
  }
  private getCardStatus(taskEl: HTMLElement) {
    return (
      (taskEl.querySelector(".task-status") as HTMLElement | null)?.textContent?.trim() ||
      this.STATUS.TODO
    );
  }
  private columnByStatus(label: string) {
    const cols = Array.from(document.querySelectorAll(".kanban-column")) as HTMLElement[];
    return cols.find((c) => c.querySelector("h2")?.textContent?.trim() === label) || null;
  }
  private moveCard(taskEl: HTMLElement, toStatus: string) {
    const col = this.columnByStatus(toStatus);
    const container = col?.querySelector(".task-container") as HTMLElement | null;
    if (container) container.appendChild(taskEl);
  }

  // ✅ 열려있는 옵션 팝업(.btn-modal.show) 전부 닫기
  private closeAllOptionMenus(except?: HTMLElement | null) {
    const opens = document.querySelectorAll<HTMLElement>(".btn-modal.show");
    opens.forEach((m) => {
      if (except && m.contains(except)) return;
      m.classList.remove("show");
    });
  }

  // ---------- main ----------
  private init() {
    document.addEventListener(
      "click",
      (e) => {
        const target = e.target as HTMLElement;

        // 옵션 버튼/옵션 메뉴가 아닌 영역을 클릭하면 열려있는 옵션 팝업 전부 닫기
        const inOptionMenu = target.closest(".btn-modal") as HTMLElement | null;
        const onOptionBtn = target.closest(".option-btn");
        if (!inOptionMenu && !onOptionBtn) this.closeAllOptionMenus();

        // 옵션 버튼 클릭은 팀 기본 토글 핸들러가 동작하도록 패스
        if (onOptionBtn) return;

        if (this.interceptPaused) return;

        // 1) Add Task(+) 버튼 → 추가 모달
        const addBtn = target.closest(".add-task-btn") as HTMLButtonElement | null;
        if (addBtn) {
          e.preventDefault();
          e.stopPropagation();

          this.closeAllOptionMenus();

          const column = addBtn.closest(".kanban-column") as HTMLElement | null;
          const taskContainer = column?.querySelector(".task-container") as HTMLElement | null;
          const statusLabel =
            (column?.querySelector("h2")?.textContent?.trim() || this.STATUS.TODO);

          const modal = new Modal();
          const wrap = document.createElement("div");
          wrap.className = "task-edit-modal";
          wrap.innerHTML = `
            <label class="task-label">Title</label>
            <input id="new-title" class="task-input" type="text" placeholder="Enter title..." />

            <label class="task-label">Description</label>
            <textarea id="new-desc" class="task-textarea" placeholder="Enter description..."></textarea>

            <div class="task-footer">
              <button id="create-btn" class="save-btn">Create</button>
            </div>
          `;

          wrap.querySelector("#create-btn")?.addEventListener("click", () => {
            const title =
              (wrap.querySelector("#new-title") as HTMLInputElement)?.value.trim() || "New Task";
            const desc =
              (wrap.querySelector("#new-desc") as HTMLTextAreaElement)?.value.trim() ||
              "Add Description";

            // 팀 기본 add 핸들러가 실행되게 잠깐 인터셉트 해제 → 새로운 카드 DOM 생성
            this.interceptPaused = true;
            addBtn.click();
            this.interceptPaused = false;

            // 마지막 카드에 값 덮어쓰기 + storage 동기화
            setTimeout(() => {
              if (!taskContainer) {
                modal.close();
                return;
              }
              const newCard = taskContainer.lastElementChild as HTMLElement | null;
              if (!newCard) {
                modal.close();
                return;
              }

              const titleEl = newCard.querySelector(".task-title") as HTMLElement | null;
              const descEl = newCard.querySelector(".task-desc") as HTMLElement | null;
              const idEl = newCard.querySelector(".task-id") as HTMLElement | null;

              if (titleEl) titleEl.textContent = title;
              if (descEl) descEl.textContent = desc;

              const idNum = this.parseId(idEl?.textContent || "");
              const arr = this.load(statusLabel);
              const i = arr.findIndex((t) => t.id === idNum);
              if (i >= 0) {
                arr[i].title = title;
                arr[i].description = desc;
                this.save(statusLabel, arr);
              }

              modal.close();
            }, 0);
          });

          modal.open({ title: "Add New Task", content: wrap });
          return;
        }

        // 2) Delete 버튼 → 확인 모달
        const delBtn = target.closest(".delete-btn") as HTMLButtonElement | null;
        if (delBtn) {
          e.preventDefault();
          e.stopPropagation();

          this.closeAllOptionMenus();

          const taskEl = this.getTaskEl(delBtn);
          if (!taskEl) return;

          const idNum = this.parseId(
            (taskEl.querySelector(".task-id") as HTMLElement | null)?.textContent || ""
          );
          const currStatus = this.getCardStatus(taskEl);

          const modal = new Modal();
          const wrap = document.createElement("div");
          wrap.innerHTML = `
            <p style="margin:0 0 1rem;">Are you sure you want to delete this task?</p>
            <div style="display:flex; gap:.5rem; justify-content:flex-end;">
              <button id="cancel-del" class="modal-close-btn" style="padding:.5rem 1rem;">Cancel</button>
              <button id="confirm-del" class="save-btn" style="padding:.5rem 1rem;">Delete</button>
            </div>
          `;
          wrap.querySelector("#cancel-del")?.addEventListener("click", () => modal.close());
          wrap.querySelector("#confirm-del")?.addEventListener("click", () => {
            // DOM
            taskEl.remove();
            // storage
            const hit = this.findById(idNum);
            if (hit) {
              const arr = this.load(hit.status).filter((t) => t.id !== idNum);
              this.save(hit.status, arr);
            } else {
              const arr = this.load(currStatus).filter((t) => t.id !== idNum);
              this.save(currStatus, arr);
            }
            modal.close();
          });

          modal.open({ title: "Delete Task", content: wrap, hideDefaultClose: true as any });
          return;
        }

        // 3) Edit 버튼 → 편집 모달
        const editBtn = target.closest(".edit-btn") as HTMLButtonElement | null;
        if (editBtn) {
          e.preventDefault();
          e.stopPropagation();

          this.closeAllOptionMenus();

          const taskEl = this.getTaskEl(editBtn);
          if (taskEl) this.openEditModal(taskEl);
          return;
        }

        // 4) 카드 본문 클릭 → 편집 모달
        const card = this.getTaskEl(target);
        if (card && !target.closest(".option-btn") && !target.closest("button")) {
          e.preventDefault();
          e.stopPropagation();

          this.closeAllOptionMenus();

          this.openEditModal(card);
          return;
        }
      },
      true // 캡처 단계
    );
  }

  // ---------- 편집 모달 ----------
  private openEditModal(taskEl: HTMLElement) {
    const modal = new Modal();

    const idEl = taskEl.querySelector(".task-id") as HTMLElement | null;
    const statusEl = taskEl.querySelector(".task-status") as HTMLElement | null;
    let titleEl = taskEl.querySelector(".task-title") as HTMLElement | null;
    let descEl = taskEl.querySelector(".task-desc") as HTMLElement | null;

    if (!titleEl || !descEl) {
      const box = taskEl.querySelector(".title-desc");
      // (?? 와 || 혼용 금지 → 괄호로 우선순위 명시)
      titleEl = (titleEl ?? (box?.querySelector("h3") as HTMLElement | null)) || null;
      descEl = (descEl ?? (box?.querySelector("p") as HTMLElement | null)) || null;
    }

    const idNum = this.parseId(idEl?.textContent || "");
    const currStatus = ((statusEl?.textContent || this.STATUS.TODO) as string).trim();
    const currTitle = (titleEl?.textContent || "").trim();
    const currDesc = (descEl?.textContent || "").trim();

    const wrap = document.createElement("div");
    wrap.className = "task-edit-modal";
    wrap.innerHTML = `
      <div class="task-edit-header" style="display:flex;align-items:center;gap:.5rem;margin-bottom:1rem;">
        <h2 style="margin:0">#${idNum > -1 ? idNum : "?"}</h2>
        <span class="status-pill" style="padding:.25rem .6rem;border-radius:6px;background:#eef;">${this.escape(
          currStatus
        )}</span>
      </div>
      <hr class="divider" style="border:none;border-top:1px solid #eee;margin:.5rem 0 1rem" />

      <label class="task-label">Title</label>
      <input id="edit-title" class="task-input" type="text" value="${this.escape(currTitle)}" />

      <label class="task-label">Description</label>
      <textarea id="edit-desc" class="task-textarea">${this.escape(currDesc)}</textarea>

      <label class="task-label">Status</label>
      <select id="edit-status" class="task-select">
        <option value="${this.STATUS.TODO}" ${currStatus === this.STATUS.TODO ? "selected" : ""}>${this.STATUS.TODO}</option>
        <option value="${this.STATUS.INPROG}" ${currStatus === this.STATUS.INPROG ? "selected" : ""}>${this.STATUS.INPROG}</option>
        <option value="${this.STATUS.DONE}" ${currStatus === this.STATUS.DONE ? "selected" : ""}>${this.STATUS.DONE}</option>
      </select>

      <div class="task-footer" style="margin-top:1rem;">
        <button id="save-btn" class="save-btn">Save</button>
      </div>
    `;

    wrap.querySelector("#save-btn")?.addEventListener("click", () => {
      const newTitle =
        (wrap.querySelector("#edit-title") as HTMLInputElement).value.trim() || currTitle;
      const newDesc =
        (wrap.querySelector("#edit-desc") as HTMLTextAreaElement).value.trim() || currDesc;
      const newStat =
        (wrap.querySelector("#edit-status") as HTMLSelectElement).value || currStatus;

      // storage 반영
      const hit = this.findById(idNum);
      if (hit) {
        if (hit.status !== newStat) {
          const fromArr = this.load(hit.status).filter((t) => t.id !== idNum);
          this.save(hit.status, fromArr);
          const toArr = this.load(newStat);
          toArr.push({ id: idNum, title: newTitle, description: newDesc, status: newStat });
          this.save(newStat, toArr);
        } else {
          const arr = this.load(hit.status);
          const idx = arr.findIndex((t) => t.id === idNum);
          if (idx !== -1) {
            arr[idx] = { ...arr[idx], title: newTitle, description: newDesc, status: newStat };
            this.save(hit.status, arr);
          }
        }
      } else {
        const toArr = this.load(newStat);
        toArr.push({ id: idNum, title: newTitle, description: newDesc, status: newStat });
        this.save(newStat, toArr);
      }

      // DOM 반영 + 칼럼 이동
      if (titleEl) titleEl.textContent = newTitle;
      if (descEl) descEl.textContent = newDesc;
      if (statusEl) statusEl.textContent = newStat;
      if (newStat !== currStatus) this.moveCard(taskEl, newStat);

      modal.close();
    });

    modal.open({ title: "Edit Task", content: wrap });
  }
}
