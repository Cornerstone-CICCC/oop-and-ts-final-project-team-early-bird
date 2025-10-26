// component/Modal.ts
export interface ModalOptions {
  title?: string;
  content?: string | HTMLElement;
  onClose?: () => void;
}

export class Modal {
  private static instance: Modal | null = null; // 싱글턴(한 번만 생성)
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
    if (this.modalElem && this.modalElem.parentElement) {
      this.modalElem.parentElement.removeChild(this.modalElem);
      this.modalElem = null;
    }
    if (this.currentOptions?.onClose) this.currentOptions.onClose();
    this.currentOptions = null;
  }
}
