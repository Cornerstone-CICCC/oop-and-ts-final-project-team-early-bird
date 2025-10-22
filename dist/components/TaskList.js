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
        statusTitle.textContent = this.status === "todo"
            ? "To Do"
            : this.status === "in-progress"
                ? "In Progress"
                : "Done";
        const addBtn = document.createElement('button');
        addBtn.classList.add('add-task-btn');
        addBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`;
        const taskContainer = document.createElement('div');
        taskContainer.classList.add('task-container');
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