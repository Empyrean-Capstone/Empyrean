import React from 'react';
import {render} from "@testing-library/react"
import {Observation} from './observation'
import '@testing-library/jest-dom'

describe("<Observation />", () => {
    it("renders without crashing", () => {
        render(<Observation/>)
    })
})