import { Component } from "../common/Component.js";
export class ConfirmationModal extends Component {
    constructor(props) {
        super(props);
        this.message = props.message;
        this.onConfirm = props.onConfirm;
        this.onCancel = props.onCancel || (() => { });
    }
    render() {
        var _a, _b;
        const overlay = document.createElement('div');
        overlay.classList.add('confirmation-overlay');
        const modal = document.createElement('div');
        modal.classList.add('confirmation-modal');
        modal.innerHTML = `
            <p class="confirmation-message">${this.message}</p>
            <div class="confirmation-btns">
                <button class="confirm-btn">Yes</button>
                <button class="cancel-btn">Cancel</button>
            </div>
        `;
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        overlay.addEventListener('click', e => {
            if (e.target === overlay)
                this.close();
        });
        (_a = modal.querySelector('.confirm-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            this.onConfirm();
            this.close();
        });
        (_b = modal.querySelector('.cancel-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
            this.onCancel();
            this.close();
        });
        return overlay;
    }
    close() {
        const overlay = document.querySelector(".confirmation-overlay");
        if (overlay)
            overlay.remove();
    }
}
//# sourceMappingURL=ConfirmationModal.js.map