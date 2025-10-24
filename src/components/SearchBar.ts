// src/components/SearchBar.ts
export class SearchBar {
  root: HTMLElement;
  input!: HTMLInputElement;
  suggestionList!: HTMLUListElement;
  private items: string[] = [];
  private filtered: string[] = [];
  private activeIndex: number = -1;
  onSelect: ((item: string) => void) | null = null;
  private debounceDelay = 180;
  private debouncer?: number;

  constructor() {
    this.root = this.createSearchBar();
    this.addEventListeners();
  }

  // 외부에서 전체 후보(예: 서버에서 받아온 데이터)를 설정
  setItems(items: string[]) {
    this.items = items || [];
  }

  // 검색창 생성
  private createSearchBar(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'search_bar';
    wrapper.setAttribute('role', 'search');

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-magnifying-glass';

    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.id = 'search_bar';
    this.input.placeholder = 'search';
    this.input.autocomplete = 'off';
    this.input.setAttribute('aria-autocomplete', 'list');
    this.input.setAttribute('aria-controls', 'suggestionList');

    this.suggestionList = document.createElement('ul');
    this.suggestionList.id = 'suggestionList';
    this.suggestionList.setAttribute('role', 'listbox');
    this.suggestionList.style.position = 'absolute';
    this.suggestionList.style.zIndex = '1000';
    this.suggestionList.style.listStyle = 'none';
    this.suggestionList.style.margin = '0';
    this.suggestionList.style.padding = '0';

    wrapper.appendChild(icon);
    wrapper.appendChild(this.input);
    wrapper.appendChild(this.suggestionList);

    // 간단 스타일 (필요하면 외부 CSS로 대체)
    wrapper.style.position = 'relative';

    return wrapper;
  }

  mount(parent: HTMLElement) {
    parent.appendChild(this.root);
  }

  unmount() {
    this.root.remove();
  }

  // 이벤트 바인딩
  private addEventListeners() {
    // 입력 이벤트 (디바운스)
    this.input.addEventListener('input', () => {
      if (this.debouncer) window.clearTimeout(this.debouncer);
      this.debouncer = window.setTimeout(() => {
        this.handleInput(this.input.value);
      }, this.debounceDelay);
    });

    // 포커스 시 전체 목록 또는 필터링 목록 표시
    this.input.addEventListener('focus', () => {
      if (this.input.value.trim()) {
        this.handleInput(this.input.value);
      } else {
        this.clearSuggestions();
      }
    });

    // 키보드 내비게이션
    this.input.addEventListener('keydown', (e) => {
      if (!this.filtered.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.activeIndex = Math.min(this.activeIndex + 1, this.filtered.length - 1);
        this.renderSuggestions();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.activeIndex = Math.max(this.activeIndex - 1, 0);
        this.renderSuggestions();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (this.activeIndex >= 0 && this.activeIndex < this.filtered.length) {
          this.selectItem(this.filtered[this.activeIndex]);
        }
      } else if (e.key === 'Escape') {
        this.clearSuggestions();
      }
    });

    // 문서 클릭 시 suggestion 바깥 클릭 감지하여 닫기
    document.addEventListener('click', (ev) => {
      if (!this.root.contains(ev.target as Node)) {
        this.clearSuggestions();
      }
    });

    // suggestion 클릭 위임
    this.suggestionList.addEventListener('click', (ev) => {
      const target = ev.target as HTMLElement;
      const li = target.closest('li');
      if (li && li.dataset && li.dataset.value) {
        this.selectItem(li.dataset.value);
      }
    });
  }

  // 입력 처리: 필터링 및 렌더
  private handleInput(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) {
      this.clearSuggestions();
      return;
    }
    // 간단한 필터 로직 (앞/중간 포함)
    this.filtered = this.items.filter((it) => it.toLowerCase().includes(q)).slice(0, 10);
    this.activeIndex = -1;
    this.renderSuggestions();
  }

  private renderSuggestions() {
    this.suggestionList.innerHTML = '';
    if (!this.filtered.length) {
      this.suggestionList.style.display = 'none';
      this.input.setAttribute('aria-expanded', 'false');
      return;
    }

    this.suggestionList.style.display = 'block';
    this.input.setAttribute('aria-expanded', 'true');

    this.filtered.forEach((value, idx) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('data-value', value);
      li.tabIndex = -1;
      li.style.padding = '8px';
      li.style.cursor = 'pointer';
      if (idx === this.activeIndex) {
        li.style.background = '#eee';
        li.setAttribute('aria-selected', 'true');
      } else {
        li.style.background = 'transparent';
        li.setAttribute('aria-selected', 'false');
      }

      // 강조(하이라이트) 처리를 위해 간단히 부분 문자열을 <mark>로 감쌈
      const q = this.input.value.trim();
      if (!q) {
        li.textContent = value;
      } else {
        const regex = new RegExp(`(${this.escapeRegExp(q)})`, 'ig');
        li.innerHTML = value.replace(regex, '<mark>$1</mark>');
      }

      this.suggestionList.appendChild(li);
    });
  }

  private clearSuggestions() {
    this.filtered = [];
    this.activeIndex = -1;
    this.suggestionList.innerHTML = '';
    this.suggestionList.style.display = 'none';
    this.input.setAttribute('aria-expanded', 'false');
  }

  private selectItem(item: string) {
    this.input.value = item;
    this.clearSuggestions();
    if (this.onSelect) this.onSelect(item);
  }

  // 유틸: 정규식 이스케이프
  private escapeRegExp(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
