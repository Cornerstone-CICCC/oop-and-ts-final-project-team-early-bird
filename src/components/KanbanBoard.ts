import { TaskList } from "./TaskList.js";
import { Task, Status } from "../models/Task.js";

export class KanbanBoard {
    todoList = new TaskList(Status.todo, ".kanban-column")
    inProgressList = new TaskList(Status.inProgress, ".kanban-column")
    doneList = new TaskList(Status.done, ".kanban-column")
    root: HTMLElement

    constructor(root: HTMLElement) {
        this.root = root
        this.renderBoard()
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