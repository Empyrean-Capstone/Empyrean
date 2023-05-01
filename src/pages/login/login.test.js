import React from 'react';
import {render} from "@testing-library/react"
import {Login} from './login'
import '@testing-library/jest-dom'

const mockedUseNavigate = jest.fn();
const mockedUseLocation = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: () => mockedUseLocation,
}));

describe("<Layout />", () => {
    it("renders without crashing", () => {
        render(<Login/>)
    })
})
