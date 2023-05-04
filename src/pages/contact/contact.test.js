import React from 'react';
import {render, screen} from "@testing-library/react"
import {Contact} from './contact'
import '@testing-library/jest-dom'

describe("<Contact />", () => {
    it("renders without crashing", () => {
        render(<Contact/>)
    })

    it("correctly links to github repository", () => {
        render(<Contact/>)
        expect(screen.getByRole('link').href).toBe("https://github.com/Empyrean-Capstone/Empyrean/issues")
    })
})
