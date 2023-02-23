import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { About } from './pages/about/about';
import {Contact} from './pages/contact/contact'
import {Observation} from './pages/observation'
import {LogsheetPage} from './pages/logsheet'


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Layout/>}>
					<Route index element={<Observation/>}/>
					<Route path="about" element={<About/>}/>
					<Route path="contact" element={<Contact/>}/>
					<Route path="logsheet" element={<LogsheetPage/>}/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
