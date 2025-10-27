import { Component } from "../common/Component.js";
import { Status } from "../model/Status.js";
import { ConfirmationModal } from "./ConfirmationModal.js";
export class TaskModal extends Component {
    constructor(props) {
        super(props);
        this.task = props.task;
        this.onClose = props.onClose;
    }
    render() {
        var _a, _b, _c;
        const overlay = document.createElement('div');
        overlay.classList.add('task-modal-overlay');
        const modal = document.createElement('div');
        modal.classList.add('task-modal');
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
        `;
        const modalSelect = modal.querySelector('.modal-edit-status');
        const options = [
            { value: Status.todo, label: Status.todo },
            { value: Status.inProgress, label: Status.inProgress },
            { value: Status.done, label: Status.done }
        ];
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            if (opt.value === this.task.status)
                option.selected = true;
            modalSelect === null || modalSelect === void 0 ? void 0 : modalSelect.appendChild(option);
        });
        overlay.appendChild(modal);
        overlay.addEventListener('click', e => {
            if (e.target === overlay)
                this.close();
        });
        (_a = modal.querySelector('.close-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => this.close());
        (_b = modal.querySelector('.save-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
            const newStatus = modal.querySelector('.modal-edit-status').value;
            const newTitle = modal.querySelector('.modal-edit-title').value.trim();
            const newDesc = modal.querySelector('.modal-edit-desc').value.trim();
            this.task.status = newStatus;
            this.task.title = newTitle;
            this.task.description = newDesc;
            this.props.taskContext.update(this.task.id, this.task);
            this.close();
        });
        (_c = modal.querySelector('.modal-delete-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
            new ConfirmationModal({
                message: "Are you sure you want to delete this task?",
                onConfirm: () => {
                    this.props.taskContext.delete(this.task.id);
                    overlay.remove();
                    if (this.onClose)
                        this.onClose();
                },
                onCancel: () => {
                    return;
                }
            }).render();
        });
        document.body.appendChild(overlay);
        return overlay;
    }
    close() {
        const overlay = document.querySelector('.task-modal-overlay');
        if (overlay)
            overlay.remove();
        this.onClose();
    }
}
//# sourceMappingURL=TaskModal.js.map