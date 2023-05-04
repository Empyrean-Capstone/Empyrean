import React from 'react';
import {render} from "@testing-library/react"
import {LogsheetPage} from './logsheet'
import '@testing-library/jest-dom'

describe("<LogsheetPage />", () => {
    it("renders without crashing", () => {
        render(<LogsheetPage/>)
    })
})
