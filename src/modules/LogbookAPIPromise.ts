import { Configuration } from "./Configuration";
import { DayModel } from "../models/day.model";
import { EntryModel } from "../models/entry.model";
import { TaskModel, TaskStatus } from "../models/task.model";
import { TopicModel } from "../models/topic.model";
import { clone } from "../utils/clone";
import Moment from 'moment';
import { AppointmentModel } from "../models/appointment.model";

export class LogbookAPIPromise {

    public static login(userEmail: string, userPassword: string): Promise<boolean> {

        let url = `${Configuration.apiUrl}/users/login`;

        console.log(`Using API URL: ${url}`);

        return fetch(url, {
            method: "POST",
            body: JSON.stringify({
                "email": userEmail,
                "password": userPassword
            }),
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`Failed to login: HTTP response ${response.status} ${response.statusText}`);
            }
        })
        .then((jwt: {token: string}) => {
            console.log(`LogbookAPIPromise.login jwt: ${jwt}`);
            Configuration.token = jwt.token;
            return Promise.resolve(true);
        })
        .catch(message => {
            console.log(`Error logging into API: ${message}`);
            return Promise.resolve(false);
        });
    }

    public static logout() {
        Configuration.token = undefined;
    }

    public static getDays(includeEntries: boolean, includeAppointments: boolean, fromDate?: Date, toDate?: Date): Promise<DayModel[]> {

        let url = `${Configuration.apiUrl}/days?filter=${this.constructDaysFilter(includeEntries, includeAppointments, fromDate, toDate)}`;

        console.log(`Using API URL: ${url}`);

        return fetch(url, {
                method: "GET",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${Configuration.token}`
                }
            })
            .then((response) => { return response.json() });
    }

    private static constructDaysFilter(includeEntries: boolean, includeAppointments: boolean, fromDate?: Date, toDate?: Date): string {

        let filter: any = {
            "order": "date ASC"
        };

        if (includeEntries) {

            filter["include"] = [{ "relation": "entries"}];
        }

        if (includeAppointments) {

            filter["include"] = [{ "relation": "appointments"}];
        }

        if (includeEntries && includeAppointments) {

            filter["include"] = [{ "relation": "entries"}, { "relation": "appointments"}];
        }

        if (fromDate) {

            let from = Moment(fromDate).format('YYYY-MM-DD');

            filter["where"] = {
                "date": {
                    "gte": from
                }
            }
        }

        if (toDate) {

            let to = Moment(toDate).format('YYYY-MM-DD');

            filter["where"] = {
                "date": {
                    "lt": to
                }
            }
        }

        if (fromDate && toDate) {

            let from = Moment(fromDate).format('YYYY-MM-DD');
            let to = Moment(toDate).format('YYYY-MM-DD');

            filter["where"] = {
                "and": [{ "date": { "gte": from }}, { "date": { "lt": to }}]
            }
        }

        return JSON.stringify(filter);
    }

    public static saveDay(dayModel: DayModel): Promise<DayModel> {
        if (dayModel.id) {

            return this.updateDay(dayModel);
        } else {

            return this.createDay(dayModel);
        }
    }

    private static createDay(dayModel: DayModel): Promise<DayModel> {

        let dayToSend: DayModel = {
            date: dayModel.date,
        }

        let url = dayModel.id ? Configuration.apiUrl + '/days/' + dayModel.id : Configuration.apiUrl + '/days';
        return fetch(url,
            {
                method: "POST",
                body: JSON.stringify(dayToSend),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${Configuration.token}`
                }
            })
            .then((response) => response.json());
    }

    private static updateDay(dayModel: DayModel): Promise<DayModel> {

        let dayToSend: DayModel = {
            id: dayModel.id,
            date: dayModel.date,
        }

        let url = Configuration.apiUrl + '/days/' + dayModel.id;
        return fetch(url,
            {
                method: "PUT",
                body: JSON.stringify(dayToSend),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${Configuration.token}`
                }
            })
            .then((response) => { return Promise.resolve(dayModel) } );
    }

    public static saveEntry(entryModel: EntryModel): Promise<EntryModel> {

        if (entryModel.id) {

            return this.updateEntry(entryModel);
        } else {

            return this.createEntry(entryModel);
        }
    }

    private static createEntry(entryModel: EntryModel): Promise<EntryModel> {

        let url = Configuration.apiUrl + '/entries';
        return fetch(url,
            {
                method: "POST",
                body: JSON.stringify(entryModel),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${Configuration.token}`
                }
            })
            .then(response => response.json());
    }

    private static updateEntry(entryModel: EntryModel): Promise<EntryModel> {
        
        let url = Configuration.apiUrl + '/entries/' + entryModel.id;
        return fetch(url,
            {
                method: "PUT",
                body: JSON.stringify(entryModel),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${Configuration.token}`
                }
            })
            .then(() => Promise.resolve(entryModel) );
    }

    public static saveTask(taskModel: TaskModel): Promise<TaskModel> {

        if (!taskModel.complete_dt) {

            delete(taskModel.complete_dt);
        }

        if (taskModel.id) {

            return this.updateTask(taskModel);
        } else {

            return this.createTask(taskModel);
        }
    }

    private static createTask(taskModel: TaskModel): Promise<TaskModel> {

        let clone = this.cloneAndCleanTask(taskModel);
        let url = Configuration.apiUrl + '/tasks';
        return fetch(url,
            {
                method: "POST",
                body: JSON.stringify(clone),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${Configuration.token}`
                }
            })
            .then((response) =>  response.json() );
    }

    private static updateTask(taskModel: TaskModel): Promise<TaskModel> {

        let clone = this.cloneAndCleanTask(taskModel);
        let url = Configuration.apiUrl + '/tasks/' + clone.id;
        return fetch(url,
            {
                method: "PUT",
                body: JSON.stringify(clone),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${Configuration.token}`
                }
            })
            .then(() => Promise.resolve(taskModel) );
    }

    private static cloneAndCleanTask(taskModel: TaskModel): TaskModel {

        let cloneTask = clone(taskModel);
        delete(cloneTask.complete_dt);
        return cloneTask;
    }

    public static getTasks(taskStatus: TaskStatus): Promise<TaskModel[]> {

        let url = `${Configuration.apiUrl}/tasks`;

        switch (taskStatus) {
            case TaskStatus.ALL:
                url += `?filter={"order": "scheduled ASC" }`
                break;
            case TaskStatus.COMPLETE:
                url += `?filter={"order": "scheduled ASC", "where": { "complete": true } }`
                break;
            case TaskStatus.NOT_COMPLETE:
                url += `?filter={"order": "scheduled ASC", "where": { "complete": false } }`
                break;
            default:
                throw new Error(`Unexpected taskStats value: ${taskStatus}`);
        }

        console.log(`Using API URL: ${url}`);

        return fetch(url, {
                method: "GET",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${Configuration.token}`
                }
            })
            .then((response) => response.json());
    }

    public static getTopics(includeDeleted: boolean = false): Promise<TopicModel[]> {

        let url = '';

        if (includeDeleted) {

            url = `${Configuration.apiUrl}/topics`;
        } else {
            url = `${Configuration.apiUrl}/topics?filter={ "where": {"deleted": false}}`;
        }

        console.log(`Using API URL: ${url}`);

        return fetch(url, {
                method: "GET",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${Configuration.token}`
                }
            })
            .then((response) => { return response.json() });
    }

    public static saveTopic(topicModel: TopicModel): Promise<TopicModel> {

        if (topicModel.id) {

            return this.updateTopic(topicModel);
        } else {

            return this.createTopic(topicModel);
        }
    }

    private static createTopic(topicModel: TopicModel): Promise<TopicModel> {

        let clone = this.cloneAndCleanTopic(topicModel);
        let url = Configuration.apiUrl + '/topics';
        return fetch(url,
            {
                method: "POST",
                body: JSON.stringify(clone),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${Configuration.token}`
                }
            })
            .then((response) =>  response.json() );
    }

    private static updateTopic(topicModel: TopicModel): Promise<TopicModel> {

        let clone = this.cloneAndCleanTopic(topicModel);
        let url = Configuration.apiUrl + '/topics/' + clone.id;
        return fetch(url,
            {
                method: "PUT",
                body: JSON.stringify(clone),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${Configuration.token}`
                }
            })
            .then(() => Promise.resolve(topicModel) );
    }

    private static cloneAndCleanTopic(topic: TopicModel): TopicModel {

        let cloneTopic = clone(topic);
        delete(cloneTopic.sub_topics);
        delete(cloneTopic.level);
        if (!cloneTopic.parent_id) {

            delete(cloneTopic.parent_id);
        }
        console.log(`Topic being sent: ${JSON.stringify(clone)}`)
        return cloneTopic;
    }

    public static saveAppointment(appointmentModel: AppointmentModel): Promise<AppointmentModel> {

        if (appointmentModel.id) {

            return this.updateAppointment(appointmentModel);
        } else {

            return this.createAppointment(appointmentModel);
        }
    }

    private static createAppointment(appointmentModel: AppointmentModel): Promise<AppointmentModel> {

        let clone = this.cloneAndCleanAppointment(appointmentModel);
        let url = Configuration.apiUrl + `/days/${appointmentModel.day_id}/appointments`;
        return fetch(url,
            {
                method: "POST",
                body: JSON.stringify(clone),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${Configuration.token}`
                }
            })
            .then(response => response.json());
    }

    private static updateAppointment(appointmentModel: AppointmentModel): Promise<AppointmentModel> {
        
        let clone = this.cloneAndCleanAppointment(appointmentModel);
        let url = Configuration.apiUrl + `/days/${appointmentModel.day_id}/appointments`;
        return fetch(url,
            {
                method: "PATCH",
                body: JSON.stringify(clone),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${Configuration.token}`
                }
            })
            .then(() => Promise.resolve(appointmentModel) );
    }

    private static cloneAndCleanAppointment(appointmentModel: AppointmentModel): AppointmentModel {

        let cloneAppointmentModel = clone(appointmentModel);
        delete(cloneAppointmentModel.new_appointment);
        delete(cloneAppointmentModel.new_appointment_id);
        return cloneAppointmentModel;
    }
}