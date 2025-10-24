import { Status, Task } from "../models/Task.js";
import { TaskCard } from "./TaskCard.js";

export class TaskList {
    tasks: Task[] = []
    status: Status
    element: HTMLElement

    constructor(status: Status, selector: string) {
        this.status = status
        this.element = document.querySelector(selector)!
        this.loadTasks()
        this.render()
    }

    private get storageKey() {
        return `task_${this.status}`
    }

    private saveTasks() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasks))
    }

    private loadTasks() {
        const data = localStorage.getItem(this.storageKey)
        this.tasks = data ? JSON.parse(data) : []
    }

    add(newTask: Task) {
        if (!this.tasks.some(task => task.id === newTask.id)) {
            this.tasks.push(newTask)
            this.saveTasks()
        }
        this.refresh()
    }

    update(id: number, updatedTask: Partial<Task>) {
        let task = this.tasks.find(task => task.id === id)
        if (task)
            Object.assign(task, updatedTask)
        this.saveTasks()
        this.refresh()
    }

    delete(id: number) {
        this.tasks = this.tasks.filter(task => task.id !== id)
        this.saveTasks()
        this.refresh()
    }

    private refresh() {
        if (this.element != null)
            this.element.innerHTML = ''
        this.render()
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
            const dragging: HTMLElement = document.querySelector('.dragging') as HTMLElement
            taskContainer.appendChild(dragging)
        })

        this.tasks.forEach(task => {
            const card = new TaskCard(task, this)
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
            const card = new TaskCard(newTask, this)
            taskContainer.appendChild(card.render())
        })

        titleAdd.appendChild(statusTitle)
        titleAdd.appendChild(addBtn)
        column.append(titleAdd, taskContainer)
        return column
    }
}