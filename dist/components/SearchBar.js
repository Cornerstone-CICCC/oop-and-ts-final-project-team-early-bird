// src/components/SearchBar.ts
export class SearchBar {
    constructor() {
        this.items = [];
        this.filtered = [];
        this.activeIndex = -1;
        this.onSelect = null;
        this.debounceDelay = 180;
        this.root = this.createSearchBar();
        this.addEventListeners();
    }
    setItems(items) {
        this.items = items || [];
    }
    createSearchBar() {
        const wrapper = document.createElement('div');
        wrapper.className = 'search_bar';
        wrapper.setAttribute('role', 'search');
        const icon = document.createElement('i');
        icon.className = 'search_bar__icon fa-solid fa-magnifying-glass';
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.id = 'search_bar';
        this.input.className = 'search_bar__input';
        this.input.placeholder = 'search';
        this.input.autocomplete = 'off';
        this.input.setAttribute('aria-autocomplete', 'list');
        this.input.setAttribute('aria-controls', 'suggestionList');
        this.suggestionList = document.createElement('ul');
        this.suggestionList.id = 'suggestionList';
        this.suggestionList.className = 'search_bar__suggestions';
        this.suggestionList.setAttribute('role', 'listbox');
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
    addEventListeners() {
        this.input.addEventListener('input', () => {
            if (this.debouncer)
                window.clearTimeout(this.debouncer);
            this.debouncer = window.setTimeout(() => {
                this.handleInput(this.input.value);
            }, this.debounceDelay);
        });
        this.input.addEventListener('focus', () => {
            if (this.input.value.trim()) {
                this.handleInput(this.input.value);
            }
            else {
                this.clearSuggestions();
            }
        });
        this.input.addEventListener('keydown', (e) => {
            if (!this.filtered.length)
                return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.activeIndex = Math.min(this.activeIndex + 1, this.filtered.length - 1);
                this.renderSuggestions();
            }
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.activeIndex = Math.max(this.activeIndex - 1, 0);
                this.renderSuggestions();
            }
            else if (e.key === 'Enter') {
                e.preventDefault();
                if (this.activeIndex >= 0 && this.activeIndex < this.filtered.length) {
                    this.selectItem(this.filtered[this.activeIndex]);
                }
            }
            else if (e.key === 'Escape') {
                this.clearSuggestions();
            }
        });
        document.addEventListener('click', (ev) => {
            if (!this.root.contains(ev.target)) {
                this.clearSuggestions();
            }
        });
        this.suggestionList.addEventListener('click', (ev) => {
            const target = ev.target;
            const li = target.closest('li');
            if (li && li.dataset && li.dataset.value) {
                this.selectItem(li.dataset.value);
            }
        });
    }
    handleInput(query) {
        const q = query.trim().toLowerCase();
        if (!q) {
            this.clearSuggestions();
            return;
        }
        this.filtered = this.items.filter((it) => it.toLowerCase().includes(q)).slice(0, 10);
        this.activeIndex = -1;
        this.renderSuggestions();
    }
    renderSuggestions() {
        this.suggestionList.innerHTML = '';
        if (!this.filtered.length) {
            this.suggestionList.classList.remove('is-open');
            this.input.setAttribute('aria-expanded', 'false');
            return;
        }
        this.suggestionList.classList.add('is-open');
        this.input.setAttribute('aria-expanded', 'true');
        this.filtered.forEach((value, idx) => {
            const li = document.createElement('li');
            li.setAttribute('role', 'option');
            li.setAttribute('data-value', value);
            li.tabIndex = -1;
            li.className = 'search_bar__option';
            if (idx === this.activeIndex) {
                li.classList.add('is-active');
                li.setAttribute('aria-selected', 'true');
            }
            else {
                li.setAttribute('aria-selected', 'false');
            }
            const q = this.input.value.trim();
            if (!q) {
                li.textContent = value;
            }
            else {
                const regex = new RegExp(`(${this.escapeRegExp(q)})`, 'ig');
                li.innerHTML = value.replace(regex, '<mark>$1</mark>');
            }
            this.suggestionList.appendChild(li);
        });
    }
    clearSuggestions() {
        this.filtered = [];
        this.activeIndex = -1;
        this.suggestionList.innerHTML = '';
        this.suggestionList.classList.remove('is-open');
        this.input.setAttribute('aria-expanded', 'false');
    }
    selectItem(item) {
        this.input.value = item;
        this.clearSuggestions();
        if (this.onSelect)
            this.onSelect(item);
    }
    escapeRegExp(s) {
        return s.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
    }
}
//# sourceMappingURL=SearchBar.js.map