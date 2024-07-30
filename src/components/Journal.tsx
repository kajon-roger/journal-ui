import React, { CSSProperties, useState } from "react"

import { JournalMenu } from "./JournalMenu"
import { Log } from "./Log"
import { LogExplorer } from "./LogExplorer"
import { Tasks } from "./Tasks"
import { TasksExplorer } from "./TasksExplorer"
import { Topics } from "./Topics"
import { TopicsExplorer } from "./TopicsExplorer"
import { LoggedInCallback, Login } from "./Login"
import { LogbookAPIPromise } from "../modules/LogbookAPIPromise"
import { CalendarMonth } from "./CalendarMonth"
import { View } from "../modules/IViewSwitcher"

interface Props {

    initialView: View,
    isLoggedIn?: boolean,
}

export function Journal(props: Props) {

    let [view, setView] = useState(props.initialView);
    let [isLoggedIn, setIsLoggedIn] = useState(props.isLoggedIn ? props.isLoggedIn : false);

    const menuStyle: CSSProperties = {
        height: "10%",
        overflowX: "scroll",
        marginTop: "15px",
        marginBottom: "15px",
        textAlign: "left",
    }

    const workspaceStyle: CSSProperties = {
        height: "90%",
    }

    const explorerStyle: CSSProperties = {
        float: "left",
        width: "20%",
        height: "85%",
        position: "fixed",
        overflowY: "scroll",
        textAlign: "left",
        whiteSpace: "nowrap", // This prevents an explorer title wrapping onto the next line
    }

    const viewStyle: CSSProperties = {
        float: "right",
        width: "80%",
        height: "90%",
        position: "fixed",
        overflowY: "scroll",
        marginLeft: "20%",
        textAlign: "left",
        borderLeft: "1px solid #999; height:80%",
    }

    const loggedInCallback: LoggedInCallback = () => {

        setIsLoggedIn(true);
    }

    const logOut = (): void => {

        LogbookAPIPromise.logout();

        setIsLoggedIn(false);
    }

    const getLogin = (): React.ReactNode => {

        return (
            isLoggedIn
            ?
            ''
            :
            <Login loggedInCallback={loggedInCallback}></Login>
        )
    }

    const getView = () => {
        switch (view) {
            case View.LOG:
                return <Log></Log>;
            case View.TASKS:
                return <Tasks></Tasks>;
            case View.TOPICS:
                return <Topics></Topics>;
            case View.CALENDAR:
                return <CalendarMonth></CalendarMonth>;
        }
    }

    const getExplorer = () => {
        switch (view) {
            case View.LOG:
                return <LogExplorer></LogExplorer>;
            case View.TASKS:
                return <TasksExplorer></TasksExplorer>;
            case View.TOPICS:
                return <TopicsExplorer></TopicsExplorer>
            case View.CALENDAR:
                return "";
        }
    }

    const getJournal = () => {
        return isLoggedIn
        ?
        (
            <div className="container-fluid">
                <div className="row col-lg-12" style={menuStyle} data-testid="journal-menu-pane">
                    <JournalMenu view={view} viewSwitcher={ viewSwitcher } logout={ logOut }/>
                </div>
                <div className="row" data-testid="journal-workspace" style={workspaceStyle}>
                    <div data-testid="journal-explorer-pane" style={explorerStyle}>
                        { getExplorer() }
                    </div>
                    <div data-testid="journal-view-pane" style={viewStyle}>
                        { getView() }
                    </div>
                </div>
            </div>
        )
        :
        ''
    }

    const viewSwitcher: JournalViewSwitcher = (view: View) => {

        setView(view)
    }

    return (
        <div data-testid="journal">
            { getJournal() }
            { getLogin() }
        </div>
    );
}

export interface JournalViewSwitcher {
    (newView: View): void;
}

export interface Logout {
    (): void;
}