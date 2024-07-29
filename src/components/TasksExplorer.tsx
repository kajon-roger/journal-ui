import React, { useState, useEffect } from "react";

import { TaskModel, TaskStatus } from "../models/task.model";
import { ID, ComponentType } from "../utils/ID";
import { focus } from "../utils/focus";
import { LogbookAPIPromise } from "../modules/LogbookAPIPromise";

interface Props {

    initialTaskModels?: TaskModel[]
}

export enum TaskIndex {
    COMPLETE = 0,
    PENDING = 1,
    DUE = 2,
}

/**
 * 
 * @param allTasks An array of TaskModel instances to be sorted into complete, due, pending
 * @returns an array of three arrays of TaskModel instances [0] holds completed, [1] holds due, [2] holds pending
 */
export function sortTasks(allTasks?: TaskModel[]): TaskModel[][] {

    // We return three arrays:
    // Completed Tasks
    // Due Tasks
    // Pending Tasks
    let retval: TaskModel[][] = [];
    retval[TaskIndex.COMPLETE] = [];
    retval[TaskIndex.PENDING] = [];
    retval[TaskIndex.DUE] = [];

    let now = new Date();

    allTasks?.forEach(task => {
        if (task.complete) {
            retval[TaskIndex.COMPLETE].push(task);
        } else if (now.getTime() > new Date(task.scheduled).getTime()) {
            retval[TaskIndex.PENDING].push(task);
        } else {
            retval[TaskIndex.DUE].push(task);
        }
    });

    return retval;
}

export function TasksExplorer(props: Props) {

    let [taskModels, setTaskModels] = useState(sortTasks(props.initialTaskModels));

    useEffect(() => {
        getTasks();
    },
    []);

    let getTasks = ():void => {

        LogbookAPIPromise.getTasks(TaskStatus.ALL)
        .then((tasks) => {
            setTaskModels(sortTasks(tasks));
        });
    }

    return (
        <div>
            <h2>Due</h2>
            {
                taskModels[1].map(task => <p key={`tasks-explorer-id-${task.id}`} onClick={() => focus(ID.createId(task.id, ComponentType.TASK))}>{task.description}</p>)
            }
            <hr/>
            <h2>Pending</h2>
            {
                taskModels[2].map(task => <p key={`tasks-explorer-id-${task.id}`} onClick={() => focus(ID.createId(task.id, ComponentType.TASK))}>{task.description}</p>)
            }
            <hr/>
            <h2>Completed</h2>
            {
                taskModels[0].map(task => <p key={`tasks-explorer-id-${task.id}`} onClick={() => focus(ID.createId(task.id, ComponentType.TASK))}>{task.description}</p>)
            }
        </div>
    );
}