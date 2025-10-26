import { Task, Status } from "../models/Task.js";
import { TaskList } from "./TaskList.js";

export class TaskCard {
    task: Task
    tasklist: TaskList
    element: HTMLElement
    onUpdate?: (task: Task) => void
    onDelete?: (id: number) => void

    constructor(task: Task, tasklist: TaskList, onUpdate?: (task: Task) => void, onDelete?: (id: number) => void) {
        this.task = task
        this.tasklist = tasklist;
        this.onUpdate = onUpdate
        this.onDelete = onDelete
        this.element = this.createElement()
    }

    private createElement(): HTMLElement {
        const el = document.createElement('div')
        el.className = "task"
        el.setAttribute('draggable', 'true')
        el.innerHTML = `
            <div class="card-header">
                <div class="id-status">
                    <p class="task-id">#${this.task.id}</p>
                    <p class="task-status">${this.task.status}</p>
                </div>
                <span class="option-btn"><i class="fa-solid fa-ellipsis-vertical"></i></span>
            </div>
            <div class="title-desc">
                <h3 class="task-title">${this.task.title}</h3>
                <p class="task-desc">${this.task.description}</p>
            </div>
        `

        // drag-and-drop
        el.addEventListener('dragstart', e => {
            const data = e.target as HTMLElement
            const idStr = data.querySelector('.task-id')?.textContent?.replace('#', '').trim()
            if(idStr){
                e.dataTransfer?.setData('text/plain', idStr)
                console.log(idStr)
            }
            data.classList.add('dragging')
        })
        el.addEventListener('dragover', e => {
            e.preventDefault()
        })
        el.addEventListener('dragend', e => {
            const data = e.target as HTMLElement
            data.classList.remove('dragging')
            // console.log(this.task)
        })
        //

        const modal = document.createElement('div')
        modal.classList.add('btn-modal')
        modal.innerHTML = `
            <button class="edit-btn"><i class="fa-solid fa-pen"></i>Edit</button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i>Delete</button>
        `
        el.appendChild(modal)

        const optionBtn = el.querySelector('.option-btn') as HTMLElement
        optionBtn?.addEventListener('click', e => {
            e.stopPropagation()
            modal.classList.add('show')
        })

        document.addEventListener('click', e => {
            const target = e.target as Node
            if (!el.contains(target) && !modal.contains(target)) {
                modal.classList.remove('show')
            }
        })

        const editBtn = modal.querySelector('.edit-btn') as HTMLButtonElement

        editBtn.addEventListener('click', () => {
            const titleEl = el.querySelector('.task-title') as HTMLElement
            const descEl = el.querySelector('.task-desc') as HTMLElement
            const statusEl = el.querySelector('.task-status') as HTMLElement

            modal.classList.remove('show')
            this.makeEditable(titleEl, descEl, statusEl)
            this.onUpdate?.(this.task)
        })

        const deleteBtn = modal.querySelector('.delete-btn') as HTMLButtonElement
        deleteBtn.addEventListener('click', () => {
            el.remove()
            this.tasklist.delete(this.task.id)
            this.onDelete?.(this.task.id)
        })

        return el
    }

    private makeEditable(titleEl: HTMLElement, descEl: HTMLElement, statusEl: HTMLElement) {
        const titleInput = document.createElement('input')
        titleInput.type = "text"
        titleInput.value = this.task.title
        titleInput.classList.add('edit-title')

        const descInput = document.createElement('textarea')
        descInput.rows = 5
        descInput.value = this.task.description
        descInput.classList.add('edit-desc')

        const currentStatus = statusEl.textContent
        const statusSelect = document.createElement('select')
        statusSelect.classList.add('edit-status')

        interface StatusData{
            value: string,
            selected?: boolean
        }
        const statusOptions: StatusData[] = [
            { value: 'To Do' },
            { value: 'In Progress' },
            { value: 'Done' }
        ]
        statusOptions.forEach(option => {
            const optionElement: HTMLOptionElement = document.createElement('option')
            optionElement.value = option.value
            optionElement.textContent = option.value
            statusSelect.appendChild(optionElement)
        })
        statusSelect.value = `${currentStatus}`

        titleEl.replaceWith(titleInput)
        descEl.replaceWith(descInput)
        statusEl.replaceWith(statusSelect)

        const saveChanges = () => {
            this.task.title = titleInput.value.trim() || this.task.title
            this.task.description = descInput.value.trim() || this.task.description

            const oldStatus = this.task.status
            this.task.status = statusSelect.value as Status

            const updatedData = { id: this.task.id, title: this.task.title, description: this.task.description, status: this.task.status }

            this.tasklist.update(this.task.id, updatedData)

            if(oldStatus !== this.task.status){
                this.tasklist.delete(this.task.id)
                this.tasklist.render()

                console.log(`${oldStatus} ===> ${this.task.status}`)
                // console.log(this.tasklist)

                // const newList = this.tasklist.this.task.status)
                // newList.add(this.task)
                // newList.render()

                console.log(this.tasklist.status) // todo
            }

            const newTitle = document.createElement('h3')
            newTitle.className = 'task-title'
            newTitle.textContent = this.task.title

            const newDesc = document.createElement('p')
            newDesc.className = 'task-desc'
            newDesc.textContent = this.task.description

            const newStatus = document.createElement('p')
            newStatus.className = 'task-status'
            newStatus.textContent = this.task.status

            titleInput.replaceWith(newTitle)
            descInput.replaceWith(newDesc)
            statusSelect.replaceWith(newStatus)

            document.removeEventListener('click', handleOutsideClick)
        }

        const handleOutsideClick = (e: MouseEvent) => {
            const target = e.target as Node

            if (!titleInput.parentElement?.contains(target) && !statusSelect.contains(target)) {

                saveChanges()
                // console.log(this.task) // todo - done (item)
            }
        }

        titleInput.addEventListener('keypress', e => {
            if (e.key === "Enter") {
                e.preventDefault()
                descInput.focus()
            }
        })

        descInput.addEventListener('focus', () => {
            titleInput.blur()
        })

        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick)
        }, 0)

    }

    render(): HTMLElement {
        return this.element
    }
}