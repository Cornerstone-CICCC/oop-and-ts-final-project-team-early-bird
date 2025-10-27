// src/app.ts
import { Header } from "./components/Header.js";
import { KanbanBoard } from "./components/KanbanBoard.js";
import { ModalController } from "./components/ModalController.js";
import { Modal } from "./components/Modal.js";
document.addEventListener("DOMContentLoaded", () => {
    const header = new Header();
    header.mountAtTop();
    let appRoot = document.getElementById("app");
    if (!appRoot) {
        appRoot = document.createElement("div");
        appRoot.id = "app";
        document.body.appendChild(appRoot);
    }
    const board = new KanbanBoard(appRoot);
    const modalCtl = new ModalController();
    const boardRoot = document.querySelector(".kanban-board");
    // 🔎 검색 결과 모달
    function openSearchResultsModal(query) {
        var _a, _b;
        if (!boardRoot)
            return;
        const term = query.trim().toLowerCase();
        if (!term)
            return;
        const columns = Array.from(boardRoot.querySelectorAll(".kanban-column"));
        const columnResults = [];
        columns.forEach((col) => {
            var _a;
            const colTitle = (((_a = col.querySelector("h2")) === null || _a === void 0 ? void 0 : _a.textContent) || "").trim();
            const container = col.querySelector(".task-container");
            if (!container)
                return;
            const tasks = Array.from(container.querySelectorAll(".task"));
            const matches = [];
            tasks.forEach((card) => {
                var _a, _b, _c, _d;
                const title = (((_a = card.querySelector(".task-title")) === null || _a === void 0 ? void 0 : _a.textContent) || "").trim();
                const desc = (((_b = card.querySelector(".task-desc")) === null || _b === void 0 ? void 0 : _b.textContent) || "").trim();
                const id = (((_c = card.querySelector(".task-id")) === null || _c === void 0 ? void 0 : _c.textContent) || "").trim();
                const status = (((_d = card.querySelector(".task-status")) === null || _d === void 0 ? void 0 : _d.textContent) || "").trim();
                const hay = `${title} ${desc}`.toLowerCase();
                if (hay.includes(term))
                    matches.push({ id, title, desc, status, el: card });
            });
            if (matches.length)
                columnResults.push({ title: colTitle, items: matches });
        });
        const wrap = document.createElement("div");
        wrap.className = "srch-wrap";
        if (!columnResults.length) {
            wrap.innerHTML = `
        <div class="srch-header">
          <h3>Search results for "<span>${escapeHtml(query)}</span>"</h3>
          <button class="srch-close" aria-label="Close results">Close</button>
        </div>
        <div class="srch-empty">
          <p>No results for "<strong>${escapeHtml(query)}</strong>".</p>
        </div>`;
            const modal = new Modal();
            modal.open({ title: "Search", content: wrap });
            (_a = wrap.querySelector(".srch-close")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => modal.close());
            return;
        }
        wrap.innerHTML = `
      <div class="srch-header">
        <h3>Search results for "<span>${escapeHtml(query)}</span>"</h3>
        <button class="srch-close" aria-label="Close results">Close</button>
      </div>
      ${columnResults.map(col => `
        <div class="srch-section">
          <h4 class="srch-col-title">${escapeHtml(col.title)}</h4>
          <ul class="srch-list">
            ${col.items.map(it => `
              <li class="srch-item" data-id="${escapeHtml(it.id)}">
                <div class="srch-line">
                  <span class="srch-id">${escapeHtml(it.id)}</span>
                  <span class="srch-status">${escapeHtml(it.status)}</span>
                </div>
                <div class="srch-title">${escapeHtml(it.title)}</div>
                <div class="srch-desc">${escapeHtml(it.desc)}</div>
                <button class="srch-jump" type="button">Go to card</button>
              </li>
            `).join("")}
          </ul>
        </div>
      `).join("")}
    `;
        const modal = new Modal();
        modal.open({ title: "Search", content: wrap });
        (_b = wrap.querySelector(".srch-close")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => modal.close());
        wrap.querySelectorAll(".srch-jump").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const li = e.currentTarget.closest(".srch-item");
                const idText = (li === null || li === void 0 ? void 0 : li.dataset.id) || "";
                if (!idText)
                    return;
                const allCards = Array.from(boardRoot.querySelectorAll(".task"));
                const target = allCards.find((c) => { var _a; return (((_a = c.querySelector(".task-id")) === null || _a === void 0 ? void 0 : _a.textContent) || "").trim() === idText; });
                if (target) {
                    modal.close();
                    target.scrollIntoView({ behavior: "smooth", block: "center" });
                    target.classList.add("kb-pulse");
                    setTimeout(() => target.classList.remove("kb-pulse"), 1200);
                }
            });
        });
    }
    // 🔔 제출 이벤트에서만 모달 오픈
    header.root.addEventListener("header:search-submit", (e) => {
        const { query } = e.detail;
        openSearchResultsModal(query);
    });
    // (선택) 프리뷰 이벤트: 필요하면 추후 사용 가능
    // header.root.addEventListener("header:search-preview", (e: any) => {
    //   const { query } = e.detail;
    //   console.log("preview:", query);
    // });
});
// 안전한 HTML 출력용
function escapeHtml(s) {
    return (s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
//# sourceMappingURL=app.js.map