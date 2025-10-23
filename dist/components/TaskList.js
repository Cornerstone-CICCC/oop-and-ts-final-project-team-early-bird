import { Status } from "../models/Task.js";
import { TaskCard } from "./TaskCard.js";
export class TaskList {
    constructor(status) {
        this.tasks = [];
        this.status = status;
    }
    add(newTask) {
        this.tasks.push(newTask);
    }
    update(id, updatedTask) {
        const task = this.tasks.find(task => task.id === id);
        if (task)
            Object.assign(task, updatedTask);
    }
    delete(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
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
            var _a;
            e.preventDefault();
            const dragging = document.querySelector('.dragging');
            taskContainer.appendChild(dragging);
            const parentStatus = (_a = dragging.closest('.kanban-column')) === null || _a === void 0 ? void 0 : _a.querySelector('h2');
            const draggingStatus = dragging.querySelector('.task-status');
            if (parentStatus.textContent === Status.todo) {
                draggingStatus.textContent = Status.todo;
            }
            else if (parentStatus.textContent === Status.inProgress) {
                draggingStatus.textContent = Status.inProgress;
            }
            else if (parentStatus.textContent === Status.done) {
                draggingStatus.textContent = Status.done;
            }
        });
        this.tasks.forEach(task => {
            const card = new TaskCard(task);
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
            const card = new TaskCard(newTask);
            taskContainer.appendChild(card.render());
        });
        titleAdd.appendChild(statusTitle);
        titleAdd.appendChild(addBtn);
        column.append(titleAdd, taskContainer);
        return column;
    }
}
//# sourceMappingURL=TaskList.js.map