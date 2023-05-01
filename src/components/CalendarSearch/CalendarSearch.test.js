import React from 'react';
import userEvent from "@testing-library/user-event"
import fireEvent from "@testing-library/user-event"

import {render, screen} from "@testing-library/react"
import {CalendarSearch} from './CalendarSearch'
import '@testing-library/jest-dom'

describe("<CalendarSearch />", () => {
    it("renders without crashing", () => {
        render(<CalendarSearch/>)
    })

    it("renders button enabled", () => {
        render(<CalendarSearch/>)
        expect(screen.getByRole('button', {name: /Submit/i})).toBeEnabled;
    })

    it("allows user to correctly change start date picker", async () => {
        const user = userEvent.setup()
        render(<CalendarSearch/>)

        const startDate = screen.getAllByRole('textbox')[0]
        user.type(startDate, '2000-01-31')
        const chosenStartDate = screen.getAllByRole('button', {name: "Choose date"})[0]
        fireEvent.click(chosenStartDate)
        expect(chosenStartDate).toBeInTheDocument();
    })

    it("allows user to correctly change end date picker", async () => {
        const user = userEvent.setup()
        render(<CalendarSearch/>)

        const endDate = screen.getAllByRole('textbox')[1]
        user.type(endDate, '2000-02-01')
        const chosenEndDate = screen.getAllByRole('button', {name: "Choose date"})[1]
        fireEvent.click(chosenEndDate)
        expect(chosenEndDate).toBeInTheDocument();
    })
})
