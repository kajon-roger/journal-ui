import React, { useState, useEffect, CSSProperties } from "react";
import Moment from "moment";

import { DayModel } from "../models/day.model";
import { LogbookAPIPromise } from "../modules/LogbookAPIPromise";
import { focus } from "../utils/focus";
import { ComponentType, ID } from "../utils/ID";

interface Props {

    initialDayModels?: DayModel[],
}

export function LogExplorer(props: Props) {

    let [ dayModels, setDayModels ] = useState(props.initialDayModels);

    useEffect(() => {
        getDays();
    },
    []); // Deps is an empty array so this function is only called when the component is first loaded (like componentDidMount)

    let getDays = (): void => {

        LogbookAPIPromise.getDays(true, false).then(days => {
            setDayModels(days);
        })
    }

    let focusOnTop = (): void => {

        focus("logexplorer_top");
        focus("log_top");
    }

    let focusOnBottom = (): void => {

        focus("logexplorer_bottom");
        focus("log_bottom");
    }

    let navigatorStyle: CSSProperties = {
        color: "red",
    }

    return (
        <div>
            <p key="logexplorer_top" id="logexplorer_top" style={navigatorStyle} onClick={() => focusOnBottom()}>bottom</p>
            {
                dayModels
                ?
                dayModels.map(dayModel => {
                    return (
                        <div>
                            <p className='mt-2 mb-0' key={`log-explorer-id-${dayModel.id}`} onClick={() => focus(ID.createId(dayModel.id, ComponentType.LOG_DAY))}>
                                {Moment(dayModel.date).format('dddd DD MMM yyyy')}
                            </p>
                            {
                                dayModel.entries
                                ?
                                dayModel.entries.map((entry, index) => <div className={index === 0 ? 'mt-1 mb-0' : 'mt-0 mb-0'} style={{marginLeft: "20px"}} onClick={() => focus(ID.createId(entry.id, ComponentType.LOG_ENTRY))}>{entry.title}</div>)
                                :
                                ""
                            }
                        </div>
                    )
                })
                :
                ""
            }
            <p key="logexplorer_bottom" id="logexplorer_bottom" style={navigatorStyle} onClick={() => focusOnTop()}>top</p>
        </div>
    );
}