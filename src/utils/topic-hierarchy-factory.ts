import { TopicModel } from "../models/topic.model";
import { clone } from "./clone";

export class TopicHierachyFactory {

    private constructor() {}

    public static createHierarchy(topics: TopicModel[]): TopicModel[] {

        let flat = clone(topics);
        let structured: TopicModel[] = [];

        for (let i = 0; i < flat.length; i++) {

            this.addAsSubTopic(flat[i], flat);
        }

        for (let i = 0; i < flat.length; i++) {

            if (!flat[i].parent_id) {
                structured.push(flat[i]);
            }
        }

        this.setLevels(structured);

        return structured;
    }

    private static addAsSubTopic(topic: TopicModel, allTopics: TopicModel[]) {

        if (topic.parent_id) {
            for (let i = 0; i < allTopics.length; i++) {
                if (allTopics[i].id === topic.parent_id) {
                    if (!allTopics[i].sub_topics) {
                        allTopics[i].sub_topics = [];
                    }
                    allTopics[i].sub_topics?.push(topic);
                    break;
                }
            }
        }
    }

    private static setLevels(topics: TopicModel[], parentTopic?: TopicModel) {

        topics.forEach((topic) => {
            if (parentTopic) {
                topic.level = (parentTopic.level ? parentTopic.level : 0) + 1;
            } else {
                topic.level = 0;
            }
            if (topic.sub_topics && topic.sub_topics.length > 0) {
                this.setLevels(topic.sub_topics, topic); // Recursive
            }
        });
    }
}
