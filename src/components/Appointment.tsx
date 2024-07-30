import { AppointmentModel } from "../models/appointment.model";
import Moment from "moment";
import { ComponentType, ID } from "../utils/ID";
import { DayModel } from "../models/day.model";
import { CSSProperties } from "react";

export enum AppointmentUserActions {
    SWITCH_TO_EDIT_MODE,
    SAVE_EDIT,
    CANCEL_EDIT,
}

export interface AppointmentUserAction {
        (action: AppointmentUserActions, index: number, appointmentModel?: AppointmentModel): void;
}

export class Appointment {

    private static getHeader(appointmentModel: AppointmentModel) {

        let header: string|undefined = undefined;

        if (appointmentModel.start_date) {

            header = "(";

            header += Moment(appointmentModel.start_date).format("HH:mm");

            if ( appointmentModel.end_date) {

                header += ` - ${ Moment(appointmentModel.end_date).format("HH:mm")}`;
            }

            header += ") ";
        }

        return header;
    }

    private static createDescriptionEditId = (appointmentModel: AppointmentModel): string=>  {
        return ID.createId(appointmentModel.id, ComponentType.APPOINTMENT, "description");
    }

    private static createStartHourEditId = (appointmentModel: AppointmentModel): string => {
        return ID.createId(appointmentModel.id, ComponentType.APPOINTMENT, "start_hour");
    }

    private static createStartMinuteEditId = (appointmentModel: AppointmentModel): string => {
        return ID.createId(appointmentModel.id, ComponentType.APPOINTMENT, "start_minute");
    }

    private static createEndHourEditId = (appointmentModel: AppointmentModel): string => {
        return ID.createId(appointmentModel.id, ComponentType.APPOINTMENT, "end_hour");
    }

    private static createEndMinuteEditId = (appointmentModel: AppointmentModel): string => {
        return ID.createId(appointmentModel.id, ComponentType.APPOINTMENT, "end_minute");
    }

    private static getDescription = (appointmentModel: AppointmentModel): string => {
        return (document.getElementById(this.createDescriptionEditId(appointmentModel)) as HTMLInputElement).value;
    }

    private static getStartDate = (appointmentModel: AppointmentModel, dayModel: DayModel): Date | undefined => {

        let retval = undefined;

        let hour = (document.getElementById(this.createStartHourEditId(appointmentModel)) as HTMLInputElement).value;
        let minute = (document.getElementById(this.createStartMinuteEditId(appointmentModel)) as HTMLInputElement).value;

        if (hour && hour.length > 0 && minute && minute.length > 0) {

            let day: Date = new Date(dayModel.date);
            retval = new Date(day.getFullYear(), day.getMonth(), day.getDate(), +hour, +minute);
        }

        return retval;
    }
    
    private static getEndDate = (appointmentModel: AppointmentModel, dayModel: DayModel): Date | undefined => {

        let retval = undefined;

        let hour = (document.getElementById(this.createEndHourEditId(appointmentModel)) as HTMLInputElement).value;
        let minute = (document.getElementById(this.createEndMinuteEditId(appointmentModel)) as HTMLInputElement).value;

        if (hour && hour.length > 0 && minute && minute.length > 0) {

            let day: Date = new Date(dayModel.date);
            retval = new Date(day.getFullYear(), day.getMonth(), day.getDate(), +hour, +minute);
        }

        return retval;
    }

    private static getEditedAppointment(appointmentModel: AppointmentModel, dayModel: DayModel): AppointmentModel {

        return new AppointmentModel(this.getDescription(appointmentModel), dayModel.id, this.getStartDate(appointmentModel, dayModel), this.getEndDate(appointmentModel, dayModel), appointmentModel.id);
    }

    private static descriptionEditStyle: CSSProperties = {
        width: "100%",
        height: "100px",
    }

    private static hourAndMinuteEditLabelStyle: CSSProperties = {
        display: "inline-block",
        width: "5ch",
    }

    private static hourAndMinuteEditStyle: CSSProperties = {
        display: "inline-block",
        width: "5ch",
    }

    private static hourAndMinuteEditCommaStyle: CSSProperties = {
        display: "inline-block",
        width: "1ch",
        textAlign: "center",
    }

    private static buttonStyle: CSSProperties = {
        width: "8ch",
    }

    private static getHoursSelect = (id: string, style: CSSProperties, value: number|undefined): any => {

        return (
            <select id={id} style={style} defaultValue={value}>
                <option value={undefined}></option>
                <option value={0}>00</option>
                <option value={1}>01</option>
                <option value={2}>02</option>
                <option value={3}>03</option>
                <option value={4}>04</option>
                <option value={5}>05</option>
                <option value={6}>06</option>
                <option value={7}>07</option>
                <option value={8}>08</option>
                <option value={9}>09</option>
                <option value={10}>10</option>
                <option value={11}>11</option>
                <option value={12}>12</option>
                <option value={13}>13</option>
                <option value={14}>14</option>
                <option value={15}>15</option>
                <option value={16}>16</option>
                <option value={17}>17</option>
                <option value={18}>18</option>
                <option value={19}>19</option>
                <option value={20}>20</option>
                <option value={21}>21</option>
                <option value={22}>22</option>
                <option value={23}>23</option>
            </select>
        );
    }

    private static getMinutesSelect = (id: string, style: CSSProperties, value: number|undefined): any => {

        return (

            <select id={id} style={style} defaultValue={value}>
                <option value={undefined}></option>
                <option value={0}>00</option>
                <option value={5}>05</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={30}>30</option>
                <option value={35}>35</option>
                <option value={40}>40</option>
                <option value={45}>45</option>
                <option value={50}>50</option>
                <option value={55}>55</option>
            </select>
        );
    }

    public static getAppointmentMarkup = (index: number, appointmentModel: AppointmentModel, dayModel: DayModel, editMode: boolean, appointmentUserAction: AppointmentUserAction) => {

        return (
        <div key={appointmentModel.id}>
        {
            editMode
            ?
            <div>
                Description: <textarea id={this.createDescriptionEditId(appointmentModel)} style={this.descriptionEditStyle} defaultValue={ appointmentModel.new_appointment? '' : appointmentModel.description} onContextMenu={(e) => { e.preventDefault()}} />
                <br/>
                <span style={this.hourAndMinuteEditLabelStyle}>Start:</span> 
                { this.getHoursSelect(this.createStartHourEditId(appointmentModel), this.hourAndMinuteEditStyle, appointmentModel.start_date ? new Date(appointmentModel.start_date).getHours() : undefined) }
                <span style={this.hourAndMinuteEditCommaStyle}>:</span>
                { this.getMinutesSelect(this.createStartMinuteEditId(appointmentModel), this.hourAndMinuteEditStyle, appointmentModel.start_date ? new Date(appointmentModel.start_date).getMinutes() : undefined) }
                <br/>
                <span style={this.hourAndMinuteEditLabelStyle}>End:</span> 
                { this.getHoursSelect(this.createEndHourEditId(appointmentModel), this.hourAndMinuteEditStyle, appointmentModel.end_date ? new Date(appointmentModel.end_date).getHours() : undefined) }
                <span style={this.hourAndMinuteEditCommaStyle}>:</span>
                { this.getMinutesSelect(this.createEndMinuteEditId(appointmentModel), this.hourAndMinuteEditStyle, appointmentModel.end_date ? new Date(appointmentModel.end_date).getMinutes() : undefined) }
                <br/>
                <input type="button" style={this.buttonStyle} value="Save" onClick={ (e) => { e.preventDefault(); appointmentUserAction(index, AppointmentUserActions.SAVE_EDIT, this.getEditedAppointment(appointmentModel, dayModel)); }}/>
                <input type="button" style={this.buttonStyle} value="Cancel" onClick={ (e) => { e.preventDefault(); appointmentUserAction(index, AppointmentUserActions.CANCEL_EDIT); }}/>
            </div>
            :
            <div className="row col-lg-12" onClick={e => { e.preventDefault(); appointmentUserAction(index, AppointmentUserActions.SWITCH_TO_EDIT_MODE); }}>
                <p>
                    {
                        this.getHeader(appointmentModel)
                        ?
                        this.getHeader(appointmentModel)
                        :
                        ""
                    }
                    {appointmentModel.description}
                </p>
            </div>
        }
        </div>
        );
    }
}
