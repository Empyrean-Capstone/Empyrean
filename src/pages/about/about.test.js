import React from 'react';
import {render} from "@testing-library/react"
import {About} from './about'
import '@testing-library/jest-dom'

describe("<Layout />", () => {
    it("renders without crashing", () => {
        render(<About/>)
    })
})
