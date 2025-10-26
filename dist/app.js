import { KanbanBoard } from "./components/KanbanBoard.js";
import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
const appRoot = document.getElementById("app");
if (appRoot) {
    const header = new Header();
    header.mountBefore(appRoot);
    const kanban = new KanbanBoard(appRoot);
    function filterKanbanCardsByTitle(query) {
        const q = (query || "").trim().toLowerCase();
        const board = document.querySelector('.kanban-board');
        const scope = board || document;
        const cardSelectors = [
            '.task-card',
            '.task',
            '.card',
            '.kanban-card',
            '.item',
            'li',
            '.task-item',
        ];
        const titleSelectors = [
            '.task-title',
            '.title',
            '.card-title',
            'h3',
            'h4',
            'h2',
            '.item-title'
        ];
        const cardSet = new Set();
        cardSelectors.forEach(sel => {
            const nodes = Array.from(scope.querySelectorAll(sel));
            nodes.forEach(n => cardSet.add(n));
        });
        if (cardSet.size === 0) {
            const potential = Array.from(scope.querySelectorAll('.kanban-board *'));
            potential.forEach(el => {
                if (el.children.length > 0 && el.textContent && el.textContent.trim().length > 0) {
                    cardSet.add(el);
                }
            });
        }
        const cards = Array.from(cardSet);
        if (!q) {
            cards.forEach(card => {
                card.style.display = '';
            });
            return;
        }
        cards.forEach(card => {
            var _a, _b;
            let titleText = '';
            for (const tsel of titleSelectors) {
                const t = card.querySelector(tsel);
                if (t && t.textContent && t.textContent.trim().length > 0) {
                    titleText = t.textContent.trim().toLowerCase();
                    break;
                }
            }
            if (!titleText) {
                const txt = (_b = (_a = card.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '';
                const lines = txt.split('\n').map(s => s.trim()).filter(Boolean);
                if (lines.length > 0) {
                    lines.sort((a, b) => a.length - b.length);
                    titleText = lines[0].toLowerCase();
                }
                else {
                    titleText = txt.toLowerCase();
                }
            }
            if (titleText.includes(q)) {
                card.style.display = '';
            }
            else {
                card.style.display = 'none';
            }
        });
    }
    header.root.addEventListener('header:search-select', (e) => {
        var _a, _b;
        const anyEvent = e;
        const query = (_b = (_a = anyEvent.detail) === null || _a === void 0 ? void 0 : _a.query) !== null && _b !== void 0 ? _b : "";
        filterKanbanCardsByTitle(query);
    });
    header.root.addEventListener('header:search-clear', () => {
        filterKanbanCardsByTitle('');
    });
    const footer = new Footer();
    footer.mountAfter(appRoot);
}
else {
    console.error("Root element not found!");
}
//# sourceMappingURL=app.js.map