import { Component } from "../common/Component.js";
import { Status } from "../model/Status.js";
import { Task } from "../model/Task.js";
import { ConfirmationModal } from "./ConfirmationModal.js";

export class TaskModal extends Component {
    task: Task
    onClose: () => void

    constructor(props: { task: Task, taskContext: any, onClose: () => void }) {
        super(props)
        this.task = props.task
        this.onClose = props.onClose
    }

    render() {
        const overlay = document.createElement('div')
        overlay.classList.add('task-modal-overlay')

        const modal = document.createElement('div')
        modal.classList.add('task-modal')

        modal.innerHTML = `
            <div class="id-status">
                <h2>#${this.task.id}</h2>
                <select class="modal-edit-status"></select>
            </div>
            <button class="close-btn"><i class="fa-solid fa-xmark"></i></button>
            <div class="title-input">
                <label>Title</label>
                <input type="text" class="modal-edit-title" value="${this.task.title}" />
            </div>
            <div class="desc-input">
                <label>Description</label>
                <textarea class="modal-edit-desc" rows="5">${this.task.description}</textarea>
            </div>
            <div class="save-delete">
                <button class="save-btn">Save</button>
                <button class="modal-delete-btn">Delete</button>
        `

        const modalSelect = modal.querySelector('.modal-edit-status')
        const options = [
            { value: Status.todo, label: Status.todo },
            { value: Status.inProgress, label: Status.inProgress },
            { value: Status.done, label: Status.done }
        ]

        options.forEach(opt => {
            const option = document.createElement('option')
            option.value = opt.value
            option.textContent = opt.label
            if (opt.value === this.task.status) option.selected = true
            modalSelect?.appendChild(option)
        })

        overlay.appendChild(modal)

        overlay.addEventListener('click', e => {
            if (e.target === overlay) this.close()
        })

        modal.querySelector('.close-btn')?.addEventListener('click', () => this.close())

        modal.querySelector('.save-btn')?.addEventListener('click', () => {
            const newStatus = (modal.querySelector('.modal-edit-status') as HTMLSelectElement).value as Status
            const newTitle = (modal.querySelector('.modal-edit-title') as HTMLInputElement).value.trim()
            const newDesc = (modal.querySelector('.modal-edit-desc') as HTMLTextAreaElement).value.trim()

            this.task.status = newStatus
            this.task.title = newTitle
            this.task.description = newDesc

            this.props.taskContext.update(this.task.id, this.task)
            this.close()
        })

        modal.querySelector('.modal-delete-btn')?.addEventListener('click', () => {
            new ConfirmationModal({
                message: "Are you sure you want to delete this task?",
                onConfirm: () => {
                    this.props.taskContext.delete(this.task.id)
                    overlay.remove()
                    if (this.onClose) this.onClose()
                },
                onCancel: () => {
                    return
                }
            }).render()
        })

        document.body.appendChild(overlay)
        return overlay
    }

    close() {
        const overlay = document.querySelector('.task-modal-overlay')
        if (overlay) overlay.remove()
        this.onClose()
    }
}