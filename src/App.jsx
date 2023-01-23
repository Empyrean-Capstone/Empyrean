import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/home';
import { About } from './pages/about/about';
import {Contact} from './pages/contact/contact'


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Layout/>}>
					<Route index element={<HomePage/>}/>
					<Route path="about" element={<About/>}/>
					<Route path="contact" element={<Contact/>}/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
