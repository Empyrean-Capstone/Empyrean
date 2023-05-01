import React from 'react';
import {render} from "@testing-library/react"
import {Contact} from './contact'
import '@testing-library/jest-dom'

describe("<Layout />", () => {
    it("renders without crashing", () => {
        render(<Contact/>)
    })
})
