import { Component } from "../common/Component.js";
import { TaskCard } from "./TaskCard.js";
import { Task } from "../model/Task.js";
import { Status } from "../model/Status.js";
import { TaskListProps } from "../model/TaskListProps.js";

export class TaskList extends Component {
    constructor(props: TaskListProps) {
        super(props)
    }

    render() {
        const { taskContext, status } = this.props

        const column = document.createElement("div")
        column.classList.add("kanban-column")
        column.dataset.status = this.props.status

        const titleAdd = document.createElement('div')
        titleAdd.classList.add('title-add')
        titleAdd.innerHTML = `
            <h2>${status}</h2>
            <button class="add-task-btn"><i class="fa-solid fa-plus"></i></button>
        `

        const taskContainer = document.createElement('div')
        taskContainer.classList.add('task-container')

        taskContainer.addEventListener('dragover', e => {
            e.preventDefault()
            taskContainer.classList.add('drag-over')
        })

        taskContainer.addEventListener('drop', e => {
            e.preventDefault()
            taskContainer.classList.remove('drag-over')

            const data = e.dataTransfer?.getData('text/plain')
            if (data) {
                const task = JSON.parse(data)
                const newStatus = this.props.status as Status

                this.props.taskContext.update(task.id, { ...task, status: newStatus })

                this.props.onTaskDrop?.(task, newStatus)
            }
        })

        taskContainer.addEventListener('dragleave', () => {
            taskContainer.classList.remove('drag-over')
        })

        const tasks = taskContext.getByStatus(status)
        tasks.forEach((task: Task) => {
            const card = new TaskCard({ task, taskContext }).render()
            taskContainer.appendChild(card)
        })

        titleAdd.querySelector('.add-task-btn')?.addEventListener('click', () => {
            const newTask: Task = {
                id: Math.floor(Math.random() * 10000),
                title: "New Task",
                description: "Add Description",
                status: status
            }

            taskContext.add(newTask)
        })

        column.appendChild(titleAdd)
        column.appendChild(taskContainer)
        return column
    }
}