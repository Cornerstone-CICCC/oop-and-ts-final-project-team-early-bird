import { TaskList } from "./TaskList.js";
import { Status } from "../models/Task.js";
export class KanbanBoard {
    constructor(root) {
        this.root = root;
        // 各TaskListをステータスごとに生成
        this.todoList = new TaskList(Status.todo, ".kanban-column");
        this.inProgressList = new TaskList(Status.inProgress, ".kanban-column");
        this.doneList = new TaskList(Status.done, ".kanban-column");
        this.renderBoard();
    }
    renderBoard() {
        const board = document.createElement('div');
        board.classList.add('kanban-board');
        board.append(this.todoList.render(), this.inProgressList.render(), this.doneList.render());
        this.root.appendChild(board);
        console.log(this.todoList);
        console.log(this.inProgressList);
        console.log(this.doneList);
    }
}
//# sourceMappingURL=KanbanBoard_.js.map