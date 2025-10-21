import { Task } from "../models/Task";
import { TaskCard } from "./TaskCard";

export class TaskList {
    tasks: Task[] = []
    status: "todo" | "in-progress" | "done"

    constructor(status: "todo" | "in-progress" | "done") {
        this.status = status
    }

    add(newTask: Task) {
        this.tasks.push(newTask)
    }

    update(id: number, updatedTask: Partial<Task>) {
        const task = this.tasks.find(task => task.id === id)
        if (task) Object.assign(task, updatedTask)
    }

    delete(id: number) {
        this.tasks = this.tasks.filter(task => task.id !== id)
    }

    render(): HTMLElement {
        const column = document.createElement("div")
        column.classList.add("kanban-column")

        const statusTitle = document.createElement("h2")
        statusTitle.textContent = this.status === "todo"
            ? "To Do"
            : this.status === "in-progress"
                ? "In Progress"
                : "Done"
        const taskContainer = document.createElement('div')
        taskContainer.classList.add('task-container')

        this.tasks.forEach(task => {
            const card = new TaskCard(task)
            taskContainer.appendChild(card.render())
        })

        column.append(statusTitle, taskContainer)
        return column
    }
}