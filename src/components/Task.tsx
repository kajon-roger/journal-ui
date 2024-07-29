import React, { useState, CSSProperties } from "react";
import Moment from 'moment';

import { TaskModel } from "../models/task.model";
import { ComponentType, ID } from "../utils/ID";
import { LogbookAPIPromise } from "../modules/LogbookAPIPromise";

interface Props {
    initialTask: TaskModel,
    taskSaved?: TaskSaved,
}

export function Task(props: Props) {

    let [task, setTask] = useState(props.initialTask);
    let [ editMode, setEditMode] = useState(false);

    let labelStyle: CSSProperties = {

        textAlign: "right",
    }

    let fieldStyle: CSSProperties = {

        textAlign: "left",
    }

    let getReadView = () => {

        return (
            editMode
            ?
            ""
            :
            <div data-testid="task-read-view" className="container-fluid"  onDoubleClick={() => setEditMode(true) }>
                <div className="row">
                    <div className="col-lg-1" style={ labelStyle }>
                        Desription:
                    </div>
                    <div className="col-lg-11" style={ fieldStyle }>
                        { task.description }
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-1" style={ labelStyle }>
                        Scheduled:
                    </div>
                    <div className="col-lg-11" style={ fieldStyle }>
                        { Moment(task.scheduled).format('dddd DD MMM yyyy') }
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-1" style={ labelStyle }>
                        Snooze (mins):
                    </div>
                    <div className="col-lg-11" style={ fieldStyle }>
                        { task.snooze_minutes }
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-1" style={ labelStyle }>
                        Created:
                    </div>
                    <div className="col-lg-11" style={ fieldStyle }>
                        { Moment(task.created).format('dddd DD MMM yyyy') }
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-1" style={ labelStyle }>
                        Completed:
                    </div>
                    <div className="col-lg-11" style={ fieldStyle }>
                        { task.complete ? "Yes" : "No" }
                    </div>
                </div>
            </div>
        );
    }

    let save = () => {

        LogbookAPIPromise.saveTask(task)
        setEditMode(false);
    }

    let getEditField = (fieldName: string): string => {

        let retval = "";
        let htmlElement: HTMLInputElement = document.getElementById(ID.createId(task.id, ComponentType.TASK, fieldName)) as HTMLInputElement;
        if (htmlElement) {
            retval = htmlElement.value
        }
        return retval;
    }

    let getEditView = () => {

        return (
            editMode
            ?
            <div data-testid="task-edit-view" className="container-fluid"  onDoubleClick={() => setEditMode(true) }>
                <div className="row">
                    <div className="col-lg-1" style={ labelStyle }>
                        <label htmlFor="description">Desription:</label>
                    </div>
                    <div className="col-lg-11" style={ fieldStyle }>
                        <input id={ID.createId(task.id, ComponentType.TASK, "description")} type="text" defaultValue={ task.description }/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-1" style={ labelStyle }>
                        <label htmlFor="scheduled">Scheduled:</label>
                    </div>
                    <div className="col-lg-11" style={ fieldStyle }>
                        <input id={ID.createId(task.id, ComponentType.TASK, "scheduled")} type="text" defaultValue={ Moment(task.scheduled).format('dddd DD MMM yyyy') }/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-1" style={ labelStyle }>
                        <label htmlFor="snooze">Snooze (mins):</label>
                    </div>
                    <div className="col-lg-11" style={ fieldStyle }>
                        <input id={ID.createId(task.id, ComponentType.TASK, "snooze")} type="text" defaultValue={ task.snooze_minutes }/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-1" style={ labelStyle }>
                        <label htmlFor="created">Created:</label>
                    </div>
                    <div className="col-lg-11" style={ fieldStyle }>
                        <input id={ID.createId(task.id, ComponentType.TASK, "created")} type="text" defaultValue={ Moment(task.created).format('dddd DD MMM yyyy') }/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-1" style={ labelStyle }>
                        <label htmlFor="complete">Complete:</label>
                    </div>
                    <div className="col-lg-11" style={ fieldStyle }>
                        <input id={ID.createId(task.id, ComponentType.TASK, "complete")} type="checkbox" checked={ task.complete }/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-1"/>
                    <div className="col-lg-11" style={ fieldStyle }>
                        <input type="button" value="Save" onClick={ () => save() }/>
                        <input type="button" value="Cancel" onClick={ () => setEditMode(false) }/>
                    </div>
                </div>
            </div>
            :
            ""
        );
    }

    return (
        <div className="row" id={ID.createId(task.id, ComponentType.TASK)}>
            { getReadView() }
            { getEditView() }
        </div>
    );
}

export interface TaskSaved {
    (topic: TaskModel): void
}