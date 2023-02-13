import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { About } from './pages/about/about';
import {Contact} from './pages/contact/contact'
import {Observation} from './pages/observation'
import {LogsheetPage} from './pages/logsheet'
import {SocketContext, socket} from './context/socket';
import { Login } from './pages/login'

function App() {

	return (
		<SocketContext.Provider value={socket}>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Layout/>}>
						<Route index element={<Login/>}/>
						<Route path="about" element={<About/>}/>
						<Route path="contact" element={<Contact/>}/>
						<Route path="logsheet" element={<LogsheetPage/>}/>
						<Route path="observation" element={<Observation/>}/>
					</Route>
				</Routes>
			</BrowserRouter>
		</SocketContext.Provider>
	);
}

export default App;
