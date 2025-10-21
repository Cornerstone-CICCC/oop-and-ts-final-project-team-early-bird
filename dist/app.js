"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KanbanBoard_1 = require("./components/KanbanBoard");
const appRoot = document.getElementById("app");
if (appRoot) {
    new KanbanBoard_1.KanbanBoard(appRoot);
}
else {
    console.error("Root element not found!");
}
//# sourceMappingURL=app.js.map