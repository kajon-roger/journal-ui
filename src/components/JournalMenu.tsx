import React, { CSSProperties, useState } from "react";

import { JournalViewSwitcher, Logout } from "./Journal";
import { View } from "../modules/IViewSwitcher";

interface Props {
    view: View,
    viewSwitcher: JournalViewSwitcher,
    logout: Logout
}

export function JournalMenu(props: Props) {

    let [ view, setView ] = useState(props.view);

    let buttonStyle: CSSProperties = {
        width: "100px",
        marginLeft: "10px"
    }

    let buttonsStyle: CSSProperties = {
        textAlign: "right",
    }

    let changeView = (newView: View): void => {

        console.log(`Switching to view: {view}`)
        setView(newView);
        props.viewSwitcher(newView);
    }

    return (
        <div data-testid="journal-menu" className="container-fluid">
            <div className="row">
                <div className="col-lg-1">
                    <h1>{view}</h1>
                </div>
                <div className="col-lg-11" style={buttonsStyle}>
                    <input type="button" value="Log" onClick={() => changeView(View.LOG)} style={buttonStyle} />
                    <input type="button" value="Tasks" onClick={() => changeView(View.TASKS)} style={buttonStyle} />
                    <input type="button" value="Topics" onClick={() => changeView(View.TOPICS)} style={buttonStyle} />
                    <input type="button" value="Calendar" onClick={() => changeView(View.CALENDAR)} style={buttonStyle} />
                    <input type="button" value="Logout" onClick={() => props.logout()} style={buttonStyle} />
                </div>
            </div>
            <hr/>
        </div>
    );
}