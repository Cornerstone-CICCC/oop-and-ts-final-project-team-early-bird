export class Modal {
    constructor() {
        this.modalElem = null;
        this.currentOptions = null;
        if (Modal.instance)
            return Modal.instance;
        Modal.instance = this;
    }
    open(options) {
        this.currentOptions = options;
        this._render();
    }
    _render() {
        var _a, _b;
        this.close(); // 기존 모달 제거
        let root = document.getElementById(Modal.rootId);
        if (!root) {
            root = document.createElement("div");
            root.id = Modal.rootId;
            document.body.appendChild(root);
        }
        const bg = document.createElement("div");
        bg.className = "modal-bg";
        bg.onclick = () => this.close();
        const card = document.createElement("div");
        card.className = "modal-card";
        card.onclick = (e) => e.stopPropagation();
        if ((_a = this.currentOptions) === null || _a === void 0 ? void 0 : _a.title) {
            const h2 = document.createElement("h2");
            h2.textContent = this.currentOptions.title;
            card.appendChild(h2);
        }
        if ((_b = this.currentOptions) === null || _b === void 0 ? void 0 : _b.content) {
            if (typeof this.currentOptions.content === "string") {
                const div = document.createElement("div");
                div.innerHTML = this.currentOptions.content;
                card.appendChild(div);
            }
            else {
                card.appendChild(this.currentOptions.content);
            }
        }
        const closeBtn = document.createElement("button");
        closeBtn.className = "modal-close-btn";
        closeBtn.textContent = "닫기";
        closeBtn.onclick = () => this.close();
        card.appendChild(closeBtn);
        bg.appendChild(card);
        root.appendChild(bg);
        this.modalElem = bg;
    }
    close() {
        var _a;
        if (this.modalElem && this.modalElem.parentElement) {
            this.modalElem.parentElement.removeChild(this.modalElem);
            this.modalElem = null;
        }
        if ((_a = this.currentOptions) === null || _a === void 0 ? void 0 : _a.onClose)
            this.currentOptions.onClose();
        this.currentOptions = null;
    }
}
Modal.instance = null; // 싱글턴(한 번만 생성)
Modal.rootId = "modal-root";
//# sourceMappingURL=Modal.js.map