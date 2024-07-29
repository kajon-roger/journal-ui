export class TaskModel {

    constructor(public created: Date, public scheduled: Date, public description: string, public complete: boolean = false, public complete_dt?: Date, public snooze_minutes?: number, public id?: number) {}
}

export enum TaskStatus {
    ALL = 'all',
    COMPLETE = 'complete',
    NOT_COMPLETE = 'not complete',
}