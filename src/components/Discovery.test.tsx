import { ComponentToShow, toComponentsToShow } from "./Discovery";

it("Correctly converts strings to ComponentToShow enum values", () => {

    let names: string = "topic";

    let componentsToShow: ComponentToShow[] = toComponentsToShow(names);
    
    let includes = componentsToShow.includes(ComponentToShow.TOPIC);
    expect(includes).toBeTruthy();
    expect(componentsToShow[0]).toBe(ComponentToShow.TOPIC);
});