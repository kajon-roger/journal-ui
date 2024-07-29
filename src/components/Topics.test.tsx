import { render, screen } from "@testing-library/react";

import { Topics } from "./Topics";
import { TopicModel } from "../models/topic.model";

describe("Testing the Topics Component", () => {

    it("Displays the topics in READ mode", () => {

        let topics: TopicModel[] = [];
        topics.push(new TopicModel("Title One", "Text One", 1, undefined, undefined));
        topics.push(new TopicModel("Title Two", "Text Two", 2, undefined, undefined));
        topics.push(new TopicModel("Title Three", "Text Three", 3, undefined, undefined));

        render(<Topics initialTopicModels={topics}/>);

        let topicComponents = screen.getAllByTestId("topic-read-view");
        expect(topicComponents.length).toBe(3);
    });
});