export class MonthUtils {

    /**
     * 
     * @param year the year number (2024 e.g.)
     * @param month the month index - January = 0, December = 11
     */

    public static createMonthWeeks(year: number, month: number): (Date|undefined)[][] {

        let firstDayOfMonth = new Date(year, month, 1);
        let lastDayOfMonth = new Date(year, month + 1, 0).getDate();

        let offset = firstDayOfMonth.getDay();
        let dayOfMonth = 1;
        let firstWeek: (Date|undefined)[] = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];
        for (let index:number = offset; index < 7; index++) {
            firstWeek[index] = new Date(year, month, dayOfMonth++);
        }
        let retval: (Date|undefined)[][] = [firstWeek];
        retval.push(this.createWeekDates(year, month, dayOfMonth, lastDayOfMonth));
        retval.push(this.createWeekDates(year, month, dayOfMonth + 7, lastDayOfMonth));
        retval.push(this.createWeekDates(year, month, dayOfMonth + 14, lastDayOfMonth));
        if (dayOfMonth + 21 <= lastDayOfMonth) {
            retval.push(this.createWeekDates(year, month, dayOfMonth + 21, lastDayOfMonth));
        }
        if (dayOfMonth + 28 <= lastDayOfMonth) {
            retval.push(this.createWeekDates(year, month, dayOfMonth + 28, lastDayOfMonth));
        }

        return retval;
    }

    private static createWeekDates(year: number, month: number, dayOfMonth: number, lastDayOfMonth: number): (Date|undefined)[] {

        let week: (Date|undefined)[] = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];

        for (let index: number = 0; index < 7; index++) {
            week[index] = dayOfMonth <= lastDayOfMonth ? new Date(year, month,  dayOfMonth++) : undefined;
        }

        return week;
    }
}