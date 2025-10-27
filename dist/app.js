var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ✅ src/app.ts (팀원 요청사항 + 중복 Close 제거 + Footer 복원 최종판)
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
    // ✅ Footer 복원 (동적 임포트 → 실패 시 DOM 푸터 생성)
    mountFooter();
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
            (_a = wrap.querySelector(".srch-close")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => modal.close());
            return;
        }
        // 결과 있음
        wrap.innerHTML = `
      <div class="srch-header">
        <h3 class="srch-title-large">Search results for "<span>${escapeHtml(query)}</span>"</h3>
        <button class="srch-close" aria-label="Close results">Close</button>
      </div>
      ${columnResults
            .map((col) => `
        <div class="srch-section">
          <h4 class="srch-col-title">${escapeHtml(col.title)}</h4>
          <ul class="srch-list">
            ${col.items
            .map((it) => `
              <li class="srch-item" data-id="${escapeHtml(it.id)}">
                <div class="srch-line">
                  <span class="srch-id">${escapeHtml(it.id)}</span>
                  <span class="srch-status">${escapeHtml(it.status)}</span>
                </div>
                <div class="srch-title">${escapeHtml(it.title)}</div>
                <div class="srch-desc">${escapeHtml(it.desc)}</div>
                <button class="srch-jump" type="button">Go to card</button>
              </li>`)
            .join("")}
          </ul>
        </div>`)
            .join("")}
    `;
        const modal = new Modal();
        // 🔸 "Search" 제목 제거 + 기본 Close 버튼 숨김 (닫기 버튼 하나만)
        modal.open({ title: "", content: wrap, hideDefaultClose: true });
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
    // 제출 이벤트 → 모달 오픈
    header.root.addEventListener("header:search-submit", (e) => {
        const { query } = e.detail;
        openSearchResultsModal(query);
    });
});
// HTML escape helper
function escapeHtml(s) {
    return (s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
/* ---------- Footer mount helper ---------- */
function mountFooter() {
    return __awaiter(this, void 0, void 0, function* () {
        // 이미 footer가 있으면 스킵
        const existing = document.querySelector("footer.site-footer") ||
            document.getElementById("site-footer");
        if (existing)
            return;
        // 1) Footer 컴포넌트가 있으면 사용 (동적 임포트)
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mod = yield import("./components/Footer.js");
            if (mod && mod.Footer) {
                const footer = new mod.Footer();
                // 다양한 구현 대응
                if (typeof footer.mountAtBottom === "function")
                    footer.mountAtBottom();
                else if (typeof footer.mount === "function")
                    footer.mount(document.body);
                else if (footer.root)
                    document.body.appendChild(footer.root);
                return;
            }
        }
        catch (_a) {
            // 컴포넌트 없음 → DOM fallback으로 진행
        }
        // 2) Fallback: 단순 DOM footer 생성 (필요 시 내용 교체)
        const foot = document.createElement("footer");
        foot.className = "site-footer";
        foot.id = "site-footer";
        foot.style.margin = "32px auto 24px";
        foot.style.maxWidth = "880px";
        foot.style.padding = "12px 16px";
        foot.style.color = "#6b6b7a";
        foot.style.fontSize = "0.9rem";
        foot.style.textAlign = "center";
        foot.style.borderTop = "1px solid #eee";
        foot.style.opacity = "0.9";
        foot.innerHTML = `
    <span>© Team Early Bird</span>
    <span style="margin:0 .5rem;">·</span>
    <span>All tasks are saved to localStorage</span>
  `;
        document.body.appendChild(foot);
    });
}
//# sourceMappingURL=app.js.map