import React from 'react';
import {render} from "@testing-library/react"
import {GridEmptyOverlay} from './DataGrid'
import '@testing-library/jest-dom'

describe("<GridEmptyOverlay />", () => {
    it("renders an empty overlay without crashing", () => {
        render(<GridEmptyOverlay/>)
    })
})