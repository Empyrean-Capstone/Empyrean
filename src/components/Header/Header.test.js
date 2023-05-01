import React from 'react';
import {render} from "@testing-library/react"
import {Header} from './Header'
import '@testing-library/jest-dom'

describe("<Header />", () => {
    it("renders without crashing", () => {
        render(<Header/>)
    })
})
