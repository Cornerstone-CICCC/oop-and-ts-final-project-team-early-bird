import { Task } from "../models/Task";

export class TaskCard {
    task: Task
    element: HTMLElement

    constructor(task: Task) {
        this.task = task
        this.element = this.createElement()
    }

    private createElement(): HTMLElement {
        const el = document.createElement('div')
        el.className = "task"
        el.innerHTML = `
            <div class="id-status">
                <p class="task-id">#${this.task.id}</p>
                <p class="task-status">${this.task.status}</p>
                <span><i class="fa-solid fa-ellipsis-vertical"></i></span>
            </div>
            <div class="title-desc">
                <h3>${this.task.title}</h3>
                <p>${this.task.description}</p>
            </div>
        `

        return el
    }

    render(): HTMLElement {
        return this.element
    }
}