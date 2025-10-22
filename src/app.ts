import { KanbanBoard } from "./components/KanbanBoard.js";

const appRoot = document.getElementById("app") as HTMLElement

if (appRoot) {
    new KanbanBoard(appRoot)
} else {
    console.error("Root element not found!")
}