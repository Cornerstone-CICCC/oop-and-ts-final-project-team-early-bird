// src/components/Header.ts
import { SearchBar } from "./SearchBar.js";
export class Header {
    constructor() {
        this.searchBar = new SearchBar();
        this.root = this.createHeader();
        // 데모 아이템(원하면 제거/교체)
        this.searchBar.setItems([
            "Setup project",
            "Design UI",
            "Build TaskCard",
            "Fix Modal",
            "Refactor Board",
            "Implement Drag & Drop",
        ]);
        // 프리뷰 전달(모달 X) — 필요 없으면 무시돼도 OK
        this.searchBar.onSearch = (query, results) => {
            this.root.dispatchEvent(new CustomEvent("header:search-preview", { detail: { query, results }, bubbles: true }));
        };
        // 제출 전달(모달 O)
        this.searchBar.onSubmit = (query, results) => {
            this.root.dispatchEvent(new CustomEvent("header:search-submit", { detail: { query, results }, bubbles: true }));
        };
    }
    createHeader() {
        const header = document.createElement("header");
        const h1 = document.createElement("h1");
        h1.textContent = "Team Early Bird";
        header.appendChild(h1);
        header.appendChild(this.searchBar.root);
        header.style.display = "flex";
        header.style.flexDirection = "column";
        header.style.gap = "8px";
        header.style.padding = "12px";
        return header;
    }
    mountAtTop() {
        document.body.insertBefore(this.root, document.body.firstChild);
    }
    unmount() { this.root.remove(); }
}
//# sourceMappingURL=Header.js.map