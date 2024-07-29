export enum View {
    LOG = "log",
    TASKS = "tasks",
    TOPICS = "topics",
    CALENDAR = "calendar",
}

export interface IViewSwitcher {
    (view: View, what?: any): void;
}