import { Component } from "../common/Component.js";
import { Task } from "../model/Task.js";
import { Status } from "../model/Status.js";
import { TaskModal } from "./TaskModal.js";
import { ConfirmationModal } from "./ConfirmationModal.js";

export class TaskCard extends Component {
    static openModal: HTMLElement | null = null
    static editingCard: HTMLElement | null = null
    static editingTask: Task | null = null
    static saveChangesCallback: (() => void) | null = null
    static openModalInstance: HTMLElement | null = null

    render() {
        const task: Task = this.props.task

        const el = document.createElement('div')
        el.className = "task"
        el.setAttribute('draggable', 'true')

        el.addEventListener('dragstart', e => {
            if (TaskCard.editingCard || document.querySelector('.task-modal-overlay')) {
                e.preventDefault()
                return;
            }

            e.dataTransfer?.setData('text/plain', JSON.stringify(task))
            el.classList.add('dragging')
        })

        el.addEventListener('dragend', () => {
            el.classList.remove('dragging')
        })

        el.addEventListener('dblclick', e => {
            const target = e.target as HTMLElement
            if (
                target.closest('.option-btn') ||
                target.closest('.btn-modal') ||
                target.closest('button') ||
                TaskCard.editingCard
            ) return

            this.openTaskModal(task)
        })

        el.innerHTML = `
            <div class="card-header">
                <div class="id-status">
                    <p class="task-id">#${task.id}</p>
                    <p class="task-status">${task.status}</p>
                </div>
                <span class="option-btn"><i class="fa-solid fa-ellipsis-vertical"></i></span>
            </div>
            <div class="title-desc">
                <h3 class="task-title">${task.title}</h3>
                <p class="task-desc">${task.description}</p>
            </div>
        `

        const modal = document.createElement('div')
        modal.classList.add('btn-modal')
        modal.innerHTML = `
            <button class="edit-btn"><i class="fa-solid fa-pen"></i>Edit</button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i>Delete</button>
        `
        el.appendChild(modal)

        const optionBtn = el.querySelector('.option-btn') as HTMLElement
        optionBtn.addEventListener('click', e => {
            e.stopPropagation()

            if (TaskCard.saveChangesCallback) {
                TaskCard.saveChangesCallback()
                TaskCard.saveChangesCallback = null
                TaskCard.editingCard = null
                TaskCard.editingTask = null
            }

            if (TaskCard.openModal && TaskCard.openModal !== modal) {
                TaskCard.openModal.classList.remove('show')
            }

            const isOpen = modal.classList.contains('show')
            modal.classList.toggle('show', !isOpen)
            TaskCard.openModal = isOpen ? null : modal
        })

        document.addEventListener('click', e => {
            const target = e.target as Node
            if (!el.contains(target)) {
                modal.classList.remove('show')
            }
        })

        // Delete
        const deleteBtn = modal.querySelector('.delete-btn') as HTMLButtonElement
        deleteBtn.addEventListener('click', () => {
            new ConfirmationModal({
                message: "Are you sure you want to delete this task?",
                onConfirm: () => {
                    el.remove()
                    this.props.taskContext.delete(task.id)
                },
                onCancel: () => {
                    return
                }
            }).render()
        })

        // Edit
        const editBtn = modal.querySelector('.edit-btn') as HTMLButtonElement
        editBtn.addEventListener('click', () => {
            modal.classList.remove('show')
            this.makeEditable(task, el)
        })

        return el
    }

    private makeEditable(task: Task, el: HTMLElement) {
        el.classList.add('editing')
        el.setAttribute('draggable', 'false')

        const statusEl = el.querySelector('.task-status') as HTMLElement
        const titleEl = el.querySelector('.task-title') as HTMLElement
        const descEl = el.querySelector('.task-desc') as HTMLElement

        const statusSelect = document.createElement('select')
        const options = [
            { value: Status.todo, label: Status.todo },
            { value: Status.inProgress, label: Status.inProgress },
            { value: Status.done, label: Status.done }
        ]
        options.forEach(opt => {
            const option = document.createElement('option')
            option.value = opt.value
            option.textContent = opt.label
            if (opt.value === task.status) option.selected = true
            statusSelect.appendChild(option)
        })

        const titleInput = document.createElement('input')
        titleInput.type = "text"
        titleInput.value = task.title
        titleInput.classList.add('edit-title')

        const descInput = document.createElement('textarea')
        descInput.rows = 5
        descInput.value = task.description
        descInput.classList.add('edit-desc')

        statusEl.replaceWith(statusSelect)
        titleEl.replaceWith(titleInput)
        descEl.replaceWith(descInput)

        const saveChanges = () => {
            task.status = statusSelect.value as Status
            task.title = titleInput.value.trim() || task.title
            task.description = descInput.value.trim() || task.description

            this.props.taskContext.update(task.id, task)

            const newStatus = document.createElement('p')
            newStatus.className = 'task-status'
            newStatus.textContent = task.status

            const newTitle = document.createElement('h3')
            newTitle.className = 'task-title'
            newTitle.textContent = task.title

            const newDesc = document.createElement('p')
            newDesc.className = 'task-desc'
            newDesc.textContent = task.description

            statusSelect.replaceWith(newStatus)
            titleInput.replaceWith(newTitle)
            descInput.replaceWith(newDesc)

            document.removeEventListener('click', handleOutsideClick)

            el.classList.remove('editing')
            el.setAttribute('draggable', 'true')

            TaskCard.saveChangesCallback = null
            TaskCard.editingCard = null
            TaskCard.editingTask = null
        }

        const handleOutsideClick = (e: MouseEvent) => {
            const target = e.target as Node
            if (!el.contains(target)) saveChanges()
        }

        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 0)

        TaskCard.editingCard = el
        TaskCard.editingTask = task
        TaskCard.saveChangesCallback = saveChanges
    }

    private openTaskModal(task: Task) {
        if (TaskCard.openModalInstance) {
            TaskCard.openModalInstance.remove()
            TaskCard.openModalInstance = null
        }

        const taskModal = new TaskModal({
            task,
            taskContext: this.props.taskContext,
            onClose: () => {
                TaskCard.openModalInstance = null
                this.props.taskContext.notifyListeners()
            }
        }).render()

        TaskCard.openModalInstance = taskModal
    }
}