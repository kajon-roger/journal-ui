export function focus(elementId: string) {
    document.getElementById(elementId)?.scrollIntoView();
}