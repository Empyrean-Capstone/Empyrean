import React from 'react';
import { BrowserRouter } from 'react-router-dom'

import {render, screen} from "@testing-library/react"
import {Layout} from './Layout'
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
        render(
        <BrowserRouter>
        <Layout/>
        </BrowserRouter>)
    })

    it("enables request observations button", () => {
        render(
        <BrowserRouter>
        <Layout/>
        </BrowserRouter>)

        expect(screen.getByRole('button', {name: /Request Observations/i})).toBeEnabled
    })

    it("enables explore logs button", () => {
        render(
        <BrowserRouter>
        <Layout/>
        </BrowserRouter>)

        expect(screen.getByRole('button', {name: /Explore Logs/i})).toBeEnabled
    })

    it("enables log out button", () => {
        render(
        <BrowserRouter>
        <Layout/>
        </BrowserRouter>)

        expect(screen.getByRole('button', {name: /Log Out/i})).toBeEnabled
    })

    it("enables log out button", () => {
        render(
        <BrowserRouter>
        <Layout/>
        </BrowserRouter>)

        expect(screen.getByRole('link', {name: /About/i}).href).toBe("http://localhost/about")
    })

    it("enables log out button", () => {
        render(
        <BrowserRouter>
        <Layout/>
        </BrowserRouter>)

        expect(screen.getByRole('link', {name: /Contact/i}).href).toBe("http://localhost/contact")
    })
})
