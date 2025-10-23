import { TaskList } from "./TaskList.js";
import { Status } from "../models/Task.js";
export class KanbanBoard {
    constructor(root) {
        this.todoList = new TaskList(Status.todo);
        this.inProgressList = new TaskList(Status.inProgress);
        this.doneList = new TaskList(Status.done);
        this.root = root;
        this.loadDummyData();
        this.renderBoard();
    }
    loadDummyData() {
        const dummyTasks = [
            { id: 1, title: "Setup project", description: "Initialize TypeScript project", status: Status.todo },
            { id: 2, title: "Design UI", description: "Sketch Kanban layout", status: Status.inProgress },
            { id: 3, title: "Build TaskCard", description: "Implement draggable task card", status: Status.done }
        ];
        dummyTasks.forEach(task => {
            if (task.status === Status.todo)
                this.todoList.add(task);
            if (task.status === Status.inProgress)
                this.inProgressList.add(task);
            if (task.status === Status.done)
                this.doneList.add(task);
        });
    }
    renderBoard() {
        const board = document.createElement('div');
        board.classList.add('kanban-board');
        board.append(this.todoList.render(), this.inProgressList.render(), this.doneList.render());
        this.root.appendChild(board);
    }
}
//# sourceMappingURL=KanbanBoard.js.map