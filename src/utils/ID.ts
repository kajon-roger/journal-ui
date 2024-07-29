export enum ComponentType {
    LOG_DAY = "day",
    LOG_ENTRY = "entry",
    LOG_EXPLORER = "log_explorer",
    LOGIN = "login",
    TASK = "task",
    TASK_EXPLORER = "task_explorer",
    TOPIC = "topic",
    TOPIC_EXPLORER = "topic_explorer",
    APPOINTMENT = "appointment",
}

export class ID {

    public static createId(itemId: number|undefined, componentType: ComponentType, ...suffixes: string[]): string {

        let prefix = `${componentType}`;

        prefix += itemId ? `_${itemId}` : `_New`;

        return this.addSuffixes(prefix, ...suffixes);
    }

    private static addSuffixes(idPrefix: string, ...idSuffixes: string[]): string {

        let retval = idPrefix;
        if (idSuffixes) {

            retval = idSuffixes.reduce(
                (previousValue, currentValue) => `${previousValue}_${currentValue}`,
                idPrefix);
        }
        return retval;
    }

    /**
     * Creates a (hopefully) unique randon string that can be used to identify unsaved entities (ones that do not yet have an actual id field).
     * @param length the number of characters you want in your randon id
     * @returns 
     */
    public static makeRandomStringId = (length: number): string => {

        let result: string = '';
        const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength: number = characters.length;
        let counter: number = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          ++counter;
        }
        return result;
    }
}
