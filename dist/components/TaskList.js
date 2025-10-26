import { Component } from "../common/Component.js";
import { TaskCard } from "./TaskCard.js";
export class TaskList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        var _a;
        const { taskContext, status } = this.props;
        const column = document.createElement("div");
        column.classList.add("kanban-column");
        column.dataset.status = this.props.status;
        const titleAdd = document.createElement('div');
        titleAdd.classList.add('title-add');
        titleAdd.innerHTML = `
            <h2>${status}</h2>
            <button class="add-task-btn"><i class="fa-solid fa-plus"></i></button>
        `;
        const taskContainer = document.createElement('div');
        taskContainer.classList.add('task-container');
        taskContainer.addEventListener('dragover', e => {
            e.preventDefault();
            taskContainer.classList.add('drag-over');
        });
        taskContainer.addEventListener('drop', e => {
            var _a, _b, _c;
            e.preventDefault();
            taskContainer.classList.remove('drag-over');
            const data = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/plain');
            if (data) {
                const task = JSON.parse(data);
                const newStatus = this.props.status;
                this.props.taskContext.update(task.id, Object.assign(Object.assign({}, task), { status: newStatus }));
                (_c = (_b = this.props).onTaskDrop) === null || _c === void 0 ? void 0 : _c.call(_b, task, newStatus);
            }
        });
        taskContainer.addEventListener('dragleave', () => {
            taskContainer.classList.remove('drag-over');
        });
        const tasks = taskContext.getByStatus(status);
        tasks.forEach((task) => {
            const card = new TaskCard({ task, taskContext }).render();
            taskContainer.appendChild(card);
        });
        (_a = titleAdd.querySelector('.add-task-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            const newTask = {
                id: Math.floor(Math.random() * 10000),
                title: "New Task",
                description: "Add Description",
                status: status
            };
            taskContext.add(newTask);
        });
        column.appendChild(titleAdd);
        column.appendChild(taskContainer);
        return column;
    }
}
//# sourceMappingURL=TaskList.js.map