export class TaskCard {
    constructor(task, tasklist, onUpdate, onDelete) {
        this.task = task;
        this.tasklist = tasklist;
        this.onUpdate = onUpdate;
        this.onDelete = onDelete;
        this.element = this.createElement();
    }
    createElement() {
        const el = document.createElement('div');
        el.className = "task";
        el.setAttribute('draggable', 'true');
        el.innerHTML = `
            <div class="card-header">
                <div class="id-status">
                    <p class="task-id">#${this.task.id}</p>
                    <p class="task-status">${this.task.status}</p>
                </div>
                <span class="option-btn"><i class="fa-solid fa-ellipsis-vertical"></i></span>
            </div>
            <div class="title-desc">
                <h3 class="task-title">${this.task.title}</h3>
                <p class="task-desc">${this.task.description}</p>
            </div>
        `;
        el.addEventListener('dragstart', e => {
            const data = e.target;
            data.classList.add('dragging');
        });
        el.addEventListener('dragend', e => {
            const data = e.target;
            data.classList.remove('dragging');
        });
        const modal = document.createElement('div');
        modal.classList.add('btn-modal');
        modal.innerHTML = `
            <button class="edit-btn"><i class="fa-solid fa-pen"></i>Edit</button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i>Delete</button>
        `;
        el.appendChild(modal);
        const optionBtn = el.querySelector('.option-btn');
        optionBtn === null || optionBtn === void 0 ? void 0 : optionBtn.addEventListener('click', e => {
            e.stopPropagation();
            modal.classList.add('show');
        });
        document.addEventListener('click', e => {
            const target = e.target;
            if (!el.contains(target) && !modal.contains(target)) {
                modal.classList.remove('show');
            }
        });
        const editBtn = modal.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            var _a;
            const titleEl = el.querySelector('.task-title');
            const descEl = el.querySelector('.task-desc');
            modal.classList.remove('show');
            this.makeEditable(titleEl, descEl);
            (_a = this.onUpdate) === null || _a === void 0 ? void 0 : _a.call(this, this.task);
        });
        const deleteBtn = modal.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            var _a;
            el.remove();
            this.tasklist.delete(this.task.id);
            (_a = this.onDelete) === null || _a === void 0 ? void 0 : _a.call(this, this.task.id);
        });
        return el;
    }
    makeEditable(titleEl, descEl) {
        const titleInput = document.createElement('input');
        titleInput.type = "text";
        titleInput.value = this.task.title;
        titleInput.classList.add('edit-title');
        const descInput = document.createElement('textarea');
        descInput.rows = 5;
        descInput.value = this.task.description;
        descInput.classList.add('edit-desc');
        titleEl.replaceWith(titleInput);
        descEl.replaceWith(descInput);
        const saveChanges = () => {
            this.task.title = titleInput.value.trim() || this.task.title;
            this.task.description = descInput.value.trim() || this.task.description;
            const updatedData = { id: this.task.id, title: this.task.title, description: this.task.description, status: this.task.status };
            this.tasklist.update(this.task.id, updatedData);
            const newTitle = document.createElement('h3');
            newTitle.className = 'task-title';
            newTitle.textContent = this.task.title;
            const newDesc = document.createElement('p');
            newDesc.className = 'task-desc';
            newDesc.textContent = this.task.description;
            titleInput.replaceWith(newTitle);
            descInput.replaceWith(newDesc);
            document.removeEventListener('click', handleOutsideClick);
        };
        const handleOutsideClick = (e) => {
            var _a;
            const target = e.target;
            if (!((_a = titleInput.parentElement) === null || _a === void 0 ? void 0 : _a.contains(target))) {
                saveChanges();
            }
        };
        titleInput.addEventListener('keypress', e => {
            if (e.key === "Enter") {
                e.preventDefault();
                descInput.focus();
            }
        });
        descInput.addEventListener('focus', () => {
            titleInput.blur();
        });
        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 0);
    }
    render() {
        return this.element;
    }
}
//# sourceMappingURL=TaskCard.js.map