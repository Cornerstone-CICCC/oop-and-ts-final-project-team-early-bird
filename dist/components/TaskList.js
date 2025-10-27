import { Status } from "../models/Task.js";
import { TaskCard } from "./TaskCard.js";
export class TaskList {
    constructor(status, selector) {
        this.tasks = [];
        this.status = status;
        this.element = document.querySelector(selector);
        this.loadTasks();
        this.render();
    }
    get storageKey() {
        return `task_${this.status}`;
    }
    saveTasks() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    }
    loadTasks() {
        const data = localStorage.getItem(this.storageKey);
        this.tasks = data ? JSON.parse(data) : [];
    }
    add(newTask) {
        if (!this.tasks.some(task => task.id === newTask.id)) {
            this.tasks.push(newTask);
            this.saveTasks();
        }
        this.refresh();
    }
    update(id, updatedTask) {
        let task = this.tasks.find(task => task.id === id);
        if (task)
            Object.assign(task, updatedTask);
        this.saveTasks();
        this.refresh();
    }
    delete(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.refresh();
    }
    refresh() {
        if (this.element != null)
            this.element.innerHTML = '';
        this.render();
    }
    static updateTaskInStorage(id, newStatus, newTitle, newDesc) {
        const buckets = [Status.todo, Status.inProgress, Status.done];
        for (const status of buckets) {
            const arr = JSON.parse(localStorage.getItem(`task_${status}`) || "[]");
            const idx = arr.findIndex(t => t.id === id);
            if (idx !== -1) {
                const task = arr[idx];
                if (status !== newStatus) {
                    arr.splice(idx, 1);
                    localStorage.setItem(`task_${status}`, JSON.stringify(arr));
                    const newArr = JSON.parse(localStorage.getItem(`task_${newStatus}`) || "[]");
                    newArr.push({
                        id: id,
                        title: newTitle || task.title,
                        description: newDesc || task.description,
                        status: newStatus
                    });
                    localStorage.setItem(`task_${newStatus}`, JSON.stringify(newArr));
                }
                else {
                    arr[idx] = Object.assign(Object.assign({}, task), { title: newTitle || task.title, description: newDesc || task.description });
                    localStorage.setItem(`task_${status}`, JSON.stringify(arr));
                }
                break;
            }
        }
    }
    render() {
        const column = document.createElement("div");
        column.classList.add("kanban-column");
        const titleAdd = document.createElement('div');
        titleAdd.classList.add('title-add');
        const statusTitle = document.createElement("h2");
        statusTitle.textContent = this.status;
        const addBtn = document.createElement('button');
        addBtn.classList.add('add-task-btn');
        addBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`;
        const taskContainer = document.createElement('div');
        taskContainer.classList.add('task-container');
        taskContainer.addEventListener('dragover', e => {
            e.preventDefault();
        });
        taskContainer.addEventListener('drop', e => {
            var _a, _b, _c, _d;
            e.preventDefault();
            const dragging = document.querySelector('.dragging');
            if (!dragging)
                return;
            taskContainer.appendChild(dragging);
            const idNum = parseInt(((_b = (_a = dragging.querySelector(".task-id")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.replace("#", "")) || "-1");
            const newStatus = ((_d = (_c = dragging.closest(".kanban-column")) === null || _c === void 0 ? void 0 : _c.querySelector("h2")) === null || _d === void 0 ? void 0 : _d.textContent) || Status.todo;
            TaskList.updateTaskInStorage(idNum, newStatus);
            const statusEl = dragging.querySelector(".task-status");
            if (statusEl)
                statusEl.textContent = newStatus;
        });
        this.tasks.forEach(task => {
            const card = new TaskCard(task, this);
            taskContainer.appendChild(card.render());
        });
        addBtn.addEventListener('click', () => {
            const newTask = {
                id: Math.floor(Math.random() * 10000),
                title: "New Task",
                description: "Add Description",
                status: this.status
            };
            this.add(newTask);
            const card = new TaskCard(newTask, this);
            taskContainer.appendChild(card.render());
        });
        titleAdd.appendChild(statusTitle);
        titleAdd.appendChild(addBtn);
        column.append(titleAdd, taskContainer);
        return column;
    }
}
//# sourceMappingURL=TaskList.js.map