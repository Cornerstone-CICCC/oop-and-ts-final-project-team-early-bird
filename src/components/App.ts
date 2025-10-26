import { Component } from "../common/Component.js";
import { KanbanBoard } from "./KanbanBoard.js";

export class App extends Component {
    render() {
        const appContainer = document.createElement('div')
        appContainer.classList.add('container')
        appContainer.innerHTML = `
            <div class="header"></div>
            <main></main>
            <div class="footer"></div>
        `

        const board = new KanbanBoard({
            taskContext: this.props.taskContext
        }).render()
        appContainer.querySelector('main')?.appendChild(board)

        return appContainer
    }
}