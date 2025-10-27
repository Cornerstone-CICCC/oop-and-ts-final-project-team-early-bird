// src/components/SearchBar.ts
export class SearchBar {
  root: HTMLElement;
  input!: HTMLInputElement;
  private btn!: HTMLButtonElement;

  private items: string[] = [];
  private filtered: string[] = [];
  private debounceDelay = 180;
  private debouncer?: number;

  /** 타이핑 프리뷰 (모달 X) */
  onSearch: ((query: string, results: string[]) => void) | null = null;
  /** 제출(Enter/아이콘 클릭) → 모달 트리거 */
  onSubmit: ((query: string, results: string[]) => void) | null = null;

  constructor() {
    this.root = this.createSearchBar();
    this.addEventListeners();
  }

  setItems(items: string[]) { this.items = items || []; }

  private createSearchBar(): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.className = "search_bar";
    wrapper.setAttribute("role", "search");

    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.id = "search_bar";
    this.input.className = "search_bar__input";
    this.input.placeholder = "search";
    this.input.autocomplete = "off";
    this.input.setAttribute("aria-label", "Search");

    this.btn = document.createElement("button");
    this.btn.type = "button";
    this.btn.className = "search_bar__btn";
    this.btn.setAttribute("aria-label", "Search");
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-magnifying-glass";
    this.btn.appendChild(icon);

    wrapper.appendChild(this.input);
    wrapper.appendChild(this.btn);
    return wrapper;
  }

  mount(parent: HTMLElement) { parent.appendChild(this.root); }
  unmount() { this.root.remove(); }

  private addEventListeners() {
    // 타이핑 → 프리뷰만 발행 (모달 X)
    this.input.addEventListener("input", () => {
      if (this.debouncer) window.clearTimeout(this.debouncer);
      this.debouncer = window.setTimeout(() => {
        this.handlePreview(this.input.value);
      }, this.debounceDelay);
    });

    // Enter → "제출" (모달 트리거)
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (this.debouncer) window.clearTimeout(this.debouncer);
        this.handleSubmit(this.input.value);
      } else if (e.key === "Escape") {
        e.preventDefault();
        this.input.value = "";
        this.handlePreview(""); // 프리뷰만 초기화
      }
    });

    // 돋보기 클릭 → "제출" (모달 트리거)
    this.btn.addEventListener("click", () => {
      if (this.debouncer) window.clearTimeout(this.debouncer);
      this.handleSubmit(this.input.value);
    });
  }

  /** 프리뷰(타이핑) */
  private handlePreview(query: string) {
    const q = query.trim().toLowerCase();
    this.filtered = !q ? [...this.items] : this.items.filter((it) => it.toLowerCase().includes(q));

    if (this.onSearch) this.onSearch(query, this.filtered);

    // 헤더로 프리뷰 이벤트 전파
    this.root.dispatchEvent(
      new CustomEvent("search:preview", { detail: { query, results: this.filtered }, bubbles: true })
    );
  }

  /** 제출(Enter/돋보기) */
  private handleSubmit(query: string) {
    const q = query.trim().toLowerCase();
    this.filtered = !q ? [...this.items] : this.items.filter((it) => it.toLowerCase().includes(q));

    if (this.onSubmit) this.onSubmit(query, this.filtered);

    // 헤더로 제출 이벤트 전파 (→ 모달 열기 용도)
    this.root.dispatchEvent(
      new CustomEvent("search:submit", { detail: { query, results: this.filtered }, bubbles: true })
    );
  }
}
