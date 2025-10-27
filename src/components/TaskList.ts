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

    static updateTaskInStorage(id: number, newStatus: Status, newTitle?: string, newDesc?: string){
        const buckets: Status[] = [Status.todo, Status.inProgress, Status.done]

        for(const status of buckets){
            const arr: Task[] = JSON.parse(localStorage.getItem(`task_${status}`) || "[]")
            const idx = arr.findIndex(t => t.id === id)
            if(idx !== -1){
                const task = arr[idx]
                if(status !== newStatus){
                    arr.splice(idx, 1)
                    localStorage.setItem(`task_${status}`, JSON.stringify(arr))

                    const newArr: Task[] = JSON.parse(localStorage.getItem(`task_${newStatus}`) || "[]")
                    newArr.push({
                        id: id,
                        title: newTitle || task.title,
                        description: newDesc || task.description,
                        status: newStatus
                    })
                    localStorage.setItem(`task_${newStatus}`, JSON.stringify(newArr))
                } else {
                    arr[idx] = {
                        ...task,
                        title: newTitle || task.title,
                        description: newDesc || task.description
                    }
                    localStorage.setItem(`task_${status}`, JSON.stringify(arr))
                }
                break
            }
        }
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
            if (!dragging) return

            taskContainer.appendChild(dragging)

            const idNum = parseInt((dragging.querySelector(".task-id") as HTMLElement)?.textContent?.replace("#","") || "-1")
            const newStatus = dragging.closest(".kanban-column")?.querySelector("h2")?.textContent as Status || Status.todo

            TaskList.updateTaskInStorage(idNum, newStatus)

            const statusEl = dragging.querySelector(".task-status") as HTMLElement | null
            if (statusEl) statusEl.textContent = newStatus
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