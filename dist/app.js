import { KanbanBoard } from "./components/KanbanBoard.js";
import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { ModalController } from "./components/ModalController.js";
// ⚡ DOM이 완전히 준비된 후 실행되도록
window.addEventListener("DOMContentLoaded", () => {
    const appRoot = document.getElementById("app");
    if (!appRoot) {
        console.error("Root element not found!");
        return;
    }
    const header = new Header();
    header.mountBefore(appRoot);
    const kanban = new KanbanBoard(appRoot);
    // ⚡ TaskCard들이 실제로 렌더된 후 ModalController 초기화
    // setTimeout은 이벤트 루프 한 번 넘기기 위한 안전장치 (렌더 타이밍 맞춤)
    setTimeout(() => {
        new ModalController();
    }, 0);
    const footer = new Footer();
    footer.mountAfter(appRoot);
});
//# sourceMappingURL=app.js.map