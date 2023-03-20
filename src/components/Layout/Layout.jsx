import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Link, Outlet, useNavigate } from 'react-router-dom'

import './style.css'

function Layout() {
	const navigate = useNavigate();

	let [username, setUsername] = useState("")

	useEffect(() => {
		(async () => {
			const res = await axios.get(
				`http://localhost:5000/auth_login/`,
				{
					withCredentials: true
				})

			if (res.status === 200) setUsername(res.data)
				else console.error(res.status)
		})();

		return () => {
			// this now gets called when the component unmounts
		};
	}, [setUsername]);

	return (
		<>
			<div id='layout-grid'>
				<div id='left-toolbar'>
					<div id='profile-bar'>
						<ul id='main-links'>
							<li>{username}</li>

							<li className='main-page-link'>
								<Link
									className="main-link"
									onClick={() => {
										const logout = async () => {
											try {
												let logout_res = await axios.post(
													`http://localhost:5000/auth_login/logout/`,
													null,
													{
														withCredentials: true
													})

												if (logout_res.status === 200) {
													navigate("/");
												}
											} catch (err) {
												console.error(err);
											}
										};

										logout()
									}}
								>Logout</Link>
							</li>

							<li className='main-page-link'>
								<Link className="main-link" to="/registration">Register new user</Link>
							</li>
						</ul>

					</div>
					<p id='main-page-title'>MAIN PAGES</p>
					<ul id='main-links'>
						<li className='main-page-link'><Link className="main-link" to="/observation">Observe</Link></li>
						<li className='main-page-link'><Link className="main-link" to="/logsheet">Logsheets</Link></li>
					</ul>
				</div>
				<div id='main-content'>
					<div id='page-content'><Outlet /></div>
					<div>
						<hr id="footer-line-break" />
						<footer id='footer-section'>
							<p id="left-info">
								Designed by students from NAU's CEIAS capstone program
							</p>
							<span>
								V0.0.2
							</span>
							<ul id="right-info">
								<li className="footer-nav-link"><Link to="/about">About</Link></li>
								<li className="footer-nav-link"><Link to="/contact">Contact</Link></li>
							</ul>
						</footer>
					</div>
				</div>
			</div>
		</>
	)
}

export { Layout }
