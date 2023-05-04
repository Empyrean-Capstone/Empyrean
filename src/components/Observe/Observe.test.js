import React from 'react';
import {render, screen} from "@testing-library/react"
import {Observe} from './Observe'
import '@testing-library/jest-dom'
import userEvent from "@testing-library/user-event"

describe("<Observe />", () => {
    it("renders without crashing", () => {
        render(<Observe/>)
    })

    it("renders start/stop buttons disabled", () => {
        render(<Observe/>)
        expect(screen.getByRole('button', {name: /Start/i})).toBeDisabled;
        expect(screen.getByRole('button', {name: /Stop/i})).toBeDisabled;
    })

    it("populates object input with dark when dark is selected", async () => {
        const user = userEvent.setup()
        render(<Observe/>)
        await user.click(screen.getByRole('button', {name: "dark"}))
        expect(screen.getAllByRole('textbox')[0].value).toBe("dark")
    })

    it("populates object input with dark when flat is selected", async () => {
        const user = userEvent.setup()
        render(<Observe/>)
        await user.click(screen.getByRole('button', {name: "flat"}))
        expect(screen.getAllByRole('textbox')[0].value).toBe("flat")
    })

    it("populates object input with dark when thar is selected", async () => {
        const user = userEvent.setup()
        render(<Observe/>)
        await user.click(screen.getByRole('button', {name: "thar"}))
        expect(screen.getAllByRole('textbox')[0].value).toBe("thar")
    })
})








// describe("<CalendarSearch />", () => {
//     it("renders without crashing", () => {
//         render(<CalendarSearch/>)
//     })

//     it("renders button enabled", () => {
//         render(<CalendarSearch/>)
//         expect(screen.getByRole('button', {name: /Submit/i})).toBeEnabled;
//     })

//     it("allows user to correctly change start date picker", async () => {
//         const user = userEvent.setup()
//         render(<CalendarSearch/>)

//         const startDate = screen.getAllByRole('textbox')[0]
//         user.type(startDate, '2000-01-31')
//         const chosenStartDate = screen.getAllByRole('button', {name: "Choose date"})[0]
//         fireEvent.click(chosenStartDate)
//         expect(chosenStartDate).toBeInTheDocument();
//     })

//     it("allows user to correctly change end date picker", async () => {
//         const user = userEvent.setup()
//         render(<CalendarSearch/>)

//         const endDate = screen.getAllByRole('textbox')[1]
//         user.type(endDate, '2000-02-01')
//         const chosenEndDate = screen.getAllByRole('button', {name: "Choose date"})[1]
//         fireEvent.click(chosenEndDate)
//         expect(chosenEndDate).toBeInTheDocument();
//     })
// })