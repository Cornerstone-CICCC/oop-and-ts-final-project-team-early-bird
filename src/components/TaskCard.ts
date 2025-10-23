import { Task } from "../models/Task.js";

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

        el.addEventListener('dragstart', e => {
            const data = e.target as HTMLElement
            data.classList.add('dragging')
        })

        el.addEventListener('dragend', e => {
            const data = e.target as HTMLElement
            data.classList.remove('dragging')
        })

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

            modal.classList.remove('show')
            this.makeEditable(titleEl, descEl)
        })

        const deleteBtn = modal.querySelector('.delete-btn') as HTMLButtonElement
        deleteBtn.addEventListener('click', () => {
            el.remove()
        })

        return el
    }

    private makeEditable(titleEl: HTMLElement, descEl: HTMLElement) {
        const titleInput = document.createElement('input')
        titleInput.type = "text"
        titleInput.value = this.task.title
        titleInput.classList.add('edit-title')

        const descInput = document.createElement('textarea')
        descInput.rows = 5
        descInput.value = this.task.description
        descInput.classList.add('edit-desc')

        titleEl.replaceWith(titleInput)
        descEl.replaceWith(descInput)

        const saveChanges = () => {
            this.task.title = titleInput.value.trim() || this.task.title
            this.task.description = descInput.value.trim() || this.task.description

            const newTitle = document.createElement('h3')
            newTitle.className = 'task-title'
            newTitle.textContent = this.task.title

            const newDesc = document.createElement('p')
            newDesc.className = 'task-desc'
            newDesc.textContent = this.task.description

            titleInput.replaceWith(newTitle)
            descInput.replaceWith(newDesc)

            document.removeEventListener('click', handleOutsideClick)
        }

        const handleOutsideClick = (e: MouseEvent) => {
            const target = e.target as Node

            if (!titleInput.parentElement?.contains(target)) {
                saveChanges()
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