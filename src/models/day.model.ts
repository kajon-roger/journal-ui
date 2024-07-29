import { EntryModel } from "./entry.model";
import { AppointmentModel } from "./appointment.model";

export class DayModel {

    constructor(public date: Date, public entries?: EntryModel[], public appointments?: AppointmentModel[], public id?: number, public new_day?: boolean) {}
}