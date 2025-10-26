import { Task } from "../model/Task.js"
import { Status } from "../model/Status.js"

export class TaskContext {
    tasks: Task[] = []
    listeners: Function[] = []

    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
        this.listeners = []
        this.loadTasks()
    }

    private saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
        this.notifyListeners()
    }

    private loadTasks() {
        const data = localStorage.getItem('tasks')
        this.tasks = data ? JSON.parse(data) : []
    }

    getAll(): Task[] {
        return this.tasks
    }

    add(newTask: Task) {
        this.tasks.push(newTask)
        this.saveTasks()
        this.notifyListeners()
    }

    update(id: number, updatedTask: Task) {
        let index = this.tasks.findIndex(task => task.id === id)
        if (index !== -1) {
            this.tasks[index] = updatedTask
            this.saveTasks()
            this.notifyListeners?.()
        }
    }

    delete(id: number) {
        this.tasks = this.tasks.filter(task => task.id !== id)
        this.saveTasks()
        this.notifyListeners()
    }

    getByStatus(status: Status) {
        return this.tasks.filter(t => t.status === status)
    }

    subscribe(listener: Function) {
        this.listeners.push(listener)
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener())
    }
}