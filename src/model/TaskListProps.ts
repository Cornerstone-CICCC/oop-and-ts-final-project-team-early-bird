import { Task } from "./Task.js";
import { Status } from "./Status.js";

export type TaskListProps = {
    status: Status
    taskContext: any
    onTaskDrop?: (task: Task, newStatus: Status) => void
};