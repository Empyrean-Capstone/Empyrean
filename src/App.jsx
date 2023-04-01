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
import { ManageUsers } from './pages/user_management'
import { NotFound } from './pages/notfound'
import { Observation } from './pages/observation'


// https://stackoverflow.com/a/71414958
const AuthWrapper = ({ props }) => {
	const location = useLocation();

	const [auth, setAuth] = useState();
	const [isLoading, setLoading] = useState(true);

	useLayoutEffect(() => {
		let cancelToken;

		const authCheck = async (needsAdmin) => {
			setLoading(true);

			try {
				const auth = await axios.post(
					`http://localhost:5000/auth_login/validate/`,
					[needsAdmin],
					{
						withCredentials: true
					}
				)

				setAuth(auth.status === 200)
			}
			catch (error) {
				console.log(error)
				setAuth(false);
			}
			finally {
				setLoading(false);
			}
		}

		authCheck(props.needsAdmin);

		return () => clearTimeout(cancelToken);
	}, [props, location.pathname]);

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

						<Route element={<AuthWrapper props={{ needsAdmin: "False" }} />}>
							<Route path="observation" element={<Observation />} />
							<Route path="logsheet" element={<LogsheetPage />} />
						</Route>

						<Route element={<AuthWrapper props={{ needsAdmin: "True" }} />}>
							<Route path="management" element={<ManageUsers />} />
						</Route>

					</Route>

					<Route path='*' element={<NotFound />} />

				</Routes>
			</BrowserRouter>
		</SocketContext.Provider >
	);
}

export default App;
