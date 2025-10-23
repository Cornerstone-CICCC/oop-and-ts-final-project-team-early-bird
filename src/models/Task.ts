export enum Status {
    todo = "To Do",
    inProgress = "In Progress",
    done = "Done"
}
export interface Task {
    id: number
    title: string
    description: string
    status: Status
}