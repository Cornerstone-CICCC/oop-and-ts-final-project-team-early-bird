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
        var _a, _b, _c;
        if (this.modalElem && this.modalElem.parentElement) {
            this.modalElem.parentElement.removeChild(this.modalElem);
            this.modalElem = null;
        }
        let root = document.getElementById(Modal.rootId);
        if (!root) {
            root = document.createElement("div");
            root.id = Modal.rootId;
            document.body.appendChild(root);
        }
        const bg = document.createElement("div");
        bg.className = "modal-bg";
        bg.addEventListener("click", () => this.close());
        const card = document.createElement("div");
        card.className = "modal-card";
        card.addEventListener("click", (e) => e.stopPropagation());
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
        // ✅ Delete 같은 경우엔 기본 close 버튼 안 붙임
        if (!((_c = this.currentOptions) === null || _c === void 0 ? void 0 : _c.hideDefaultClose)) {
            const closeBtn = document.createElement("button");
            closeBtn.className = "modal-close-btn";
            closeBtn.textContent = "Close";
            closeBtn.addEventListener("click", () => this.close());
            card.appendChild(closeBtn);
        }
        bg.appendChild(card);
        root.appendChild(bg);
        this.modalElem = bg;
    }
    close() {
        var _a, _b;
        if (this.modalElem && this.modalElem.parentElement) {
            this.modalElem.parentElement.removeChild(this.modalElem);
            this.modalElem = null;
        }
        (_b = (_a = this.currentOptions) === null || _a === void 0 ? void 0 : _a.onClose) === null || _b === void 0 ? void 0 : _b.call(_a);
        this.currentOptions = null;
    }
}
Modal.instance = null;
Modal.rootId = "modal-root";
//# sourceMappingURL=Modal.js.map