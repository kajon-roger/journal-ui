import React from "react";import { LinePart, LinePartType, Link, LinkTarget, MarkupParser } from "./MarkupParser";
import { ComponentType, ID } from "./ID";
import { IViewSwitcher, View } from "../modules/IViewSwitcher";

export class TextUtils {

    private constructor() {}

    public static textToLines(text: string|undefined, componentType: ComponentType, itemId: number|undefined, viewSwitcher?: IViewSwitcher): React.ReactNode {

        let lineArray = this.textToLineArray(text);

        return lineArray.map((line, index) => {
            return this.createLine(line, index, componentType, itemId, viewSwitcher);
        })
    }

    private static textToLineArray(text: string | undefined): string[] {
        let retval: string[] = [];
        if (text) {
            retval = text.split('\n');
        }
        return retval;
    }

    private static createLine(line: string, index: number, componentType: ComponentType, itemId: number|undefined, viewSwitcher?: IViewSwitcher): React.ReactNode {

        let lineParts = MarkupParser.parseLine(line);

        return (
            line.length === 0
            ?
            <br key={this.createLineId(index, componentType, itemId)}/>
            :
            <p className="mt-0 mb-0" key={this.createLineId(index, componentType, itemId)}>
            {
                lineParts.map((linePart) => this.linePartToText(linePart, viewSwitcher))
            }
            </p>
        );
    }

    private static createLineId(line: number, componentType: ComponentType, itemId: number|undefined): string {

        return ID.createId(itemId, componentType);
    }

    private static linePartToText(linePart: LinePart, viewSwitcher?: IViewSwitcher): React.ReactNode {

        console.log(`In linePartToText`);
        switch (linePart.linePartType) {
            case LinePartType.TEXT:
                return linePart.lineText;

            case LinePartType.LINK:
                if (viewSwitcher) {
                    switch (linePart.link?.linkTarget) {
                        case LinkTarget.LOGBOOK_ENTRY:
                            return <a key={this.createLinkId(linePart.link)} onClick={(e) => viewSwitcher(View.LOG, linePart.link?.linkTargetId)}><i style={{color: "blue"}}>{linePart.link.linkText}</i></a>;
                        case LinkTarget.TASK:
                            return <a key={this.createLinkId(linePart.link)} onClick={(e) => viewSwitcher(View.TASKS, linePart.link?.linkTargetId)}><i style={{color: "blue"}}>{linePart.link.linkText}</i></a>;
                        case LinkTarget.TOPIC:
                            console.log(`In linePartToText case TOPIC with id; ${linePart.link?.linkTargetId}`);
                            return <a key={this.createLinkId(linePart.link)} onClick={(e) => viewSwitcher(View.TOPICS, linePart.link?.linkTargetId)}><i style={{color: "blue"}}>{linePart.link.linkText}</i></a>;
                        default:
                            throw new Error(`Unexpected link target: ${linePart.link?.linkTarget}`);
    
                    }
                } else {
                    return <span>{linePart.link?.linkText}</span>;
                }
                break;
            default:
                throw new Error(`Unexpected line part type: ${linePart.linePartType}`);
        }
    }

    private static createLinkId(link: Link|undefined): string {

        if (link === undefined) {
            return "link_undefined";
        } else {
            return `link_${link.linkTarget.toString()}_${link.linkTargetId}`; 
        }
    }
}