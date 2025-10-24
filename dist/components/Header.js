// src/components/Header.ts
import { SearchBar } from "./SearchBar.js";
export class Header {
    constructor() {
        this.searchBar = new SearchBar();
        this.root = this.createHeader();
    }
    createHeader() {
        const header = document.createElement('header');
        // h1
        const h1 = document.createElement('h1');
        h1.textContent = 'Team Early Bird';
        header.appendChild(h1);
        header.appendChild(this.searchBar.root); // search bar 포함
        return header;
    }
    mountBefore(target) {
        const parent = (target && target.parentElement) || document.body;
        if (target && parent)
            parent.insertBefore(this.root, target);
        else
            document.body.insertBefore(this.root, document.body.firstChild);
    }
    mountAtTop() {
        document.body.insertBefore(this.root, document.body.firstChild);
    }
    unmount() {
        this.root.remove();
    }
}
//# sourceMappingURL=Header.js.map