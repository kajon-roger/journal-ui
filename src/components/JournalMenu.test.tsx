import { render, fireEvent, screen } from "@testing-library/react";

import { JournalMenu } from "./JournalMenu";
import userEvent from "@testing-library/user-event";
import { View } from "../modules/IViewSwitcher";

//
// Note that the most reliable tests of a UI will be those that mimic what a user will do
// not how the UI has been implemented, for this reason, it is better to confirm that
// there is an element that can be read by the user, rather than that there is a HTLM node
// with a given data-testid.
// If the human readable element is meant to cause a change to the UI then get it and test the 
// human action (say a click) does cause a method to be invoked or another element to appear...
//
it("Displays the menu to switch to the log view", () => {

    let changeView = jest.fn((view: View) => {});
    let logout = jest.fn(() => {});

    render(<JournalMenu view={View.TASKS} viewSwitcher={ (view) => { changeView(view) }} logout={ () => logout()}></JournalMenu>);

    let theView = screen.queryByTestId("journal-menu");
    expect(theView).not.toBeNull();
    expect(theView).toBeInTheDocument();
});

it("Displays a button to switch to Log view", () => {

    let changeView = jest.fn((view: View) => {});
    let logout = jest.fn(() => {});

    render(<JournalMenu view={View.TASKS} viewSwitcher={ (view) => { changeView(view) }} logout={ () => logout()}></JournalMenu>);

    let logViewButton = screen.queryByText("Log");
    expect(logViewButton).not.toBeNull();
    expect(logViewButton).toBeInTheDocument();

    // With reference to the above (large) comment
    // This is unnecessary all we need to do is confirm the human readable element exists
    // and then in a separate test, confirm that a user ation causes the change we want.
    // expect(logViewButton?.nodeName).toBe("INPUT");
    // let typeAttribute = logViewButton?.attributes.getNamedItem("type");
    // expect(typeAttribute).not.toBeNull();
    // expect(typeAttribute?.value).toBe("button");
});

it("Calls the view switcher with View.LOG when Log menu button is clicked", () => {

    let changeView = jest.fn((view: View) => {});
    let logout = jest.fn(() => {});

    render(<JournalMenu view={View.TASKS} viewSwitcher={ (view) => { changeView(view) }} logout={ () => logout()}></JournalMenu>);

    let logViewButton = screen.getByText("Log");

    // See above comment - here we are confirming that when the user clicks the element that says Log
    // a function passed to the Journal is called with the necessary View enum value.
    userEvent.click(logViewButton);

    expect(changeView).toHaveBeenCalledWith(View.LOG);
});

it("Displays an input of type button to switch to Tasks view", () => {

    let changeView = jest.fn((view: View) => {});
    let logout = jest.fn(() => {});

    render(<JournalMenu view={View.LOG} viewSwitcher={ (view) => { changeView(view) }} logout={ () => logout()}></JournalMenu>);

    let tasksViewButton = screen.queryByText("Tasks");
    expect(tasksViewButton).not.toBeNull();
    expect(tasksViewButton).toBeInTheDocument();
});

it("Calls the view switcher with View.TASKS when Tasks menu button is clicked", () => {

    let changeView = jest.fn((view: View) => {});
    let logout = jest.fn(() => {});

    render(<JournalMenu view={View.LOG} viewSwitcher={ (view) => { changeView(view) }} logout={ () => logout()}></JournalMenu>);

    let tasksViewButton = screen.getByText("Tasks");

    userEvent.click(tasksViewButton);

    expect(changeView).toHaveBeenCalledWith(View.TASKS);
});

it("Displays a button to switch to Topics view", () => {

    let changeView = jest.fn((view: View) => {});
    let logout = jest.fn(() => {});

    render(<JournalMenu view={View.TASKS} viewSwitcher={ (view) => { changeView(view) }} logout={ () => logout()}></JournalMenu>);

    let topicsViewButton = screen.queryByText("Topics");
    expect(topicsViewButton).not.toBeNull();
    expect(topicsViewButton).toBeInTheDocument();
});

it("Calls the view switcher with View.TOPICS when Topics menu button is clicked", () => {

    let changeView = jest.fn((view: View) => {});
    let logout = jest.fn(() => {});

    render(<JournalMenu view={View.TASKS} viewSwitcher={ (view) => { changeView(view) }} logout={ () => logout()}></JournalMenu>);

    let tasksViewButton = screen.getByText("Topics");

    userEvent.click(tasksViewButton);

    expect(changeView).toHaveBeenCalledWith(View.TOPICS);
});

it("Calls the logout method when the Logout button is clicked", () => {

    let changeView = jest.fn((view: View) => {});
    let logout = jest.fn(() => {});

    render(<JournalMenu view={View.TASKS} viewSwitcher={ (view) => { changeView(view) }} logout={ () => logout()}></JournalMenu>);

    let logoutButton = screen.getByText("Logout");

    userEvent.click(logoutButton);

    expect(logout).toHaveBeenCalled();
});