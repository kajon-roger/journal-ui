export class Configuration {

    // private static URL: String = "http://localhost:3000";
    private static apiPort: string = "3000";
    public static token?: string;

    private constructor() {}

    static get apiUrl(): String {

        let uiUrl: URL = new URL(window.location.href);

        return `${uiUrl.protocol}//${uiUrl.hostname}:${this.apiPort}/api`;
    }
}