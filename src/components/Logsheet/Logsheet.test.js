import React from 'react';
import {render} from "@testing-library/react"
import {Logsheet} from './Logsheet'
import '@testing-library/jest-dom'

describe("<Logsheet />", () => {
    it("renders without crashing", () => {
        render(<Logsheet/>)
    })
})