import { Component } from "../common/Component.js";
import { SearchBar } from "./SearchBar.js";
export class Header extends Component {
    render() {
        const header = document.createElement('header');
        const searchBar = new SearchBar({
            onSearch: this.props.onSearch
        }).render();
        header.innerHTML = `
            <div class="logo">Team Early Bird</div>
        `;
        header.appendChild(searchBar);
        return header;
    }
}
//# sourceMappingURL=Header.js.map