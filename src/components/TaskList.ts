import { Status, Task } from "../models/Task.js";
import { TaskCard } from "./TaskCard.js";

export class TaskList {
    tasks: Task[] = []
    status: Status

    constructor(status: Status) {
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
        const titleAdd = document.createElement('div')
        titleAdd.classList.add('title-add')

        const statusTitle = document.createElement("h2")
        statusTitle.textContent = this.status
        const addBtn = document.createElement('button')
        addBtn.classList.add('add-task-btn')
        addBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`
        const taskContainer = document.createElement('div')
        taskContainer.classList.add('task-container')

        taskContainer.addEventListener('dragover', e => {
            e.preventDefault()
        })

        taskContainer.addEventListener('drop', e => {
            e.preventDefault()
            const dragging : HTMLElement = document.querySelector('.dragging') as HTMLElement
            taskContainer.appendChild(dragging)
        })

        this.tasks.forEach(task => {
            const card = new TaskCard(task)
            taskContainer.appendChild(card.render())
        })

        addBtn.addEventListener('click', () => {
            const newTask: Task = {
                id: Math.floor(Math.random() * 10000),
                title: "New Task",
                description: "Add Description",
                status: this.status
            }

            this.add(newTask)
            const card = new TaskCard(newTask)
            taskContainer.appendChild(card.render())
        })

        titleAdd.appendChild(statusTitle)
        titleAdd.appendChild(addBtn)
        column.append(titleAdd, taskContainer)
        return column
    }
}