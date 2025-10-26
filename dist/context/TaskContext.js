export class TaskContext {
    constructor() {
        this.tasks = [];
        this.listeners = [];
        this.tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        this.listeners = [];
        this.loadTasks();
    }
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.notifyListeners();
    }
    loadTasks() {
        const data = localStorage.getItem('tasks');
        this.tasks = data ? JSON.parse(data) : [];
    }
    getAll() {
        return this.tasks;
    }
    add(newTask) {
        this.tasks.push(newTask);
        this.saveTasks();
        this.notifyListeners();
    }
    update(id, updatedTask) {
        var _a;
        let index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks[index] = updatedTask;
            this.saveTasks();
            (_a = this.notifyListeners) === null || _a === void 0 ? void 0 : _a.call(this);
        }
    }
    delete(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.notifyListeners();
    }
    getByStatus(status) {
        return this.tasks.filter(t => t.status === status);
    }
    subscribe(listener) {
        this.listeners.push(listener);
    }
    notifyListeners() {
        this.listeners.forEach(listener => listener());
    }
}
//# sourceMappingURL=TaskContext.js.map