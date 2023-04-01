import React, { useLayoutEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';

import './App.css';
import { SocketContext, socket } from './context/socket';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact'
import { Layout } from './components/Layout';
import { Login } from './pages/login'
import { LogsheetPage } from './pages/logsheet'
import { Observation } from './pages/observation'
import { Register } from './pages/registration'



// https://stackoverflow.com/a/71414958
const AuthWrapper = () => {
	const location = useLocation();
	const [auth, setAuth] = useState();
	const [isLoading, setLoading] = useState(true);

	useLayoutEffect(() => {
		let cancelToken;

		const authCheck = async () => {
			setLoading(true);

			try {
				const auth = await axios.post(
					`http://localhost:5000/auth_login/validate/`,
					null,
					{
						withCredentials: true
					}
				)

				setAuth(auth.status === 200);
			}
			catch (error) {
				console.log(error)
				setAuth(false);
			}
			finally {
				setLoading(false);
			}
		}

		authCheck();

		return () => clearTimeout(cancelToken);
	}, [location.pathname]);

	if (isLoading) {
		return (
			<Backdrop invisible open={isLoading}>
				<Fade
					in={isLoading}
					style={{
						transitionDelay: isLoading ? '800ms' : '0ms',
					}}
					unmountOnExit
				>
					<CircularProgress color="primary" />
				</Fade>
			</Backdrop>
		)
	}

	return auth ? <Outlet /> : <Navigate to="/" replace />; // or auth property if object
}


function App() {

	return (
		<SocketContext.Provider value={socket}>
			<BrowserRouter>
				<Routes>
					<Route index element={<Login />} />

					<Route path='/' element={<Layout />} >
						<Route path="about" element={<About />} />
						<Route path="contact" element={<Contact />} />

						<Route element={<AuthWrapper />}>
							<Route path="observation" element={<Observation />} />
							<Route path="logsheet" element={<LogsheetPage />} />
							<Route path="registration" element={<Register />} />
						</Route>

					</Route>
				</Routes>
			</BrowserRouter>
		</SocketContext.Provider>
	);
}

export default App;
