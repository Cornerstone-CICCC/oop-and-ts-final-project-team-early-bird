// src/components/Modal.ts
export interface ModalOptions {
  title?: string;
  content?: string | HTMLElement;
  onClose?: () => void;
  hideDefaultClose?: boolean; // ✅ 새 옵션 추가
}

export class Modal {
  private static instance: Modal | null = null;
  private modalElem: HTMLElement | null = null;
  private currentOptions: ModalOptions | null = null;
  private static rootId = "modal-root";

  constructor() {
    if (Modal.instance) return Modal.instance;
    Modal.instance = this;
  }

  open(options: ModalOptions) {
    this.currentOptions = options;
    this._render();
  }

  private _render() {
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

    if (this.currentOptions?.title) {
      const h2 = document.createElement("h2");
      h2.textContent = this.currentOptions.title;
      card.appendChild(h2);
    }

    if (this.currentOptions?.content) {
      if (typeof this.currentOptions.content === "string") {
        const div = document.createElement("div");
        div.innerHTML = this.currentOptions.content;
        card.appendChild(div);
      } else {
        card.appendChild(this.currentOptions.content);
      }
    }

    // ✅ Delete 같은 경우엔 기본 close 버튼 안 붙임
    if (!this.currentOptions?.hideDefaultClose) {
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
    if (this.modalElem && this.modalElem.parentElement) {
      this.modalElem.parentElement.removeChild(this.modalElem);
      this.modalElem = null;
    }
    this.currentOptions?.onClose?.();
    this.currentOptions = null;
  }
}
