import { render, fireEvent, screen, queryByText } from "@testing-library/react";

import { DayModel } from "../models/day.model";
import { AppointmentModel } from "../models/appointment.model";
import { CalendarDay } from "./CalendarDay";

describe("Testing CalendarDay", () => {

    it("Displays the date", () => {

        let appointment1 = new AppointmentModel("Appointment 1", 1);
        let appointment2 = new AppointmentModel("Appointment 2", 1);
        let appointment3 = new AppointmentModel("Appointment 3", 1);
        let day: DayModel = new DayModel(new Date(2024, 5, 1), undefined, [appointment1, appointment2, appointment3], 1);

        render(<CalendarDay initialDayModel={day}/>)

        expect(screen.getByText("1st")).toBeInTheDocument();
        expect(screen.getByText("Appointment 1")).toBeInTheDocument();
        expect(screen.getByText("Appointment 2")).toBeInTheDocument();
        expect(screen.getByText("Appointment 3")).toBeInTheDocument();
    });
});
