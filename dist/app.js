import { KanbanBoard } from "./components/KanbanBoard.js";
import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
const appRoot = document.getElementById("app");
if (appRoot) {
    const header = new Header();
    header.mountBefore(appRoot);
    new KanbanBoard(appRoot);
    const footer = new Footer();
    footer.mountAfter(appRoot);
}
else {
    console.error("Root element not found!");
}
//# sourceMappingURL=app.js.map