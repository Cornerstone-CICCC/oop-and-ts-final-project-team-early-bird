import { Component } from "../common/Component.js";
import { AppProps } from "../model/AppProps.js";
import { Header } from "./Header.js";
import { KanbanBoard } from "./KanbanBoard.js";
import { Footer } from "./Footer.js";

export class App extends Component {
    searchQuery: string

    constructor(props: AppProps) {
        super(props)
        this.searchQuery = ''
    }
    render() {
        const appContainer = document.createElement('div')
        appContainer.classList.add('container')
        appContainer.innerHTML = `
            <div class="header"></div>
            <main></main>
            <div class="footer"></div>
        `

        const header = new Header({
            onSearch: (query: string) => {
                this.searchQuery = query
                this.refresh()
            }
        }).render()
        appContainer.querySelector('.header')?.appendChild(header)

        const board = new KanbanBoard({
            taskContext: this.props.taskContext,
            searchQuery: this.searchQuery
        }).render()
        appContainer.querySelector('main')?.appendChild(board)

        const footer = new Footer().render()
        appContainer.querySelector('.footer')?.appendChild(footer)

        return appContainer
    }

    refresh() {
        const root = document.querySelector('#app')
        if (root) {
            const newApp = this.render()
            root.replaceWith(newApp)
        }
    }
}