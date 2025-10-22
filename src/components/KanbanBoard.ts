import { TaskList } from "./TaskList.js";
import { Task } from "../models/Task.js";

export class KanbanBoard {
    todoList = new TaskList("todo")
    inProgressList = new TaskList("in-progress")
    doneList = new TaskList("done")
    root: HTMLElement

    constructor(root: HTMLElement) {
        this.root = root
        this.loadDummyData()
        this.renderBoard()
    }

    loadDummyData() {
        const dummyTasks: Task[] = [
            { id: 1, title: "Setup project", description: "Initialize TypeScript project", status: "todo" },
            { id: 2, title: "Design UI", description: "Sketch Kanban layout", status: "in-progress" },
            { id: 3, title: "Build TaskCard", description: "Implement draggable task card", status: "done" }
        ]

        dummyTasks.forEach(task => {
            if (task.status === "todo") this.todoList.add(task)
            if (task.status === "in-progress") this.inProgressList.add(task)
            if (task.status === "done") this.doneList.add(task)
        })
    }

    renderBoard() {
        const board = document.createElement('div')
        board.classList.add('kanban-board')

        board.append(
            this.todoList.render(),
            this.inProgressList.render(),
            this.doneList.render()
        )

        this.root.appendChild(board)
    }
}