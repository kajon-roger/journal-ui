import { render, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Journal } from "./Journal";
import { View } from "../modules/IViewSwitcher";

it("Renders the journal in log view", () => {

    render(<Journal initialView={ View.LOG } isLoggedIn={true}></Journal>);

    let theView = screen.queryByTestId("log");
    expect(theView).not.toBeNull();
    expect(theView).toBeInTheDocument();
});

it("Renders the journal in tasks view", () => {

    render(<Journal initialView={ View.TASKS } isLoggedIn={true}></Journal>);

    let theView = screen.queryByTestId("tasks");
    expect(theView).not.toBeNull();
    expect(theView).toBeInTheDocument();
});

it("Renders the journal in topics view", () => {

    render(<Journal initialView={ View.TOPICS } isLoggedIn={true}></Journal>);

    let theView = screen.queryByTestId("topics");
    expect(theView).not.toBeNull();
    expect(theView).toBeInTheDocument();
});

it("Displays journal menu", () => {

    render(<Journal initialView={ View.LOG } isLoggedIn={true}></Journal>);

    let journalMenu = screen.queryByTestId("journal-menu");
    expect(journalMenu).not.toBeNull();
    expect(journalMenu).toBeInTheDocument();
});

it("Changes the journal view when the menu item is clicked", () => {

    render(<Journal initialView={ View.LOG } isLoggedIn={true}></Journal>);

    let tasksViewButton = screen.getByText("Topics");

    userEvent.click(tasksViewButton);

    let theLogView = screen.queryByTestId("log");
    let theTopicsView = screen.getByTestId("topics");

    expect(theLogView).not.toBeInTheDocument();
    expect(theTopicsView).toBeInTheDocument();
});