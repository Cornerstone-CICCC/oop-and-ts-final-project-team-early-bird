// src/components/SearchBar.ts
export class SearchBar {
    constructor() {
        this.root = this.createSearchBar();
    }
    createSearchBar() {
        const wrapper = document.createElement('div');
        wrapper.className = 'search_bar';
        // 검색 아이콘
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-magnifying-glass';
        // 검색 input
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.id = 'search_bar';
        this.input.placeholder = 'search';
        this.input.autocomplete = 'off';
        // suggestion list
        this.suggestionList = document.createElement('ul');
        this.suggestionList.id = 'suggestionList';
        // assemble
        wrapper.appendChild(icon);
        wrapper.appendChild(this.input);
        wrapper.appendChild(this.suggestionList);
        return wrapper;
    }
    mount(parent) {
        parent.appendChild(this.root);
    }
    unmount() {
        this.root.remove();
    }
}
//# sourceMappingURL=SearchBar.js.map