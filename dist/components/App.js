import { Component } from "../common/Component.js";
import { KanbanBoard } from "./KanbanBoard.js";
export class App extends Component {
    render() {
        var _a;
        const appContainer = document.createElement('div');
        appContainer.classList.add('container');
        appContainer.innerHTML = `
            <div class="header"></div>
            <main></main>
            <div class="footer"></div>
        `;
        const board = new KanbanBoard({
            taskContext: this.props.taskContext
        }).render();
        (_a = appContainer.querySelector('main')) === null || _a === void 0 ? void 0 : _a.appendChild(board);
        return appContainer;
    }
}
//# sourceMappingURL=App.js.map