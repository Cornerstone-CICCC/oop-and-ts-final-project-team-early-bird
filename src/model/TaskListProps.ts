import { Task } from "./Task.js";
import { Status } from "./Status.js";

export type TaskListProps = {
    status: Status
    taskContext: any
    searchQuery: string
    onTaskDrop?: (task: Task, newStatus: Status) => void
};