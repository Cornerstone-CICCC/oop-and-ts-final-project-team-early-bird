// ✅ src/app.ts (팀원 요청사항 + 중복 Close 제거 최종판)
import { Header } from "./components/Header.js";
import { KanbanBoard } from "./components/KanbanBoard.js";
import { ModalController } from "./components/ModalController.js";
import { Modal } from "./components/Modal.js";

type MatchItem = {
  id: string;
  title: string;
  desc: string;
  status: string;
  el: HTMLElement;
};

document.addEventListener("DOMContentLoaded", () => {
  const header = new Header();
  header.mountAtTop();

  let appRoot = document.getElementById("app");
  if (!appRoot) {
    appRoot = document.createElement("div");
    appRoot.id = "app";
    document.body.appendChild(appRoot);
  }

  const board = new KanbanBoard(appRoot as HTMLElement);
  const modalCtl = new ModalController();

  const boardRoot = document.querySelector(".kanban-board") as HTMLElement | null;

  // 🔎 검색 결과 모달
  function openSearchResultsModal(query: string) {
    if (!boardRoot) return;
    const term = query.trim().toLowerCase();
    if (!term) return;

    const columns = Array.from(boardRoot.querySelectorAll(".kanban-column")) as HTMLElement[];
    const columnResults: Array<{ title: string; items: MatchItem[] }> = [];

    columns.forEach((col) => {
      const colTitle = (col.querySelector("h2")?.textContent || "").trim();
      const container = col.querySelector(".task-container") as HTMLElement | null;
      if (!container) return;

      const tasks = Array.from(container.querySelectorAll(".task")) as HTMLElement[];
      const matches: MatchItem[] = [];

      tasks.forEach((card) => {
        const title = (card.querySelector(".task-title")?.textContent || "").trim();
        const desc = (card.querySelector(".task-desc")?.textContent || "").trim();
        const id = (card.querySelector(".task-id")?.textContent || "").trim();
        const status = (card.querySelector(".task-status")?.textContent || "").trim();
        const hay = `${title} ${desc}`.toLowerCase();
        if (hay.includes(term)) matches.push({ id, title, desc, status, el: card });
      });

      if (matches.length) columnResults.push({ title: colTitle, items: matches });
    });

    const wrap = document.createElement("div");
    wrap.className = "srch-wrap";

    // 결과 없음
    if (!columnResults.length) {
      wrap.innerHTML = `
        <div class="srch-header">
          <h3 class="srch-title-large">Search results for "<span>${escapeHtml(query)}</span>"</h3>
          <button class="srch-close" aria-label="Close results">Close</button>
        </div>
        <div class="srch-empty">
          <p>No results for "<strong>${escapeHtml(query)}</strong>".</p>
        </div>`;
      const modal = new Modal();
      // 🔸 "Search" 제목 제거 + 기본 Close 버튼 숨김
      modal.open({ title: "", content: wrap, hideDefaultClose: true });
      wrap.querySelector<HTMLButtonElement>(".srch-close")?.addEventListener("click", () => modal.close());
      return;
    }

    // 결과 있음
    wrap.innerHTML = `
      <div class="srch-header">
        <h3 class="srch-title-large">Search results for "<span>${escapeHtml(query)}</span>"</h3>
        <button class="srch-close" aria-label="Close results">Close</button>
      </div>
      ${columnResults
        .map(
          (col) => `
        <div class="srch-section">
          <h4 class="srch-col-title">${escapeHtml(col.title)}</h4>
          <ul class="srch-list">
            ${col.items
              .map(
                (it) => `
              <li class="srch-item" data-id="${escapeHtml(it.id)}">
                <div class="srch-line">
                  <span class="srch-id">${escapeHtml(it.id)}</span>
                  <span class="srch-status">${escapeHtml(it.status)}</span>
                </div>
                <div class="srch-title">${escapeHtml(it.title)}</div>
                <div class="srch-desc">${escapeHtml(it.desc)}</div>
                <button class="srch-jump" type="button">Go to card</button>
              </li>`
              )
              .join("")}
          </ul>
        </div>`
        )
        .join("")}
    `;

    const modal = new Modal();
    // 🔸 "Search" 제목 제거 + 기본 Close 버튼 숨김 (닫기 버튼 하나만)
    modal.open({ title: "", content: wrap, hideDefaultClose: true });

    wrap.querySelector<HTMLButtonElement>(".srch-close")?.addEventListener("click", () => modal.close());

    wrap.querySelectorAll<HTMLButtonElement>(".srch-jump").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const li = (e.currentTarget as HTMLElement).closest(".srch-item") as HTMLElement;
        const idText = li?.dataset.id || "";
        if (!idText) return;

        const allCards = Array.from(boardRoot.querySelectorAll(".task")) as HTMLElement[];
        const target = allCards.find(
          (c) => (c.querySelector(".task-id")?.textContent || "").trim() === idText
        );
        if (target) {
          modal.close();
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.classList.add("kb-pulse");
          setTimeout(() => target.classList.remove("kb-pulse"), 1200);
        }
      });
    });
  }

  // 제출 이벤트 → 모달 오픈
  header.root.addEventListener("header:search-submit", (e: any) => {
    const { query } = e.detail as { query: string; results: string[] };
    openSearchResultsModal(query);
  });
});

// HTML escape helper
function escapeHtml(s: string) {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
