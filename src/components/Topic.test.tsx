import { render, fireEvent, screen, queryByText } from "@testing-library/react";

import { Topic, TopicMode } from "./Topic";
import { title } from "process";
import { TopicModel } from "../models/topic.model";
import userEvent from "@testing-library/user-event";

describe("Tesing Topic in Read Mode", () => {

    it("Displays in read mode according to mode property", () => {

        let initialTopicModel: TopicModel = {
            title: "The Topic Title"
        };

        render(<Topic initialTopicModel={initialTopicModel} initialTopicMode={TopicMode.READ} save={(topicModel => {})}></Topic>);

        expect(screen.getByTestId("topic-read-view")).toBeInTheDocument();
        expect(screen.queryByTestId("topic-edit-view")).not.toBeInTheDocument();
    });

    it("Displays the topic title", () => {

        let initialTopicModel: TopicModel = {
            title: "The Topic Title"
        };

        render(<Topic initialTopicModel={initialTopicModel} initialTopicMode={TopicMode.READ} save={(topicModel => {})}></Topic>);

        expect(screen.getByText("The Topic Title")).toBeInTheDocument();
    });
    
    it("Displays the topic text", () => {

        let initialTopicModel: TopicModel = {
            title: "The Topic Title",
            text: "The Topic Text"
        };

        render(<Topic initialTopicModel={initialTopicModel} initialTopicMode={TopicMode.READ} save={(topicModel => {})}></Topic>);

        expect(screen.getByText("The Topic Text")).toBeInTheDocument();
    });
});

describe("Tesing Topic in Edit Mode", () => {

    it("Displays in edit mode according to mode property", () => {

        let initialTopicModel: TopicModel = {
            title: "The Topic Title"
        };

        render(<Topic initialTopicModel={initialTopicModel} initialTopicMode={TopicMode.EDIT} save={(topicModel => {})}></Topic>);

        expect(screen.getByTestId("topic-edit-view")).toBeInTheDocument();
        expect(screen.queryByTestId("topic-read-view")).not.toBeInTheDocument();
    });

    it("Displays the topic title textbox", () => {

        let initialTopicModel: TopicModel = {
            title: "The Topic Title"
        };

        render(<Topic initialTopicModel={initialTopicModel} initialTopicMode={TopicMode.EDIT} save={(topicModel => {})}></Topic>);

        let titleTextBox = screen.getByRole("textbox", { name: /title:/i}); // NOTE that for this to work, the htmlFor of the label must eaqual the id of the associated text input, and the name field (in the JSON here) is the text of the label
        expect(titleTextBox).toBeInTheDocument();
    });
    
    it("Displays the topic text textarea", () => {

        let initialTopicModel: TopicModel = {
            title: "The Topic Title"
        };

        render(<Topic initialTopicModel={initialTopicModel} initialTopicMode={TopicMode.EDIT} save={(topicModel => {})}></Topic>);

        let titleTextBox = screen.getByRole("textbox", { name: /text:/i});
        expect(titleTextBox).toBeInTheDocument();
    });
    
    it("Displays the Save button", () => {

        let initialTopicModel: TopicModel = {
            title: "The Topic Title"
        };

        render(<Topic initialTopicModel={initialTopicModel} initialTopicMode={TopicMode.EDIT} save={(topicModel => {})}></Topic>);

        let saveButton = screen.getByText("Save");
        expect(saveButton).toBeInTheDocument();
    });
    
    it("Displays the Cancel button", () => {

        let initialTopicModel: TopicModel = {
            title: "The Topic Title"
        };

        render(<Topic initialTopicModel={initialTopicModel} initialTopicMode={TopicMode.EDIT} save={(topicModel => {})}></Topic>);

        let cancelButton = screen.getByText("Cancel");
        expect(cancelButton).toBeInTheDocument();
    });
});

describe("Testing Topic changes between Read Mode and Edit Mode", () => {

    it("Switches from read mode to edit mode when title is double-clicked", () => {

        let initialTopicModel: TopicModel = {
            title: "The Topic Title"
        };

        render(<Topic initialTopicModel={initialTopicModel} initialTopicMode={TopicMode.READ} save={(topicModel => {})}></Topic>);

        let theTitle = screen.getByTestId("topic-read-view-title");
        fireEvent.doubleClick(theTitle);
        expect(screen.queryByTestId("topic-read-view")).not.toBeInTheDocument();
        expect(screen.queryByTestId("topic-edit-view")).toBeInTheDocument();
    });

    it("Switches from read mode to edit mode when text is double-clicked", () => {

        let initialTopicModel: TopicModel = {
            title: "The Topic Title"
        };

        render(<Topic initialTopicModel={initialTopicModel} initialTopicMode={TopicMode.READ} save={(topicModel => {})}></Topic>);

        let theText = screen.getByTestId("topic-read-view-text");
        fireEvent.doubleClick(theText);
        expect(screen.queryByTestId("topic-read-view")).not.toBeInTheDocument();
        expect(screen.queryByTestId("topic-edit-view")).toBeInTheDocument();
    });

    it("Switches from edit mode to read mode when Save button is clicked", () => {

        let initialTopicModel: TopicModel = {
            title: "The Topic Title"
        };

        render(<Topic initialTopicModel={initialTopicModel} initialTopicMode={TopicMode.EDIT} save={(topicModel => {})}></Topic>);

        let theSaveButton = screen.getByText(/save/i);
        fireEvent.click(theSaveButton);
        expect(screen.queryByTestId("topic-read-view")).toBeInTheDocument();
        expect(screen.queryByTestId("topic-edit-view")).not.toBeInTheDocument();
    });

    it("Switches from edit mode to read mode when Cancel button is clicked", () => {

        let initialTopicModel: TopicModel = {
            title: "The Topic Title"
        };

        render(<Topic initialTopicModel={initialTopicModel} initialTopicMode={TopicMode.EDIT} save={(topicModel => {})}></Topic>);

        let theCancelButton = screen.getByText(/cancel/i);
        fireEvent.click(theCancelButton);
        expect(screen.queryByTestId("topic-read-view")).toBeInTheDocument();
        expect(screen.queryByTestId("topic-edit-view")).not.toBeInTheDocument();
    });
});

describe("Testing the topic save functionality", () => {

    it("Calls the save method passed as a property when Save button is clicked", () => {

        let initialTopicModel: TopicModel = {
            title: "The Topic Title"
        };

        let save = jest.fn((topicModel: TopicModel) => {});

        render(<Topic initialTopicModel={initialTopicModel} initialTopicMode={TopicMode.EDIT} save={(topicModel) => save(topicModel)}></Topic>);

        let saveButton = screen.getByText("Save");
        userEvent.click(saveButton);
        expect(save).toHaveBeenCalled();
    });

    it("Passes the user edited title to the save method passed as a property when Save button is clicked", async () => {

        let initialTopicModel: TopicModel = {
            title: ""
        };

        let save = jest.fn((topicModel: TopicModel) => {});

        render(<Topic initialTopicModel={initialTopicModel} initialTopicMode={TopicMode.EDIT} save={(topicModel) => save(topicModel)}></Topic>);

        // User edits the title
        let theTitleTextbox = screen.getByRole("textbox", { name: /title:/i});
        fireEvent.change(theTitleTextbox, { target: { value: "The user entered title"}});
        // User clicks the save button
        let saveButton = screen.getByText("Save");
        userEvent.click(saveButton);
        expect(save).toHaveBeenCalledWith({ text: "", title: "The user entered title"});
    });

    it("Passes the user edited text to the the save method passed as a property when Save button is clicked", () => {

        let initialTopicModel: TopicModel = {
            title: ""
        };

        let save = jest.fn((topicModel: TopicModel) => {});

        render(<Topic initialTopicModel={initialTopicModel} initialTopicMode={TopicMode.EDIT} save={(topicModel) => save(topicModel)}></Topic>);

        // User edits the title
        let theTextTextbox = screen.getByRole("textbox", { name: /text:/i});
        fireEvent.change(theTextTextbox, { target: { value: "The user entered text"}});
        // User clicks the save button
        let saveButton = screen.getByText("Save");
        userEvent.click(saveButton);
        expect(save).toHaveBeenCalledWith({ text: "The user entered text", title: ""});
    });
});

function getTopicModel(): TopicModel {

    return {
        title: "The Title",
        text: "The text",
        level: 0,
        id: 1,
    }
}

function addSubTopicModels(topicModel: TopicModel): TopicModel {

    topicModel.sub_topics = [
        {
            title: "The Sub Title 1",
            text: "The sub text 1",
            level: 1,
            parent_id: topicModel.id,
            id: topicModel.id === undefined ? 1 : topicModel.id + 1,
        },
        {
            title: "The Sub Title 2",
            text: "The sub text 2",
            level: 1,
            parent_id: topicModel.id,
            id: topicModel.id === undefined ? 1 : topicModel.id + 2,
        },
    ];

    return topicModel;
}

function getTopicModelWithSubTopics(): TopicModel {

    let topicModel = getTopicModel();
    return addSubTopicModels(topicModel);
}

describe("Testing Topic with Sub-Topics", () => {

    it("Displays an expand widget when sub-topics are present but hidden", () => {

        let initialTopicModel = getTopicModelWithSubTopics();

        render(<Topic initialTopicModel={initialTopicModel} initialTopicMode={TopicMode.READ} save={topicModel => {}}></Topic>);

        expect(screen.getByText("+")).toBeInTheDocument();
    });

    it("Expands the sub-topics when the expand widget is clicked", () => {

        let initialTopicModel = getTopicModelWithSubTopics();

        render(<Topic initialTopicModel={initialTopicModel} initialTopicMode={TopicMode.READ} save={topicModel => {}}></Topic>);

        let theExpandWidget = screen.getByText("+");

        // confirm the sub topic is not present
        let theFirstSubTopicTitle = screen.queryByText("The Sub Title 1");
        expect(theFirstSubTopicTitle).not.toBeInTheDocument();

        userEvent.click(theExpandWidget);

        // Confirm the sub topic is now visible
        theFirstSubTopicTitle = screen.queryByText("The Sub Title 1");
        expect(theFirstSubTopicTitle).toBeInTheDocument();

        // Confirm the collapse widget is present
        expect(screen.getByText("-")).toBeInTheDocument();
    });

    it("Hides the sub-topics when the collapse widget is clicked", () => {

        let initialTopicModel = getTopicModelWithSubTopics();

        render(<Topic initialTopicModel={initialTopicModel} initialTopicMode={TopicMode.READ} save={topicModel => {}} displayExpanded={true}></Topic>);

        let theCollapseWidget = screen.getByText("-");

        // confirm the sub topic is present
        let theFirstSubTopicTitle = screen.queryByText("The Sub Title 1");
        expect(theFirstSubTopicTitle).toBeInTheDocument();

        userEvent.click(theCollapseWidget);

        // Confirm the sub topic is not visible
        theFirstSubTopicTitle = screen.queryByText("The Sub Title 1");
        expect(theFirstSubTopicTitle).not.toBeInTheDocument();

        // Confirm the expand widget is present
        expect(screen.getByText("+")).toBeInTheDocument();
    });
});