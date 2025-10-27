import { Component } from "../common/Component.js";
export class SearchBar extends Component {
    render() {
        const search = document.createElement('form');
        search.className = 'search-bar';
        search.innerHTML = `
            <input type="text" class="search-input" name="search-bar" autocomplete="off" placeholder="Search">
            <button type="submit" class="search-btn"><i class="fa-solid fa-magnifying-glass"></i></button>
        `;
        search.addEventListener('submit', e => {
            e.preventDefault();
            const input = search.querySelector('.search-input');
            const query = input.value.trim();
            if (this.props.onSearch) {
                this.props.onSearch(query);
            }
        });
        return search;
    }
}
//# sourceMappingURL=SearchBar.js.map