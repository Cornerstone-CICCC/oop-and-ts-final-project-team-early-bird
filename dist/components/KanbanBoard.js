import { Component } from "../common/Component.js";
import { TaskList } from "./TaskList.js";
import { Status } from "../model/Status.js";
export class KanbanBoard extends Component {
    constructor(props) {
        super(props);
        this.props.taskContext.subscribe(() => {
            this.refresh();
        });
    }
    render() {
        const board = document.createElement('div');
        board.classList.add('kanban-board');
        const statuses = [Status.todo, Status.inProgress, Status.done];
        statuses.forEach(status => {
            const column = new TaskList({
                status,
                taskContext: this.props.taskContext,
                searchQuery: this.props.searchQuery,
                onTaskDrop: (task, newStatus) => this.refresh()
            }).render();
            board.appendChild(column);
        });
        return board;
    }
    refresh() {
        const oldBoard = document.querySelector('.kanban-board');
        if (oldBoard) {
            const newBoard = this.render();
            oldBoard.replaceWith(newBoard);
        }
    }
}
//# sourceMappingURL=KanbanBoard.js.map