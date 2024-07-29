import React, { useState, useEffect } from "react";

import { TopicModel } from "../models/topic.model";
import { focus } from "../utils/focus";
import { ComponentType, ID } from "../utils/ID";
import { LogbookAPIPromise } from "../modules/LogbookAPIPromise";

interface Props {

    initialTopicModels?: TopicModel[]
}

export function TopicsExplorer(props: Props) {

    let [topicModels, setTopicModels] = useState(props.initialTopicModels ? props.initialTopicModels : []);

    useEffect(() => {
        getTopics();
    },
    []); // Deps is an empty array so this function is only called when the component is first loaded (like componentDidMount)

    let getTopics = (): void => {

        LogbookAPIPromise.getTopics().then(topics => {
            setTopicModels(topics);
        })
    }

    return (
        <div>
            {
                topicModels.map(topic => <p key={`topic-explorer-id-${topic.id}`} onClick={() => focus(ID.createId(topic.id, ComponentType.TOPIC))}>{topic.title}</p>)
            }
        </div>
    );
}