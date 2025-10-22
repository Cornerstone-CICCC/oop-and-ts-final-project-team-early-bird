import { TaskList } from "./TaskList.js";
export class KanbanBoard {
    constructor(root) {
        this.todoList = new TaskList("todo");
        this.inProgressList = new TaskList("in-progress");
        this.doneList = new TaskList("done");
        this.root = root;
        this.loadDummyData();
        this.renderBoard();
    }
    loadDummyData() {
        const dummyTasks = [
            { id: 1, title: "Setup project", description: "Initialize TypeScript project", status: "todo" },
            { id: 2, title: "Design UI", description: "Sketch Kanban layout", status: "in-progress" },
            { id: 3, title: "Build TaskCard", description: "Implement draggable task card", status: "done" }
        ];
        dummyTasks.forEach(task => {
            if (task.status === "todo")
                this.todoList.add(task);
            if (task.status === "in-progress")
                this.inProgressList.add(task);
            if (task.status === "done")
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