import { KanbanBoard } from "./components/KanbanBoard.js";
import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";

const appRoot = document.getElementById("app") as HTMLElement;

if (appRoot) {
  const header = new Header();
  header.mountBefore(appRoot);

  const kanban = new KanbanBoard(appRoot);

  function filterKanbanCardsByTitle(query: string) {
    const q = (query || "").trim().toLowerCase();

    const board = document.querySelector('.kanban-board') as HTMLElement | null;
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

    const cardSet = new Set<HTMLElement>();
    cardSelectors.forEach(sel => {
      const nodes = Array.from(scope.querySelectorAll<HTMLElement>(sel));
      nodes.forEach(n => cardSet.add(n));
    });

    if (cardSet.size === 0) {
      const potential = Array.from(scope.querySelectorAll<HTMLElement>('.kanban-board *'));
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
      let titleText = '';

      for (const tsel of titleSelectors) {
        const t = card.querySelector<HTMLElement>(tsel);
        if (t && t.textContent && t.textContent.trim().length > 0) {
          titleText = t.textContent.trim().toLowerCase();
          break;
        }
      }

      if (!titleText) {
        const txt = card.textContent?.trim() ?? '';
        const lines = txt.split('\n').map(s => s.trim()).filter(Boolean);
        if (lines.length > 0) {
          lines.sort((a, b) => a.length - b.length);
          titleText = lines[0].toLowerCase();
        } else {
          titleText = txt.toLowerCase();
        }
      }

      if (titleText.includes(q)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  header.root.addEventListener('header:search-select', (e: Event) => {
    const anyEvent = e as CustomEvent;
    const query = anyEvent.detail?.query ?? "";
    filterKanbanCardsByTitle(query);
  });

  header.root.addEventListener('header:search-clear', () => {
    filterKanbanCardsByTitle('');
  });

  const footer = new Footer();
  footer.mountAfter(appRoot);
} else {
  console.error("Root element not found!");
}
