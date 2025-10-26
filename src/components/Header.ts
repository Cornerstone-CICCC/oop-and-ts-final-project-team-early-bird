// src/components/Header.ts
// Note: adjust import extension according to your build/tsconfig. 
// If your app.ts uses .js imports at runtime, consider using './SearchBar.js' here and set moduleResolution accordingly.
import { SearchBar } from "./SearchBar.js";
export class Header {
  root: HTMLElement;
  searchBar: SearchBar;

  constructor() {
    this.searchBar = new SearchBar();
    this.root = this.createHeader();

    // Optional: set default items for search (update or remove as needed)
    this.searchBar.setItems([
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Project Manager",
      "Designer",
      "QA Tester",
      "DevOps Engineer",
    ]);

    // Example: forward selection to a header-level handler (could be listened by outer app)
    this.searchBar.onSelect = (item: string) => {
      // Dispatch a CustomEvent so outer code (e.g., app.ts or KanbanBoard) can listen
      const ev = new CustomEvent("header:search-select", { detail: { query: item } });
      this.root.dispatchEvent(ev);

      // Also keep a console log for debugging
      console.log("Header: search selected ->", item);
    };
  }

  private createHeader(): HTMLElement {
    const header = document.createElement('header');

    // h1
    const h1 = document.createElement('h1');
    h1.textContent = 'Team Early Bird';

    header.appendChild(h1);
    header.appendChild(this.searchBar.root); // include search bar

    // Basic header styling placeholders (can be moved to CSS)
    header.style.display = 'flex';
    header.style.flexDirection = 'column';
    header.style.gap = '8px';
    header.style.padding = '12px';

    return header;
  }

  // Convenience method: allow external code to set search items through Header
  setSearchItems(items: string[]) {
    if (this.searchBar && typeof this.searchBar.setItems === 'function') {
      this.searchBar.setItems(items);
    }
  }

  // Allow external code to listen for search selects via DOM event
  // Example: header.root.addEventListener('header:search-select', (e) => { ... })
  mountBefore(target: Element | null) {
    const parent = (target && target.parentElement) || document.body;
    if (target && parent) parent.insertBefore(this.root, target);
    else document.body.insertBefore(this.root, document.body.firstChild);
  }

  mountAtTop() {
    document.body.insertBefore(this.root, document.body.firstChild);
  }

  unmount() {
    this.root.remove();
  }
}
