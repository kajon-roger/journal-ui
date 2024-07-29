export class AppointmentModel {

  constructor (public description: string, public day_id?: number, public start_date?: Date, public end_date?: Date, public id?: number, public new_appointment?: boolean, public new_appointment_id?: string) {}
}
