export class TopicModel {

    public level?: number;
    constructor(public title: string, public text?: string, public id?: number, public parent_id?: number, public sub_topics?: TopicModel[]) {
        
    }
}