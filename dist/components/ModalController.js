// src/components/ModalController.ts
import { Modal } from "./Modal.js";
export class ModalController {
    constructor() {
        this.interceptPaused = false;
        this.STATUS = {
            TODO: "To Do",
            INPROG: "In Progress",
            DONE: "Done",
        };
        this.BUCKETS = ["To Do", "In Progress", "Done"];
        this.key = (s) => `task_${s}`;
        this.init();
    }
    // ---------- utils ----------
    escape(s) {
        return (s || "")
            .split("&").join("&amp;")
            .split("<").join("&lt;")
            .split(">").join("&gt;")
            .split('"').join("&quot;");
    }
    load(status) {
        try {
            const raw = localStorage.getItem(this.key(status));
            return raw ? JSON.parse(raw) : [];
        }
        catch (_a) {
            return [];
        }
    }
    save(status, arr) {
        localStorage.setItem(this.key(status), JSON.stringify(arr));
    }
    findById(id) {
        for (const s of this.BUCKETS) {
            const arr = this.load(s);
            const idx = arr.findIndex((t) => t && t.id === id);
            if (idx !== -1)
                return { status: s, idx, arr };
        }
        return null;
    }
    parseId(text) {
        const n = parseInt((text || "").split("#").join(""), 10);
        return isNaN(n) ? -1 : n;
    }
    getTaskEl(target) {
        return (target === null || target === void 0 ? void 0 : target.closest(".task")) || null;
    }
    getCardStatus(taskEl) {
        var _a, _b;
        return (((_b = (_a = taskEl.querySelector(".task-status")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) ||
            this.STATUS.TODO);
    }
    columnByStatus(label) {
        const cols = Array.from(document.querySelectorAll(".kanban-column"));
        return cols.find((c) => { var _a, _b; return ((_b = (_a = c.querySelector("h2")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) === label; }) || null;
    }
    moveCard(taskEl, toStatus) {
        const col = this.columnByStatus(toStatus);
        const container = col === null || col === void 0 ? void 0 : col.querySelector(".task-container");
        if (container)
            container.appendChild(taskEl);
    }
    // ---------- main ----------
    init() {
        document.addEventListener("click", (e) => {
            var _a, _b, _c, _d, _e, _f;
            const target = e.target;
            if (this.interceptPaused)
                return;
            // 1) Add Task(+)
            const addBtn = target.closest(".add-task-btn");
            if (addBtn) {
                e.preventDefault();
                e.stopPropagation();
                const column = addBtn.closest(".kanban-column");
                const taskContainer = column === null || column === void 0 ? void 0 : column.querySelector(".task-container");
                const statusLabel = (((_b = (_a = column === null || column === void 0 ? void 0 : column.querySelector("h2")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || this.STATUS.TODO);
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
                (_c = wrap.querySelector("#create-btn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
                    var _a, _b;
                    const title = ((_a = wrap.querySelector("#new-title")) === null || _a === void 0 ? void 0 : _a.value.trim()) || "New Task";
                    const desc = ((_b = wrap.querySelector("#new-desc")) === null || _b === void 0 ? void 0 : _b.value.trim()) ||
                        "Add Description";
                    // 팀 기본 add 핸들러 실행을 위해 잠시 인터셉트 해제
                    this.interceptPaused = true;
                    addBtn.click();
                    this.interceptPaused = false;
                    // 마지막 카드 덮어쓰기 + storage 동기화
                    setTimeout(() => {
                        if (!taskContainer) {
                            modal.close();
                            return;
                        }
                        const newCard = taskContainer.lastElementChild;
                        if (!newCard) {
                            modal.close();
                            return;
                        }
                        const titleEl = newCard.querySelector(".task-title");
                        const descEl = newCard.querySelector(".task-desc");
                        const idEl = newCard.querySelector(".task-id");
                        if (titleEl)
                            titleEl.textContent = title;
                        if (descEl)
                            descEl.textContent = desc;
                        const idNum = this.parseId((idEl === null || idEl === void 0 ? void 0 : idEl.textContent) || "");
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
            // 2) Delete 버튼
            const delBtn = target.closest(".delete-btn");
            if (delBtn) {
                e.preventDefault();
                e.stopPropagation();
                const taskEl = this.getTaskEl(delBtn);
                if (!taskEl)
                    return;
                const idNum = this.parseId(((_d = taskEl.querySelector(".task-id")) === null || _d === void 0 ? void 0 : _d.textContent) || "");
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
                (_e = wrap.querySelector("#cancel-del")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => modal.close());
                (_f = wrap.querySelector("#confirm-del")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", () => {
                    taskEl.remove();
                    const hit = this.findById(idNum);
                    if (hit) {
                        const arr = this.load(hit.status).filter((t) => t.id !== idNum);
                        this.save(hit.status, arr);
                    }
                    else {
                        const arr = this.load(currStatus).filter((t) => t.id !== idNum);
                        this.save(currStatus, arr);
                    }
                    modal.close();
                });
                modal.open({ title: "Delete Task", content: wrap, hideDefaultClose: true });
                return;
            }
            // 3) Edit 버튼
            const editBtn = target.closest(".edit-btn");
            if (editBtn) {
                e.preventDefault();
                e.stopPropagation();
                const taskEl = this.getTaskEl(editBtn);
                if (taskEl)
                    this.openEditModal(taskEl);
                return;
            }
            // 4) 카드 본문 클릭 → 편집 모달
            const card = this.getTaskEl(target);
            if (card && !target.closest(".option-btn") && !target.closest("button")) {
                e.preventDefault();
                e.stopPropagation();
                this.openEditModal(card);
                return;
            }
        }, true);
    }
    // ---------- 편집 모달 ----------
    openEditModal(taskEl) {
        var _a;
        const modal = new Modal();
        const idEl = taskEl.querySelector(".task-id");
        const statusEl = taskEl.querySelector(".task-status");
        let titleEl = taskEl.querySelector(".task-title");
        let descEl = taskEl.querySelector(".task-desc");
        if (!titleEl || !descEl) {
            const box = taskEl.querySelector(".title-desc");
            // ✅ 혼용 금지 해결: 괄호로 묶어 우선순위 명시
            titleEl = (titleEl !== null && titleEl !== void 0 ? titleEl : box === null || box === void 0 ? void 0 : box.querySelector("h3")) || null;
            descEl = (descEl !== null && descEl !== void 0 ? descEl : box === null || box === void 0 ? void 0 : box.querySelector("p")) || null;
        }
        const idNum = this.parseId((idEl === null || idEl === void 0 ? void 0 : idEl.textContent) || "");
        const currStatus = ((statusEl === null || statusEl === void 0 ? void 0 : statusEl.textContent) || this.STATUS.TODO).trim();
        const currTitle = ((titleEl === null || titleEl === void 0 ? void 0 : titleEl.textContent) || "").trim();
        const currDesc = ((descEl === null || descEl === void 0 ? void 0 : descEl.textContent) || "").trim();
        const wrap = document.createElement("div");
        wrap.className = "task-edit-modal";
        wrap.innerHTML = `
      <div class="task-edit-header" style="display:flex;align-items:center;gap:.5rem;margin-bottom:1rem;">
        <h2 style="margin:0">#${idNum > -1 ? idNum : "?"}</h2>
        <span class="status-pill" style="padding:.25rem .6rem;border-radius:6px;background:#eef;">${this.escape(currStatus)}</span>
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
        (_a = wrap.querySelector("#save-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            const newTitle = wrap.querySelector("#edit-title").value.trim() || currTitle;
            const newDesc = wrap.querySelector("#edit-desc").value.trim() || currDesc;
            const newStat = wrap.querySelector("#edit-status").value || currStatus;
            // storage 반영
            const hit = this.findById(idNum);
            if (hit) {
                if (hit.status !== newStat) {
                    const fromArr = this.load(hit.status).filter((t) => t.id !== idNum);
                    this.save(hit.status, fromArr);
                    const toArr = this.load(newStat);
                    toArr.push({ id: idNum, title: newTitle, description: newDesc, status: newStat });
                    this.save(newStat, toArr);
                }
                else {
                    const arr = this.load(hit.status);
                    const idx = arr.findIndex((t) => t.id === idNum);
                    if (idx !== -1) {
                        arr[idx] = Object.assign(Object.assign({}, arr[idx]), { title: newTitle, description: newDesc, status: newStat });
                        this.save(hit.status, arr);
                    }
                }
            }
            else {
                const toArr = this.load(newStat);
                toArr.push({ id: idNum, title: newTitle, description: newDesc, status: newStat });
                this.save(newStat, toArr);
            }
            // DOM 반영 + 칼럼 이동
            if (titleEl)
                titleEl.textContent = newTitle;
            if (descEl)
                descEl.textContent = newDesc;
            if (statusEl)
                statusEl.textContent = newStat;
            if (newStat !== currStatus)
                this.moveCard(taskEl, newStat);
            modal.close();
        });
        modal.open({ title: "Edit Task", content: wrap });
    }
}
//# sourceMappingURL=ModalController.js.map