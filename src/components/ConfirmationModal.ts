import { Component } from "../common/Component.js";

export class ConfirmationModal extends Component {
    message: string
    onConfirm: () => void
    onCancel: () => void

    constructor(props: { message: string, onConfirm: () => void, onCancel: () => void }) {
        super(props)
        this.message = props.message
        this.onConfirm = props.onConfirm
        this.onCancel = props.onCancel || (() => { })
    }

    render() {
        const overlay = document.createElement('div')
        overlay.classList.add('confirmation-overlay')

        const modal = document.createElement('div')
        modal.classList.add('confirmation-modal')

        modal.innerHTML = `
            <p class="confirmation-message">${this.message}</p>
            <div class="confirmation-btns">
                <button class="confirm-btn">Yes</button>
                <button class="cancel-btn">Cancel</button>
            </div>
        `

        overlay.appendChild(modal)
        document.body.appendChild(overlay)

        overlay.addEventListener('click', e => {
            if (e.target === overlay) this.close()
        })

        modal.querySelector('.confirm-btn')?.addEventListener('click', () => {
            this.onConfirm()
            this.close()
        })

        modal.querySelector('.cancel-btn')?.addEventListener('click', () => {
            this.onCancel()
            this.close()
        })

        return overlay
    }

    close() {
        const overlay = document.querySelector(".confirmation-overlay")
        if (overlay) overlay.remove()
    }
}