import React from 'react';
import './App.css';
import { useNavigate } from "react-router-dom";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { About } from './pages/about/about';
import {Contact} from './pages/contact/contact'
import {Observation} from './pages/observation'
import {LogsheetPage} from './pages/logsheet'
import {AuthContext, auth } from './context/auth';
import {SocketContext, socket} from './context/socket';
import { Login } from './pages/login'

function App() {

	return (
		<SocketContext.Provider value={socket}>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Layout/>}>
						<Route index element={<Observation/>} onEnter={requireAuth}/>
						<Route path="about" element={<About/>}/>
						<Route path="contact" element={<Contact/>}/>
						<Route path="logsheet" element={<LogsheetPage/>} onEnter={requireAuth}/>
					</Route>
				</Routes>
			</BrowserRouter>
		</SocketContext.Provider>
	);
}

function requireAuth() {
  const navigate = useNavigate();
  const auth_context = useContext(AuthContext); //Hook into context

  if( !auth_context ) {
	navigate("/login");
  }
  
  navigate("/observation");
}

export default App;
