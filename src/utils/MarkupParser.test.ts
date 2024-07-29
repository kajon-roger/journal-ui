import { LinePartType, LinkTarget, MarkupParser } from "./MarkupParser";

// NOTE ON TESTING
// To run these tests:
// You must have installed:
// > npm install --save-dev jest
// > npm install --save-dev ts-jest
// You can then run jest in watch mode (where it keeps on monitoring your changes and re-testing) using:
// > npx jest --watchAll

test("Empty line return array with one LinePart", () => {
    let line = "";
    let lineParts = MarkupParser.parseLine(line);

    expect(lineParts.length).toBe(1);
});

test("Empty line return LinePart.linePartType as TEXT", () => {
    let line = "";
    let lineParts = MarkupParser.parseLine(line);

    expect(lineParts[0].linePartType).toBe(LinePartType.TEXT);
});

test("Empty line return LinePart.lineText as \"\"", () => {
    let line = "";
    let lineParts = MarkupParser.parseLine(line);

    expect(lineParts[0].lineText).toBe("");
});

test("Line containing just text should return array with one linepart", () => {
    let line = "Just a load of text";
    let lineParts = MarkupParser.parseLine(line);

    expect(lineParts.length).toBe(1);
});

test("Line containing just text should return LinePart.linePartType as TEXT", () => {
    let line = "Just a load of text";
    let lineParts = MarkupParser.parseLine(line);

    expect(lineParts[0].linePartType).toBe(LinePartType.TEXT);
});

test("Line containing just text should return LinePart.lineText as the passed in line", () => {
    let line = "Just a load of text";
    let lineParts = MarkupParser.parseLine(line);

    expect(lineParts[0].lineText).toBe(line);
});

test("Line containing just a topic link should return an array with a single LinePart", () => {
    let line = "@@TOPIC|25|Link Text@@";

    let lineParts = MarkupParser.parseLine(line);
    expect(lineParts.length).toBe(1);
});

test("Line containing just a topic link should return LinePart.linePartType as LINK", () => {
    let line = "@@TOPIC|25|Link Text@@";
    let lineParts = MarkupParser.parseLine(line);

    expect(lineParts[0].linePartType).toBe(LinePartType.LINK);
});

test("Line containing a topic link should return LinePart with link field populated", () => {
    let line = "@@TOPIC|25|Link Text@@";
    let lineParts = MarkupParser.parseLine(line);

    expect(lineParts[0].link?.linkTarget).toBe(LinkTarget.TOPIC);
    expect(lineParts[0].link?.linkTargetId).toBe(25);
    expect(lineParts[0].link?.linkText).toBe("Link Text");
});

test("Line containing just a task link should return an array with a single LinePart", () => {
    let line = "@@TASK|200|Link Text@@";
    let lineParts = MarkupParser.parseLine(line);

    expect(lineParts.length).toBe(1);
});

test("Line containing just a task link should return LinePart.linePartType as LINK", () => {
    let line = "@@TASK|200|Link Text@@";
    let lineParts = MarkupParser.parseLine(line);

    expect(lineParts[0].linePartType).toBe(LinePartType.LINK);
});

test("Line containing a task link should return LinePart with link field populated", () => {
    let line = "@@TASK|200|Link Text@@";
    let lineParts = MarkupParser.parseLine(line);

    expect(lineParts[0].link?.linkTarget).toBe(LinkTarget.TASK);
    expect(lineParts[0].link?.linkTargetId).toBe(200);
    expect(lineParts[0].link?.linkText).toBe("Link Text");
});

test("Line containing just a tlogbook entry link should return an array with a single LinePart", () => {
    let line = "@@LOGBOOK_ENTRY|1000|Link Text@@";
    let lineParts = MarkupParser.parseLine(line);

    expect(lineParts.length).toBe(1);
});

test("Line containing just a task link should return LinePart.linePartType as LINK", () => {
    let line = "@@LOGBOOK_ENTRY|1000|Link Text@@";
    let lineParts = MarkupParser.parseLine(line);

    expect(lineParts[0].linePartType).toBe(LinePartType.LINK);
});

test("Line containing a task link should return LinePart with link field populated", () => {
    let line = "@@LOGBOOK_ENTRY|1000|Link Text@@";
    let lineParts = MarkupParser.parseLine(line);

    expect(lineParts[0].link?.linkTarget).toBe(LinkTarget.LOGBOOK_ENTRY);
    expect(lineParts[0].link?.linkTargetId).toBe(1000);
    expect(lineParts[0].link?.linkText).toBe("Link Text");
});

test("Line containing text + link + text should return 3 parts", () => {

    let line = "Here is the first part of the text @@TOPIC|25|Link Text@@ here is the second part of the text.";
    let lineParts = MarkupParser.parseLine(line);

    expect(lineParts.length).toBe(3);
});

test("Line containing text + link + link + text should return 4 parts", () => {

    let line = "Here is the first part of the text @@TASK|47|Link Text@@@@TOPIC|25|Link Text@@ here is the second part of the text.";
    let lineParts = MarkupParser.parseLine(line);

    expect(lineParts.length).toBe(4);
    expect(lineParts[0].linePartType).toBe(LinePartType.TEXT);
    expect(lineParts[1].linePartType).toBe(LinePartType.LINK);
    expect(lineParts[2].linePartType).toBe(LinePartType.LINK);
    expect(lineParts[3].linePartType).toBe(LinePartType.TEXT);
});
