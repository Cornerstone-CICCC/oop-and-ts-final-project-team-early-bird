import { App } from "./components/App.js";
import { TaskContext } from "./context/TaskContext.js";
const root = document.querySelector('#app');
if (root) {
    const taskContext = new TaskContext();
    const app = new App({ taskContext });
    app.mount(root);
}
//# sourceMappingURL=main.js.map