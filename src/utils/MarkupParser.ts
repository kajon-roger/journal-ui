
export enum LinePartType {
    TEXT,
    LINK
}

export enum LinkTarget {
    TOPIC,
    TASK,
    LOGBOOK_ENTRY
}

export interface Link {
    linkTarget: LinkTarget,
    linkTargetId: number,
    linkText: string
}

export interface LinePart {
    linePartType: LinePartType,
    lineText?: string,
    link?: Link,
    consumedCharacters: number
}

export class MarkupParser {

    /*
     * We can include hyperlinks from one part of the application to another, e.g. a logbook entry can 
     * contain a link to a topic.
     * The syntax of a link that we store in our text is:
     * @@<link target>|<link target id>|<link text>@@
     * <link target> = TOPIC|TASK|LOGBOOK_ENTRY
     * <link target id> = a number, the id of the topic, task, or logbook entry to which the link will direct the user
     * <link text> = a string, this is what the user will see as the hyperlink text in the topic/task/logbook_entry
     */

    public static parseLine(line:string): LinePart[] {

        let retval: LinePart[] = [];

        let parsing: boolean = true;
        let count = 0;

        while (parsing && count < 10) {

            ++count;
            let linePart = this.parseLinePart(line);
            retval.push(linePart);
            line = line.substring(linePart.consumedCharacters);
            if (line.length === 0) {
                parsing = false;
            }
        }

        return retval;
    }

    public static containsLinkMarkup(line: string): boolean {
        return (
            null !== ( line.match(/@@TASK\|[0-9]+\|[^\|,@]+@@/) ) // Regex to match @@TASK|<id number>|<link text>@@
            ||
            null !== ( line.match(/@@TOPIC\|[0-9]+\|[^\|,@]+@@/) ) // Regex to match @@TOPIC|<id number>|<link text>@@
            ||
            null !== ( line.match(/@@LOGBOOK_ENTRY\|[0-9]+\|[^\|,@]+@@/) ) // Regex to match @@LOGBOOK_ENTRY|<id number>|<link text>@@
        )
    }

    public static isLinkMarkup(linkCandidate: string): boolean {
        return (
            null !== ( linkCandidate.match(/^@@TASK\|[0-9]+\|[^\|,@]+@@/) ) // Regex to match @@TASK|<id number>|<link text>@@ at start of string
            ||
            null !== ( linkCandidate.match(/^@@TOPIC\|[0-9]+\|[^\|,@]+@@/) ) // Regex to match @@TOPIC|<id number>|<link text>@@ at start of string
            ||
            null !== ( linkCandidate.match(/^@@LOGBOOK_ENTRY\|[0-9]+\|[^\|,@]+@@/) ) // Regex to match @@LOGBOOK_ENTRY|<id number>|<link text>@@ at start of string
        )
    }

    public static linkMarkupToLinkParts(markup: string): string[]|undefined {

        let retval;

        let parts = markup.split("@@");

        if (parts.length > 1) {

            let parts2 = parts[1].split("|");
            if (parts2.length === 3) {
                retval = parts2;
            }
        }

        return retval;
    }

    public static linkPartsToLink(parts: string[]): Link|undefined {

        let retval: Link| undefined = undefined;

        let linkTarget: LinkTarget|undefined;
        let linkTargetId: number;
        let linkText: string;

        if (parts.length === 3) {
            linkTarget = this.toLinkTarget(parts[0]);
            linkTargetId = Number.parseInt(parts[1]);
            linkText = parts[2];

            if (linkTarget !== undefined) {

                retval = {
                    linkTarget,
                    linkTargetId,
                    linkText
                }
            }
        }

        return retval;
    }

    private static toLinkTarget(linkTarget: string): LinkTarget|undefined {

        let retval: LinkTarget|undefined = undefined;

        if (linkTarget === "TOPIC") {
            retval = LinkTarget.TOPIC;
        } else if (linkTarget === "TASK") {
            retval = LinkTarget.TASK;
        } else if (linkTarget === "LOGBOOK_ENTRY") {
            retval = LinkTarget.LOGBOOK_ENTRY;
        }

        return retval;
    }

    private static linkToConsumedCharacters(link: Link): number {

        let retval = 0;

        retval += "@@".length;

        switch (link.linkTarget) {
            case LinkTarget.LOGBOOK_ENTRY:
                retval += "LOGBOOK_ENTRY".length;
                break;
            case LinkTarget.TASK:
                retval += "TASK".length;
                break;
            case LinkTarget.TOPIC:
                retval += "TOPIC".length;
                break;
        }

        retval += "|".length;

        retval += ("" + link.linkTargetId).length;

        retval += "|".length;

        retval += link.linkText.length;

        retval += "@@".length;

        return retval;
    }

    public static parseLinePart(line: string): LinePart {

        let linePartType: LinePartType;
        let link: Link|undefined;
        let consumedCharacters: number = 0;
        let lineText: string|undefined;

        if (!this.containsLinkMarkup(line)) {

            linePartType = LinePartType.TEXT;
            lineText = line;
            consumedCharacters = line.length;
        } else if(this.isLinkMarkup(line)) {

            linePartType = LinePartType.LINK;

            let linkParts = this.linkMarkupToLinkParts(line);
            if (linkParts) {
                link = this.linkPartsToLink(linkParts);

                if (link) {
                    consumedCharacters = this.linkToConsumedCharacters(link);
                }
            }
        } else {
            linePartType = LinePartType.TEXT;
            lineText = line.indexOf("@@") < 0 ? line : line.substring(0, line.indexOf("@@"));
            consumedCharacters = lineText.length;
        }

        return {
            linePartType: linePartType,
            lineText,
            link,
            consumedCharacters
        }
    }
}
