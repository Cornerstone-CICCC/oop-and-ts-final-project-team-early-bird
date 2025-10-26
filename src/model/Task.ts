import { Status } from "./Status.js"

export class Task {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public status: Status
    ) { }
}