import React, { useState, useEffect } from "react"
import { TopicModel } from "../models/topic.model";
import { Topic, TopicMode } from "./Topic";
import { TopicHierachyFactory } from "../utils/topic-hierarchy-factory";
import { LogbookAPIPromise } from "../modules/LogbookAPIPromise";

interface Props {

    initialTopicModels?: TopicModel[]
}

export function Topics(props: Props) {

    let [topicModels, setTopicModels] = useState(props.initialTopicModels ? props.initialTopicModels : []);

    useEffect(() => {
        getTopics();
    },
    []); // Deps is an empty array so this function is only called when the component is first loaded (like componentDidMount)

    let getTopics = (): void => {

        LogbookAPIPromise.getTopics(true).then(topics => {
            setTopicModels(topics);
        })
    }

    return (
        <div data-testid="topics" className="container-fluid">
            {
                TopicHierachyFactory.createHierarchy(topicModels).map( topicModel => {
                    return <Topic key={ topicModel.id } initialTopicMode={TopicMode.READ} initialTopicModel={ topicModel } save={ topicModel => console.log(JSON.stringify(topicModel))}/>
                })
            }
        </div>
    );
}
