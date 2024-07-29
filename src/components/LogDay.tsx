import React, { useState } from "react";
import Moment from 'moment';
import DatePicker from 'react-datepicker';

import { DayModel } from "../models/day.model";
import { EntryChangedCallback, LogEntry } from "./LogEntry";
import { EntryModel } from "../models/entry.model";
import { ComponentType, ID } from "../utils/ID";
import { clone } from "../utils/clone";
import { LogbookAPIPromise } from "../modules/LogbookAPIPromise";

import "react-datepicker/dist/react-datepicker.css";

interface Props {

    initialLogDayModel: DayModel,
    dayChangedCallback?: DayChangedCallback,
}

export interface DayChangedCallback {
    (logDayModel: DayModel): void
}

export function LogDay(props: Props) {

    let [ logDayModel, setLogDayModel ] = useState(props.initialLogDayModel);
    let [ editMode, setEditMode ] = useState(props.initialLogDayModel.new_day);

    let edit = (e: React.MouseEvent<HTMLHeadingElement, MouseEvent>): void => {

        e.stopPropagation();

        setEditMode(true);
    }

    let onChangeDatePicker = (date: Date | null, e: React.SyntheticEvent<any, Event> | undefined): void => {

        e?.stopPropagation();

        if (date) {
            setLogDayModel({
                date: date,
                entries: logDayModel.entries ? clone(logDayModel.entries) : undefined,
                id: logDayModel.id
            });
        }
    }

    let save = (e: React.MouseEvent<HTMLInputElement, MouseEvent>): void => {

        e.stopPropagation();
        setEditMode(false);
        LogbookAPIPromise.saveDay(logDayModel)
        .then((dayModel) => {

            setLogDayModel(clone(dayModel));
            if (props.dayChangedCallback) {
                props.dayChangedCallback(dayModel);
            }
        });
    }

    let cancel = (e: React.MouseEvent<HTMLInputElement, MouseEvent>): void => {

        e.stopPropagation();
        setEditMode(false);
    }

    let addEntry = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {

        e.stopPropagation();

        let dayModel = clone(logDayModel);
        let newEntry = new EntryModel("", logDayModel.id);
        newEntry.new_entry = true;
        if (dayModel.entries) {
            dayModel.entries.push(newEntry);
        } else {
            dayModel.entries = [ newEntry ];
        }
        setLogDayModel(dayModel);
    }

    let entryChangedCallback: EntryChangedCallback = (entryModel: EntryModel) => {

        let dayModel: DayModel = clone(logDayModel);

        let found: boolean = false;
        if (dayModel.entries) {
            for(let i: number = 0; i < dayModel.entries.length; i++) {

                if (dayModel.entries[i].id === entryModel.id) {
                    dayModel.entries[i] = entryModel;
                    found = true;
                    break;
                }
            }
            if (!found) {
                for(let i: number = 0; i < dayModel.entries.length; i++) {

                    if (dayModel.entries[i].new_entry) {
                        dayModel.entries[i] = entryModel;
                        break;
                    }
                }
            }
        } else {
            dayModel.entries = [ entryModel ];
        }

        setLogDayModel(dayModel);

        if (props.dayChangedCallback) {
            props.dayChangedCallback(dayModel);
        }
    }

    return (
        <div id={ID.createId(logDayModel.id, ComponentType.LOG_DAY)}>
            {
                editMode
                ?
                <div>
                    Date: <DatePicker id={`${logDayModel.id}_date`} value={Moment(logDayModel.date).format('dddd DD MMM yyyy')} onChange={ (date, e) => onChangeDatePicker(date, e) } dateFormat='yyyy MMM dd' />
                    <br/>
                    <input type="button" value="Save" onClick={ (e) => save(e) }></input>
                    <input type="button" value="Cancel" onClick={ (e) => cancel(e) }></input>
                </div>
                :
                <div>
                    <div>
                        <h1 onClick={ e => edit(e)}>{Moment(logDayModel.date).format('dddd DD MMM yyyy')}</h1>
                        {
                            logDayModel.entries
                            ?
                            logDayModel.entries.map(entryModel => <LogEntry key={entryModel.id} initialEntryModel={entryModel} entryChangedCallback={ entryChangedCallback }/>)
                            :
                            ""
                        }
                    </div>
                    <i onClick={ (e) => addEntry(e) } style={{color: "red"}}>&lt;+ entry&gt;</i>
                </div>
        }
        </div>
    );
}