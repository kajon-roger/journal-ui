import React, { useState, CSSProperties, useEffect, useReducer } from "react";
import { DayModel } from "../models/day.model";
import Moment from "moment";
import { MonthUtils } from "../utils/month";
import { LogbookAPIPromise } from "../modules/LogbookAPIPromise";
import { CalendarDay } from "./CalendarDay";

interface CalendarMonthProps {
    initialDate?: Date,
}

export function CalendarMonth(props: CalendarMonthProps) {

    let [ date, setDate] = useState(props.initialDate ? props.initialDate : new Date());
    let initialDayModels: DayModel[] = [];
    let [ dayModels, setDayModels] = useState(initialDayModels);

    useEffect(() => {
        console.log("Here I am in Calendar.useEffect handler")
        getMonth(new Date());
    },
    []); // Deps is an empty array so this function is only called when the component is first loaded (like componentDidMount)

    let getMonth = (date: Date): void => {

        let from = new Date(date.getFullYear(), date.getMonth(), 0);
        let to = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        LogbookAPIPromise.getDays(false, true, from, to)
        .then(days => {
            setDayModels(days.map(day => {
                // Dates returned by the API are strings and must be coerced into Dates
                if (day.date) {

                    day.date = new Date(day.date);
                }
                return day;
            }));
            setDate(date);
            return days;
        })
        .then(days => days.forEach(day => console.log(`${day.date} ${day.appointments ? "has appointment(s)" : "no appointments"}`)));
    }

    let toMonth = (sparseDayModels: undefined|DayModel[]): (DayModel|undefined)[][] => {

        let monthDates = MonthUtils.createMonthWeeks(date.getFullYear(), date.getMonth());

        let retval = monthDates.map(week => {
            return week.map(day => {
                
                return findOrCreateDay(day, dayModels);
            });
        });

        return retval;
    }

    let findOrCreateDay = (date: Date|undefined, dayModels: undefined|DayModel[]): DayModel|undefined => {

        let retval: DayModel|undefined = undefined;

        if (date && dayModels) {

            for (let index: number = 0; index < dayModels.length; index++) {

                if (dayModels[index].date.getFullYear() === date.getFullYear() &&
                    dayModels[index].date.getMonth() === date.getMonth() &&
                    dayModels[index].date.getDate() === date.getDate()) {
                    
                    retval = dayModels[index];
                    break;
                }
            }

            if (!retval) {
                retval = new DayModel(date);
            }
        }

        return retval;
    }

    let prevMonth = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {

        e.preventDefault();

        let newDate = date;

        if (date.getMonth() <= 0) {

            newDate = new Date(date.getFullYear() - 1, 11);
        } else {

            newDate = new Date(date.getFullYear(), date.getMonth() - 1);
        }

        getMonth(newDate);
    }

    let nextMonth = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>): void => {

        e.preventDefault();

        let newDate = date;

        if (date.getMonth() >= 11) {

            newDate = new Date(date.getFullYear() + 1, 0);
        } else {

            newDate = new Date(date.getFullYear(), date.getMonth() + 1);
        }

        getMonth(newDate);
    }

    let monthStyle: CSSProperties = {
        width: "100%",
        textAlign: "left",
        fontSize: "x-large",
    }

    let weekStyle: CSSProperties = {
        width: "100%",
        height: "16%",
        textAlign: "left",
        verticalAlign: "top",
        fontSize: "large",
    }

    let dayStyle: CSSProperties = {
        width: "14%",
        height: "100%",
        borderLeft: "1px solid grey",
        // borderBottom: "1px solid grey",
        borderRight: "1px solid grey",
        borderBlock: "1px solid grey",
    }

    let prevNextStyle: CSSProperties = {
        color: "red",
        marginLeft: "10px",
    }

    return (
        <div className="container-fluid row col-lg-12">
            <table>
                <tr style={monthStyle}>
                    <td colSpan={7}>
                        <span style={prevNextStyle} onClick={ e => { prevMonth(e) }}>&lt;&lt;</span>
                        <span style={prevNextStyle} onClick={ e => { nextMonth(e) }}>&gt;&gt;</span>
                        &nbsp;
                        { Moment(date).format("MMMM yyyy")}
                    </td>
                </tr>
                <tr style={weekStyle}>
                    <td style={dayStyle}>Sunday</td>
                    <td style={dayStyle}>Monday</td>
                    <td style={dayStyle}>Tuesday</td>
                    <td style={dayStyle}>Wednesday</td>
                    <td style={dayStyle}>Thursday</td>
                    <td style={dayStyle}>Friday</td>
                    <td style={dayStyle}>Saturday</td>
                </tr>
                {
                    toMonth(dayModels).map(week => {
                        return (
                            <tr style={weekStyle}>
                                {
                                    week.map(day => {
                                        if (day) {
                                            return (
                                                <td style={dayStyle}>
                                                    <CalendarDay key={ day?.id} initialDayModel={day}/>
                                                </td>
                                            )
                                        } else {
                                            return <td></td>
                                        }
                                    })
                                }
                            </tr>
                        )
                    })
                }
            </table>
        </div>
    );
}