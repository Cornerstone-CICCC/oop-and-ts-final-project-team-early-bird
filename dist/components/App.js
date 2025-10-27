import { Component } from "../common/Component.js";
import { Header } from "./Header.js";
import { KanbanBoard } from "./KanbanBoard.js";
import { Footer } from "./Footer.js";
export class App extends Component {
    constructor(props) {
        super(props);
        this.searchQuery = '';
    }
    render() {
        var _a, _b, _c;
        const appContainer = document.createElement('div');
        appContainer.classList.add('container');
        appContainer.innerHTML = `
            <div class="header"></div>
            <main></main>
            <div class="footer"></div>
        `;
        const header = new Header({
            onSearch: (query) => {
                this.searchQuery = query;
                this.refresh();
            }
        }).render();
        (_a = appContainer.querySelector('.header')) === null || _a === void 0 ? void 0 : _a.appendChild(header);
        const board = new KanbanBoard({
            taskContext: this.props.taskContext,
            searchQuery: this.searchQuery
        }).render();
        (_b = appContainer.querySelector('main')) === null || _b === void 0 ? void 0 : _b.appendChild(board);
        const footer = new Footer().render();
        (_c = appContainer.querySelector('.footer')) === null || _c === void 0 ? void 0 : _c.appendChild(footer);
        return appContainer;
    }
    refresh() {
        const root = document.querySelector('#app');
        if (root) {
            const newApp = this.render();
            root.replaceWith(newApp);
        }
    }
}
//# sourceMappingURL=App.js.map