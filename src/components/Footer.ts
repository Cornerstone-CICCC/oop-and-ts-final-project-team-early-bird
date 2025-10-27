// src/components/Footer.ts
export class Footer {
  root: HTMLElement;

  constructor() {
    this.root = this.createFooter();
  }

  private createFooter(): HTMLElement {
    const footer = document.createElement('footer');
    const p = document.createElement('p');
    p.innerHTML = '&copy; 2025 Team Early Bird';
    footer.appendChild(p);
    return footer;
  }

  mountAfter(target: Element | null) {
    const parent = (target && target.parentElement) || document.body;
    if (target && parent) parent.insertBefore(this.root, target.nextSibling);
    else document.body.appendChild(this.root);
  }

  mountAtBottom() {
    document.body.appendChild(this.root);
  }

  unmount() {
    this.root.remove();
  }
}
