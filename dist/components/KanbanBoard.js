import { TaskList } from "./TaskList.js";
import { Status } from "../models/Task.js";
export class KanbanBoard {
    constructor(root) {
        this.todoList = new TaskList(Status.todo, ".kanban-column");
        this.inProgressList = new TaskList(Status.inProgress, ".kanban-column");
        this.doneList = new TaskList(Status.done, ".kanban-column");
        this.root = root;
        this.renderBoard();
    }
    renderBoard() {
        const board = document.createElement('div');
        board.classList.add('kanban-board');
        board.append(this.todoList.render(), this.inProgressList.render(), this.doneList.render());
        this.root.appendChild(board);
    }
}
//# sourceMappingURL=KanbanBoard.js.map