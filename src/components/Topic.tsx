import React, { useState, CSSProperties } from "react";

import { TopicModel } from "../models/topic.model";
import { clone } from "../utils/clone";
import { ComponentType, ID } from "../utils/ID";
import { TextUtils } from "../utils/text-utils";

export enum TopicMode {
    READ,
    EDIT
}

interface TopicSave {
    (topicModel: TopicModel): void;
}

interface TopicProps {
    initialTopicModel: TopicModel,
    initialTopicMode: TopicMode,
    save: TopicSave,
    displayExpanded?: boolean
}

export function Topic(props: TopicProps) {

    let [ topicMode, setTopicMode] = useState(props.initialTopicMode);
    let [ topicModel, setTopicModel] = useState(props.initialTopicModel);
    let [ expanded, setExpanded] = useState(props.displayExpanded ? true : false);
    let [ subTopicToggleHover, setSubTopicToggleHover] = useState(false);

    let getTitle = (): string => {

        return (document.getElementById("title") as HTMLInputElement).value;
    }

    let getText = (): string => {

        return (document.getElementById("text") as HTMLTextAreaElement).value;
    }

    let save = () => {

        let editedTopicModel = clone(topicModel);
        editedTopicModel.title = getTitle();
        editedTopicModel.text = getText();

        // HERE we should call the save topic API
        // Below should be done in the .then block
        props.save(editedTopicModel);
        setTopicMode(TopicMode.READ);
    }

    let toggleSubTopics = (): void => {

        setExpanded(!expanded);
    }

    let subTopicsToggleChar = (): string => {

        return expanded ? "-" : "+";
    }

    let toggleSubTopicStyle: CSSProperties = {
            cursor: subTopicToggleHover ? "pointer" : "default",
            textAlign: 'center',
            width: '100px',
    }

    let getTopicStyle = (level: number|undefined): CSSProperties => {

        return {
            textAlign: 'left',
            // marginLeft: `${(level === undefined ? 0 : level) * 40}px`,
            marginLeft: `${(level === undefined || level === 0 ? 0 : 40)}px`,
        };
    }

    let labelStyle: CSSProperties = {
        textAlign: "right",
    }

    let getExpander = (): React.ReactNode => {

        return (
            topicModel.sub_topics && topicModel.sub_topics.length > 0
            ?
            <span style={toggleSubTopicStyle} onMouseEnter={() => setSubTopicToggleHover(true)} onMouseLeave={() => setSubTopicToggleHover(false)} onClick={() => toggleSubTopics()}>{subTopicsToggleChar()}</span>
            :
            ""
        );
    }

    let getHyperlinkMarkup = (topic: TopicModel): string|undefined => {
        return topic.id
        ?
        `@@TOPIC|${topic.id}|Goto Topic ${topic.title}@@`
        :
        undefined
    }

    let copyHyperlinkToClipboard = (): void => {

        let hyperlink = getHyperlinkMarkup(topicModel);

        if (hyperlink) {

            navigator.clipboard.writeText(hyperlink);
            alert("Copied the text: " + hyperlink);
        } else {
            alert("NO HYPERLINK TOP COPY");
        }
    }

    let getReadView = () => {

        return (
            topicMode === TopicMode.READ
            ?
            <div>
                <div data-testid="topic-read-view" onDoubleClick={ () => setTopicMode(TopicMode.EDIT) }>
                    <h1 data-testid="topic-read-view-title">
                        { getExpander() }
                        { topicModel.title }
                        <button onClick={e => copyHyperlinkToClipboard() }>Copy Hyperlink to Clipboard</button>
                    </h1>
                    { TextUtils.textToLines(topicModel.text, ComponentType.TOPIC, topicModel.id) }
                </div>
                {
                    topicModel.sub_topics && expanded
                    ?
                    topicModel.sub_topics.map(subTopicModel => <Topic key={subTopicModel.id} initialTopicMode={TopicMode.READ} initialTopicModel={subTopicModel} save={(topicModel) => props.save(topicModel)}/>)
                    :
                    ""
                }
            </div>
            :
            ""
        );
    }

    let getEditView = () => {

        return (
            topicMode === TopicMode.EDIT
            ?
            <div data-testid="topic-edit-view" className="container-fluid" style={getTopicStyle(topicModel.level)}>
                <div className="row">
                    <div className="col-lg-1" style={labelStyle}>
                        <label htmlFor="title">Title:</label>
                    </div>
                    <div className="col-lg-11">
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="<Title>"
                            defaultValue={ topicModel.title }
                            style={{width: "100%"}}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-1" style={labelStyle}>
                        <label htmlFor="text">Text:</label>
                    </div>
                    <div className="col-lg-11">
                        <textarea
                            id="text"
                            name="text"
                            defaultValue={ topicModel.text }
                            style={{width: "100%", height: "400px"}}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-1" style={labelStyle}>
                    </div>
                    <div className="col-lg-11">
                        <input
                            type="button"
                            value="Save"
                            onClick={() => save()}
                        />
                        <input
                            type="button"
                            value="Cancel"
                            onClick={() => setTopicMode(TopicMode.READ)}
                        />
                    </div>
                </div>
            </div>
            :
            ""
        );
    }

    return (
        <div className="row" style={getTopicStyle(topicModel.level)}>
            <div className="col-lg-12" data-testid={`topic${ topicModel.id ? `_${topicModel.id}` : ``}`} id={ID.createId(topicModel.id, ComponentType.TOPIC)}>
                { getReadView() }
                { getEditView() }
            </div>
        </div>
    );
}