import React from 'react';
import {render} from "@testing-library/react"
import {Status} from './Status'
import '@testing-library/jest-dom'

describe("<Status />", () => {
    it("renders without crashing", () => {
        render(<Status/>)
    })
})