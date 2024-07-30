import React, { useState } from "react";

import { Task } from "./Task";
import { TaskModel } from "../models/task.model";
import { Tasks } from "./Tasks";
import { Topic, TopicMode } from "./Topic";
import { Topics } from "./Topics";
import { TopicModel } from "../models/topic.model";
import { AppointmentModel } from "../models/appointment.model";
import { DayModel } from "../models/day.model";
import { EntryModel } from "../models/entry.model";
import { CalendarMonth } from "./CalendarMonth";
import { CalendarDay } from "./CalendarDay";
import { LoggedInCallback, Login } from "./Login";
import { clone } from "../utils/clone";

export enum ComponentToShow {
    TASK = "task",
    TASKS = "tasks",
    TOPIC = "topic",
    TOPICS = "topics",
    ENTRY = "entry",
    DAY = "day",
    LOG = "log",
    HOOK_USER = "hook-user",
    CALENDAR_DAY = "calendar-day",
    CALENDAR_MONTH = "calendar-month",
}

export function toComponentsToShow(list: string): ComponentToShow[] {

    let names = list.split(",");
    let retval: ComponentToShow[] = [];
    
    if (names.length > 0) {
        names.forEach((name) => {
            if (name.trim().toLowerCase() === ComponentToShow.DAY) {
                retval.push(ComponentToShow.DAY);
            } else if (name.trim().toLowerCase() === ComponentToShow.ENTRY) {
                retval.push(ComponentToShow.ENTRY);
            } else if (name.trim().toLowerCase() === ComponentToShow.HOOK_USER) {
                retval.push(ComponentToShow.HOOK_USER);
            } else if (name.trim().toLowerCase() === ComponentToShow.LOG) {
                retval.push(ComponentToShow.LOG);
            } else if (name.trim().toLowerCase() === ComponentToShow.TASK) {
                retval.push(ComponentToShow.TASK);
            } else if (name.trim().toLowerCase() === ComponentToShow.TASKS) {
                retval.push(ComponentToShow.TASKS);
            } else if (name.trim().toLowerCase() === ComponentToShow.TOPIC) {
                retval.push(ComponentToShow.TOPIC);
            } else if (name.trim().toLowerCase() === ComponentToShow.TOPICS) {
                retval.push(ComponentToShow.TOPICS);
            } else if (name.trim().toLowerCase() === ComponentToShow.CALENDAR_DAY) {
                retval.push(ComponentToShow.CALENDAR_DAY);
            } else if (name.trim().toLowerCase() === ComponentToShow.CALENDAR_MONTH) {
                retval.push(ComponentToShow.CALENDAR_MONTH);
            }
        })
    }

    return retval;
}

function getTaskModel(): TaskModel {

    let taskModel: TaskModel = {
        complete: false,
        created: new Date(),
        description: "Task decsription",
        scheduled: new Date(),
        id: 1
    }
    return taskModel;
}

function getTaskModels(): TaskModel[] {

    let task1 = new TaskModel(new Date(), new Date(), "Task 1 Description", false);
    let task2 = new TaskModel(new Date(), new Date(), "Task 2 Description", false);
    let task3 = new TaskModel(new Date(), new Date(), "Task 3 Description", false);


    return [task1, task2, task3];
}

function getTopicModel(): TopicModel {

    let parentTopicModel: TopicModel = {
        title: "Parent Initial Title",
        text: "Parent initial text",
        id: 1,
    }

    let childTopicModel: TopicModel = {
        title: "Child 1 Initial Title",
        text: "Child 1 initial text",
        id: 2,
        parent_id: 1,
    }

    parentTopicModel.sub_topics = [ childTopicModel ];

    return parentTopicModel;
}

function getTopicModels(): TopicModel[] {


    let topicA: TopicModel = {
        title: "Topic A",
        text: "Initial text",
        id: 1,
    }
    let topicA1: TopicModel = {
        title: "Topic A 1",
        text: "Initial text",
        id: 4,
        parent_id: 1
    }
    let topicA2: TopicModel = {
        title: "Topic A 2",
        text: "Initial text",
        id: 5,
        parent_id: 1
    }
    let topicA3: TopicModel = {
        title: "Topic A 3",
        text: "Initial text",
        id: 6,
        parent_id: 1
    }

    let topicB: TopicModel = {
        title: "Topic B",
        text: "Initial text",
        id: 2,
    }

    let topicC: TopicModel = {
        title: "Topic B",
        text: "Initial text",
        id: 3,
    }
    let topicModels: TopicModel[] = [];
    topicModels.push(topicA);
    topicModels.push(topicB);
    topicModels.push(topicC);
    topicModels.push(topicA1);
    topicModels.push(topicA2);
    topicModels.push(topicA3);

    return topicModels;
}

function getDayModel(year: number, month: number, dayOfMonth: number): DayModel {

    let entry1 = new EntryModel("Logbook Entry One", 1, "Logbook text one", undefined, true);
    let entry2 = new EntryModel("Logbook Entry Two", 1, "Logbook text two", undefined, true);
    let entry3 = new EntryModel("Logbook Entry Three", 1, "Logbook text three", undefined, true);

    let appointment1 = new AppointmentModel("Appointment one description", 1, new Date(year, month, dayOfMonth, 9, 0, 0), new Date(year, month, dayOfMonth, 10, 0, 0))
    let appointment2 = new AppointmentModel("Appointment two description", 1, new Date(year, month, dayOfMonth, 11, 0, 0), new Date(year, month, dayOfMonth, 11, 30, 0))
    let appointment3 = new AppointmentModel("Appointment three description", 1, new Date(year, month, dayOfMonth, 15, 0, 0), new Date(year, month, dayOfMonth, 15, 45, 0))

    return new DayModel(new Date(year, month, dayOfMonth), [entry1, entry2, entry3], [appointment1, appointment2, appointment3], undefined, true);
}

export function Discovery() {
    
    let [isLoggedIn, setIsLoggedIn] = useState(false);
    let [componentsToShow, setComponentsToShow] = useState(toComponentsToShow(""));

    const loggedInCallback: LoggedInCallback = () => {

        setIsLoggedIn(true);
    }

    const getLogin = (): React.ReactNode => {

        return (
            isLoggedIn
            ?
            ''
            :
            <Login loggedInCallback={loggedInCallback}></Login>
        )
    }


    const toggle = (e: React.MouseEvent<HTMLInputElement, MouseEvent>, componentToShow: ComponentToShow): void => {

        let newComponentsToShow: ComponentToShow[] = [];

        if (componentsToShow.includes(componentToShow)) {

            // remove component to show
            console.log("Removing component to show: " + componentToShow);
            newComponentsToShow = componentsToShow.filter(value => value !== componentToShow);
        } else {

            // add component to show
            console.log("Adding component to show: " + componentToShow);
            newComponentsToShow = clone(componentsToShow);
            newComponentsToShow.push(componentToShow);
        }

        newComponentsToShow.forEach(element => console.log(`+ ${element}`));
        setComponentsToShow(newComponentsToShow);
    }

    let getDiscovery = () => {

        return isLoggedIn
        ?
        (
            <div>
                <div className="container-fluid row">
                    <span className="col-lg-1">
                    <input type="checkbox" id="cbTask" name="cbTask" value={ComponentToShow.TASK} onClick={e => toggle(e, ComponentToShow.TASK)} checked={componentsToShow.includes(ComponentToShow.TASK)}/><label htmlFor="cbTask">Task</label>
                    </span>
                    <span className="col-lg-1">
                        <input type="checkbox" id="cbTasks" name="cbTasks" value={ComponentToShow.TASKS} onClick={e => toggle(e, ComponentToShow.TASKS)} checked={componentsToShow.includes(ComponentToShow.TASKS)}/><label htmlFor="cbTasks">Tasks</label>
                    </span>
                    <span className="col-lg-1">
                        <input type="checkbox" id="cbTopic" name="cbTopic" value={ComponentToShow.TOPIC} onClick={e => toggle(e, ComponentToShow.TOPIC)} checked={componentsToShow.includes(ComponentToShow.TOPIC)}/><label htmlFor="cbTopic">Topic</label>
                    </span>
                    <span className="col-lg-1">
                        <input type="checkbox" id="cbTopics" name="cbTopics" value={ComponentToShow.TOPICS} onClick={e => toggle(e, ComponentToShow.TOPICS)} checked={componentsToShow.includes(ComponentToShow.TOPICS)}/><label htmlFor="cbTopics">Topics</label>
                    </span>
                    <span className="col-lg-1">
                        <input type="checkbox" id="cbCalendarDay" name="cbCalendarDay" value={ComponentToShow.CALENDAR_DAY} onClick={e => toggle(e, ComponentToShow.CALENDAR_DAY)} checked={componentsToShow.includes(ComponentToShow.CALENDAR_DAY)}/><label htmlFor="cbCalendarDay">Calendar Day</label>
                    </span>
                    <span className="col-lg-1">
                        <input type="checkbox" id="cbCalendarMonth" name="cbCalendarMonth" value={ComponentToShow.CALENDAR_MONTH} onClick={e => toggle(e, ComponentToShow.CALENDAR_MONTH)} checked={componentsToShow.includes(ComponentToShow.CALENDAR_MONTH)}/><label htmlFor="cbCalendarMonth">Calendar Month</label>
                    </span>
                </div>
                {
                    componentsToShow.includes(ComponentToShow.TASK) || componentsToShow.length < 1
                    ?
                    <div>
                        <h1>Task</h1>
                        <Task initialTask={ getTaskModel() }/>
                    </div>
                    :
                    ""
                }
                {
                    componentsToShow.includes(ComponentToShow.TASKS) || componentsToShow.length < 1
                    ?
                    <div>
                        <h1>Tasks</h1>
                        <Tasks initialTasks={ getTaskModels() }/>
                    </div>
                    :
                    ""
                }
                {
                    componentsToShow.includes(ComponentToShow.TOPIC) || componentsToShow.length < 1
                    ?
                    <div>
                        <h1>Topic</h1>
                        <Topic initialTopicModel={getTopicModel()} initialTopicMode={TopicMode.READ} save={(topicModel) => { console.log(JSON.stringify(topicModel))}}/>
                    </div>
                    :
                    ""
                }
                {
                    componentsToShow.includes(ComponentToShow.TOPICS) || componentsToShow.length < 1
                    ?
                    <div>
                        <h1>Topics</h1>
                        <Topics initialTopicModels={getTopicModels()}/>
                    </div>
                    :
                    ""
                }
                {
                    componentsToShow.includes(ComponentToShow.CALENDAR_DAY) || componentsToShow.length < 1
                    ?
                    <div>
                        <h1>Calendar Day</h1>
                        <CalendarDay initialDayModel={getDayModel(2024, 1, 22)}/>
                    </div>
                    :
                    ""
                }
                {
                    componentsToShow.includes(ComponentToShow.CALENDAR_MONTH) || componentsToShow.length < 1
                    ?
                    <div>
                        <h1>Calendar Month</h1>
                        <CalendarMonth key={1} initialDate={new Date(2024, 2)}/>
                    </div>
                    :
                    ""
                }
            </div>
        )
        :
        ""
    }

    return (
        <div data-testid="journal">
            { getDiscovery() }
            { getLogin() }
        </div>
    );
}