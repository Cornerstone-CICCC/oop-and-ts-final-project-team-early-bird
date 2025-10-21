"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskCard = void 0;
class TaskCard {
    constructor(task) {
        this.task = task;
        this.element = this.createElement();
    }
    createElement() {
        const el = document.createElement('div');
        el.className = "task";
        el.innerHTML = `
            <div class="id-status">
                <p class="task-id">#${this.task.id}</p>
                <p class="task-status">${this.task.status}</p>
                <span><i class="fa-solid fa-ellipsis-vertical"></i></span>
            </div>
            <div class="title-desc">
                <h3>${this.task.title}</h3>
                <p>${this.task.description}</p>
            </div>
        `;
        return el;
    }
    render() {
        return this.element;
    }
}
exports.TaskCard = TaskCard;
//# sourceMappingURL=TaskCard.js.map