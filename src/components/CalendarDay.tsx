import React, { useState, CSSProperties } from "react";
import { DayModel } from "../models/day.model";
import { AppointmentModel } from "../models/appointment.model";
import Moment from "moment";
import { LogbookAPIPromise } from "../modules/LogbookAPIPromise";
import { clone } from "../utils/clone";
import { ID } from "../utils/ID";
import { Appointment, AppointmentUserAction, AppointmentUserActions } from "./Appointment";

interface CalendarDayProps {
    initialDayModel: DayModel,
    calendarDaySavedCallback?: CalendarDaySavedCallback,
}

export interface CalendarDaySavedCallback {
    (): void
}

export function CalendarDay(props: CalendarDayProps) {

    let [ dayModel, setDayModel] = useState(props.initialDayModel);
    let [ editMode, setEditMode] = useState(false);
    let [ editAppointmentIndex, setEditAppointmentIndex ] = useState(-1);


    let addAppointment = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {

        e.preventDefault();

        let newDayModel = clone(dayModel);
        let newAppointment = new AppointmentModel("");
        newAppointment.day_id = newDayModel.id;
        newAppointment.new_appointment = true;
        newAppointment.new_appointment_id = ID.makeRandomStringId(10);
        if (newDayModel.appointments) {
            newDayModel.appointments.push(newAppointment);
        } else {
            newDayModel.appointments = [ newAppointment ];
        }

        setDayModel(newDayModel);
        setEditMode(true);
        setEditAppointmentIndex(newDayModel.appointments.length - 1);
    }

    let divStyle: CSSProperties = {

        height: "100%",
    }

    let dayStyle: CSSProperties = {

        width: "100%",
        textAlign: "left",
        verticalAlign: "top",
    }

    let addStyle: CSSProperties = {

        color: "red",
    }

    let appointmentUserAction: AppointmentUserAction = (index: number, action: AppointmentUserActions, appointmentModel?: AppointmentModel): void => {

        switch (action) {
            case AppointmentUserActions.CANCEL_EDIT:
                setEditMode(false);
                setEditAppointmentIndex(-1);
                console.log("************************** Appointment User Action     CANCEL_EDIT     *************************");
                break;
            case AppointmentUserActions.SAVE_EDIT:
                setEditMode(false);
                setEditAppointmentIndex(-1);
                if (appointmentModel) {

                    saveAppointment(index, appointmentModel);
                }
                console.log("************************** Appointment User Action      SAVE_EDIT      *************************");
                break;
            case AppointmentUserActions.SWITCH_TO_EDIT_MODE:
                setEditMode(true);
                setEditAppointmentIndex(index);
                console.log("************************** Appointment User Action SWITCH_TO_EDIT_MODE *************************");
                break;
        }
    }

    let saveAppointment = (index: number, appointmentModel: AppointmentModel) => {

        if (!dayModel.id) {

            LogbookAPIPromise.saveDay(dayModel)
            .then(day => {
                appointmentModel.day_id = day.id;
                if (dayModel.appointments) {
                    day.appointments = dayModel.appointments
                } else {
                    day.appointments = [appointmentModel];
                }
                return day;
            })
            .then(day => {
                LogbookAPIPromise.saveAppointment(appointmentModel)
                .then(appointment => {
                    if (day.appointments) {

                        day.appointments[index] = appointment;
                        setDayModel(day);
                    }
                })
            })
        } else {

            LogbookAPIPromise.saveAppointment(appointmentModel)
            .then(appointment => {

                let newDayModel = clone(dayModel);
                if (newDayModel.appointments) {

                    newDayModel.appointments[index] = appointment;
                } else {

                    newDayModel.appointments = [appointment];
                }
                setDayModel(newDayModel);
            })
        }
    }

    let isInEditMode = (index: number): boolean => {

        return (editMode && index === editAppointmentIndex)
    }

    if (dayModel) {

        return (
            <div className="container-fluid" style={divStyle} data-day-id={dayModel.id}>
                <p style={dayStyle}>
                    {
                        editMode
                        ?
                        ""
                        :
                        <span style={addStyle} onClick={ e => { addAppointment(e) }}>+&nbsp;</span>
                    }
                    { Moment(dayModel.date).format("Do") }
                </p>
                {
                    dayModel.appointments
                    ?
                    dayModel.appointments.map((appointment, index) => Appointment.getAppointmentMarkup(index, appointment, dayModel, isInEditMode(index), appointmentUserAction))
                    :
                    ""
                }
            </div>
        );
    } else {
        return <div></div>;
    }
}