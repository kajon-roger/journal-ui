import React, { useState, useEffect } from "react"
import Moment from 'moment';

import { DayChangedCallback, LogDay } from "./LogDay";
import { DayModel } from "../models/day.model";
import { LogbookAPIPromise } from "../modules/LogbookAPIPromise";
import { clone } from "../utils/clone";

interface Props {

    initialDayModels?: DayModel[]
}

export function Log(props: Props) {

    let [ dayModels, setDayModels ] = useState(props.initialDayModels);

    useEffect(() => {
        getDays();
    },
    []); // Deps is an empty array so this function is only called when the component is first loaded (like componentDidMount)

    let getDays = (): void => {

        LogbookAPIPromise.getDays(true, false)
        .then(days => {
            return days.filter(day => day.entries && day.entries.length > 0);
        })
        .then(days => {
            setDayModels(days);
        })
    }

    let addDay = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        e.stopPropagation();
        let days = clone(dayModels);
        days?.push({
            date: new Date(),
            entries: [],
            new_day: true,
        });
        setDayModels(days);
    }

    let dayChangedCallback: DayChangedCallback = (dayModel) => {

        let days = dayModels?.map(day => day);

        let found: boolean = false;
        days?.forEach((day) => {
            if (day.id === dayModel.id) {
                day.date = dayModel.date;
                day.entries = dayModel.entries;
                found = true;
                return;
            }
        });

        if (!found) {
            days?.forEach((day) => {
                if (day.new_day) {
                    day.new_day = false;
                    day.date = dayModel.date;
                    day.entries = dayModel.entries;
                    day.id = dayModel.id;
                }
            });
        }

        days?.sort((a, b) => {
            let retval: number = Moment(a.date).isBefore(Moment(b.date)) ? -1 : (Moment(a.date).isSame(Moment(b.date)) ? 0 : 1);
            console.log(`a: ${a.date}, b: ${b.date}  ${retval}`);
            return retval;
        })

        setDayModels(days);
    }

    return (
        <div data-testid="log" className="container-fluid">
            <p id="log_top"/>
            {
                dayModels
                ?
                dayModels.map(dayModel => <LogDay key={dayModel.id} initialLogDayModel={dayModel} dayChangedCallback={ dayChangedCallback }/>)
                :
                ""
            }
            <i onClick={ (e) => addDay(e) } style={{color: "red"}}>&lt;+ day&gt;</i>
            <p id="log_bottom"/>
        </div>
    );
}
