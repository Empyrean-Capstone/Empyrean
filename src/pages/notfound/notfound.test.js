import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import {render, screen} from "@testing-library/react"
import {NotFound} from './notfound'
import '@testing-library/jest-dom'

describe("<NotFound />", () => {
    it("renders without crashing", () => {
        render(
        <BrowserRouter>
        <NotFound/>
        </BrowserRouter>)
    })

    it("correctly links to login page", () => {
        render(
        <BrowserRouter>
        <NotFound/>
        </BrowserRouter>)

        expect(screen.getByRole('link').href).toBe("http://localhost/")
    })

})