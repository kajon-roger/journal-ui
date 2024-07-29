import React, { useState, useEffect } from "react"

import { TaskModel, TaskStatus } from "../models/task.model";
import { Task } from "./Task";
import { sortTasks, TaskIndex } from "./TasksExplorer";
import { LogbookAPIPromise } from "../modules/LogbookAPIPromise";
import { clone } from "../utils/clone";

interface Props {

    initialTasks?: TaskModel[],
}

export function Tasks(props: Props) {

    let [taskModels, setTaskModels] = useState(sortTasks(props.initialTasks));

    useEffect(() => {
        console.log("Here I am in Tasks.useEffect handler")
            getTasks();
    },
    []); // Deps is an empty array so this function is only called when the component is first loaded (like componentDidMount)

    let getTasks = (): void => {

        LogbookAPIPromise.getTasks(TaskStatus.ALL).then(tasks => {
            setTaskModels(sortTasks(tasks));
        });
    }

    let getHR = (index: number) => {
        return index > 0
        ?
        <hr style={{ border: "1px solid blue"}}/>
        :
        ""
    }

    let addTask = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {

        e.stopPropagation();

        console.log("In addTask");
        let newTask: TaskModel = new TaskModel(new Date(), new Date(), "New Task", false);

        let newTaskModels = clone(taskModels);
        newTaskModels[TaskIndex.DUE].unshift(newTask);

        setTaskModels(newTaskModels);
    }

    return (
        <div data-testid="tasks" className="container-fluid">
            <h2>Due <i onClick={ (e) => addTask(e) } style={{color: "red"}}>&lt;+ task&gt;</i></h2>
            {
                taskModels[TaskIndex.DUE].map( (task, index) => {
                    return (
                        <div key={ task.id }>
                            { getHR(index) }
                            <Task initialTask={ task }/>
                        </div>
                    )
                })
            }
            <hr/>
            <h2>Pending</h2>
            {
                taskModels[TaskIndex.PENDING].map( (task, index) => {
                    return (
                        <div key={ task.id }>
                            { getHR(index) }
                            <Task initialTask={ task }/>
                        </div>
                    )
                })
            }
            <hr/>
            <h2>Completed</h2>
            {
                taskModels[TaskIndex.COMPLETE].map( (task, index) => {
                    return (
                        <div key={ task.id }>
                            { getHR(index) }
                            <Task initialTask={ task }/>
                        </div>
                    )
                })
            }
        </div>
    );
}
