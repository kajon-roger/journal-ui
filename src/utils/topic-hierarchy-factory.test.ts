import { TopicModel } from "../models/topic.model";
import { TopicHierachyFactory } from "./topic-hierarchy-factory";

it("creates a structure of 1 parent with three children", () => {

    let parent: TopicModel = new TopicModel("Parent Title", "Parent text", 1);

    let child1: TopicModel = new TopicModel("Child 1 Title", "Child 1 text", 2, 1);
    let child2: TopicModel = new TopicModel("Child 2 Title", "Child 2 text", 3, 1);
    let child3: TopicModel = new TopicModel("Child 3 Title", "Child 3 text", 4, 1);

    let structured = TopicHierachyFactory.createHierarchy([parent, child1, child2, child3]);

    expect(structured.length).toBe(1);
    expect(structured[0].sub_topics?.length).toBe(3);
});