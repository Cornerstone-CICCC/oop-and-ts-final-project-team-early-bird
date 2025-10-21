"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskList = void 0;
const TaskCard_1 = require("./TaskCard");
class TaskList {
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
        const statusTitle = document.createElement("h2");
        statusTitle.textContent = this.status === "todo"
            ? "To Do"
            : this.status === "in-progress"
                ? "In Progress"
                : "Done";
        const taskContainer = document.createElement('div');
        taskContainer.classList.add('task-container');
        this.tasks.forEach(task => {
            const card = new TaskCard_1.TaskCard(task);
            taskContainer.appendChild(card.render());
        });
        column.append(statusTitle, taskContainer);
        return column;
    }
}
exports.TaskList = TaskList;
//# sourceMappingURL=TaskList.js.map