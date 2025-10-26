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
        // drag-and-drop
        el.addEventListener('dragstart', e => {
            var _a, _b, _c;
            const data = e.target;
            const idStr = (_b = (_a = data.querySelector('.task-id')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.replace('#', '').trim();
            if (idStr) {
                (_c = e.dataTransfer) === null || _c === void 0 ? void 0 : _c.setData('text/plain', idStr);
                console.log(idStr);
            }
            data.classList.add('dragging');
        });
        el.addEventListener('dragover', e => {
            e.preventDefault();
        });
        el.addEventListener('dragend', e => {
            const data = e.target;
            data.classList.remove('dragging');
            // console.log(this.task)
        });
        //
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
            const statusEl = el.querySelector('.task-status');
            modal.classList.remove('show');
            this.makeEditable(titleEl, descEl, statusEl);
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
    makeEditable(titleEl, descEl, statusEl) {
        const titleInput = document.createElement('input');
        titleInput.type = "text";
        titleInput.value = this.task.title;
        titleInput.classList.add('edit-title');
        const descInput = document.createElement('textarea');
        descInput.rows = 5;
        descInput.value = this.task.description;
        descInput.classList.add('edit-desc');
        const currentStatus = statusEl.textContent;
        const statusSelect = document.createElement('select');
        statusSelect.classList.add('edit-status');
        const statusOptions = [
            { value: 'To Do' },
            { value: 'In Progress' },
            { value: 'Done' }
        ];
        statusOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.value;
            statusSelect.appendChild(optionElement);
        });
        statusSelect.value = `${currentStatus}`;
        titleEl.replaceWith(titleInput);
        descEl.replaceWith(descInput);
        statusEl.replaceWith(statusSelect);
        const saveChanges = () => {
            this.task.title = titleInput.value.trim() || this.task.title;
            this.task.description = descInput.value.trim() || this.task.description;
            const oldStatus = this.task.status;
            this.task.status = statusSelect.value;
            const updatedData = { id: this.task.id, title: this.task.title, description: this.task.description, status: this.task.status };
            this.tasklist.update(this.task.id, updatedData);
            if (oldStatus !== this.task.status) {
                this.tasklist.delete(this.task.id);
                this.tasklist.render();
                console.log(`${oldStatus} ===> ${this.task.status}`);
                // console.log(this.tasklist)
                // const newList = this.tasklist.this.task.status)
                // newList.add(this.task)
                // newList.render()
                console.log(this.tasklist.status); // todo
            }
            const newTitle = document.createElement('h3');
            newTitle.className = 'task-title';
            newTitle.textContent = this.task.title;
            const newDesc = document.createElement('p');
            newDesc.className = 'task-desc';
            newDesc.textContent = this.task.description;
            const newStatus = document.createElement('p');
            newStatus.className = 'task-status';
            newStatus.textContent = this.task.status;
            titleInput.replaceWith(newTitle);
            descInput.replaceWith(newDesc);
            statusSelect.replaceWith(newStatus);
            document.removeEventListener('click', handleOutsideClick);
        };
        const handleOutsideClick = (e) => {
            var _a;
            const target = e.target;
            if (!((_a = titleInput.parentElement) === null || _a === void 0 ? void 0 : _a.contains(target)) && !statusSelect.contains(target)) {
                saveChanges();
                // console.log(this.task) // todo - done (item)
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