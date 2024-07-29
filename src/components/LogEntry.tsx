import React, { useState } from "react";

import { LogbookAPIPromise } from "../modules/LogbookAPIPromise";
import { EntryModel } from "../models/entry.model";
import { ComponentType, ID } from "../utils/ID";
import { clone } from "../utils/clone";
import { TextUtils } from "../utils/text-utils";

interface Props {

    initialEntryModel: EntryModel,
    entryChangedCallback?: EntryChangedCallback,
}

export interface EntryChangedCallback {
    (entryModel: EntryModel): void
}

export function LogEntry(props: Props) {

    let [ entryModel, setEntryModel ] = useState(props.initialEntryModel);
    let [ editMode, setEditMode ] = useState(props.initialEntryModel.new_entry);


    let createTitleEditId = (): string => {
        return ID.createId(entryModel?.id, ComponentType.LOG_ENTRY, "title");
    }

    let createTextEditId = (): string => {
        return ID.createId(entryModel?.id, ComponentType.LOG_ENTRY, "text");
    }

    function edit(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {

        e.stopPropagation();
        setEditMode(true);
        let entry = clone(entryModel);
        entry.new_entry = false;
        setEntryModel(entry);
    }

    function save(e: React.MouseEvent<HTMLInputElement, MouseEvent>): void {

        e.stopPropagation();
        setEditMode(false);
        let editedEntryModel: EntryModel = new EntryModel(getTitle(), entryModel.day_id, getText(), entryModel.id);
        LogbookAPIPromise.saveEntry(editedEntryModel)
        .then(savedEntry => {

            setEntryModel(savedEntry);
            if (props.entryChangedCallback) {
                props.entryChangedCallback(savedEntry);
            }
        });
    }

    let getTitle = (): string => {

        return (document.getElementById(createTitleEditId()) as HTMLInputElement).value;
    }

    let getText = (): string => {

        return (document.getElementById(createTextEditId()) as HTMLInputElement).value;
    }

    function cancel(e: React.MouseEvent<HTMLInputElement, MouseEvent>): void {

        e.stopPropagation();
        setEditMode(false);
        let entry = clone(entryModel);
        entry.new_entry = false;
        setEntryModel(entry);
    }

    return (
        <div id={ID.createId(entryModel.id, ComponentType.LOG_ENTRY)}>
            {
                editMode
                ?
                <div>
                    Title: <input type="text" id={createTitleEditId()} defaultValue={entryModel ? (entryModel.new_entry ? '' : entryModel.title) : ''}/>
                    <br/>
                    Text: <textarea id={createTextEditId()} style={{ width: "800px", "height": "400px"}} defaultValue={ entryModel ? (entryModel.new_entry? '' : entryModel.text) : ''} onContextMenu={(e) => { e.preventDefault()}} />
                    <br/>
                    <input type="button" value="Save" onClick={ (e) => save(e) }/> <input type="button" value="Cancel" onClick={ (e) => cancel(e) }/>
                </div>
                :
                <div onClick={ e => edit(e) }>
                    <h2>{entryModel.title}</h2>
                    { TextUtils.textToLines(entryModel.text, ComponentType.LOG_ENTRY, entryModel.id) }
                </div>
            }
        </div>
    );
}