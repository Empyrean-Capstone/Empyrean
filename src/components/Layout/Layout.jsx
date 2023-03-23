import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Link, Outlet, useNavigate } from 'react-router-dom'

import './style.css'

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// icons
import AssignmentIcon from '@mui/icons-material/Assignment';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import Home from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';


function Footer() {
	return (
		<>
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
		</>
	)
}


function CreateNavItems({ items }) {
	let linkList = items.map((linkObj) => {
		const { text, icon, onClick } = linkObj;

		return (
			<ListItem key={text} onClick={onClick}>
				<ListItemButton dense sx={{ py: 0, minHeight: 27, color: 'rgba(255,255,255,.8)' }}>
					<ListItemIcon sx={{ color: 'inherit' }}>
						{icon}
					</ListItemIcon>

					<ListItemText
						primary={text}
						primaryTypographyProps={{
							align: "left",
							fontSize: 12,
							fontWeight: 'medium',
						}}
					/>

				</ListItemButton>
			</ListItem >
		)
	})

	return linkList
}


const CustomNav = styled(List)({
	'& .MuiListItemButton-root': {
		paddingLeft: 24,
		paddingRight: 24,
	},
	'& .MuiListItemIcon-root': {
		minWidth: 0,
		marginRight: 16,
	},
	'& .MuiSvgIcon-root': {
		fontSize: 20,
	},
});

function Layout() {
	const drawerWidth = 240
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

	const userItems = [
		{
			"text": 'Log Out',
			"icon": <LogoutIcon />,
			"onClick": () => {
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
			}
		},
		{
			"text": 'Register a New User',
			"icon": <PersonAddIcon />,
			"onClick": () => navigate('/registration'),
		},
	];

	const navItems = [
		{
			"text": 'Request Observations',
			"icon": <FilterCenterFocusIcon />,
			"onClick": () => navigate('/observation'),
		},
		{
			"text": 'Explore Logs',
			"icon": <AssignmentIcon />,
			"onClick": () => navigate('/logsheet'),
		},
	];

	return (
		<>
			<Box sx={{ display: 'flex' }}>

				<ThemeProvider
					theme={createTheme({
						components: {
							MuiListItemButton: {
								defaultProps: {
									disableTouchRipple: true,
								},
							},
						},
						palette: {
							mode: 'dark',
							primary: { main: 'rgb(102, 157, 246)' },
							background: { paper: 'rgb(5, 30, 52)' },
						},
					})}
				>

					<Drawer
						sx={{
							flexShrink: 0,
							width: drawerWidth,
						}}
						PaperProps={{
							sx: {
								boxSizing: 'border-box',
								width: drawerWidth,
							}
						}}
						variant="permanent"
						anchor="left"
					>

						<CustomNav component="nav" disablePadding>
							<ListItemButton component="a" href="#customized-list">
								<ListItemIcon sx={{ fontSize: 20 }}>🔭</ListItemIcon>
								<ListItemText
									sx={{ my: 0 }}
									primary="Empyrean"
									primaryTypographyProps={{
										fontSize: 20,
										fontWeight: 'medium',
										letterSpacing: 0,
									}}
								/>
							</ListItemButton>

							<Divider />

							<ListItem component="div" disablePadding>
								<ListItemButton sx={{
									fontSize: 15,
									fontWeight: 'medium',
									height: 23,
									mt: 5,
								}}>

									<ListItemIcon>
										<Home color="primary" />
									</ListItemIcon>

									<ListItemText
										primary={username}
										primaryTypographyProps={{
											color: 'primary',
											fontWeight: 'medium',
											variant: 'body2',
										}}
									/>

								</ListItemButton>
							</ListItem>

							<CreateNavItems items={userItems} />

							<Divider />
							<Box
								sx={{
									bgcolor: 'rgba(71, 98, 130, 0.2)',
									pb: 2,
								}}
							>

								<ListItemText
									primary="Navigation"
									primaryTypographyProps={{
										fontSize: 15,
										fontWeight: 'medium',
										mb: '2px',
									}}
									sx={{
										my: 0,
										px: 3,
										pt: 2.5,
										pb: 0,
										'&:hover, &:focus': { '& svg': { opacity: 1 } },
									}}
								/>

								<CreateNavItems items={navItems} />

							</Box>
						</CustomNav>
					</Drawer>
				</ThemeProvider>

				<Box
					component="main"
					className="main-content"
					sx={{ flexGrow: 1, p: 3 }}
				>
					<Outlet />
					<Footer />
				</Box>
			</Box >
		</>
	);
}


export { Layout }
