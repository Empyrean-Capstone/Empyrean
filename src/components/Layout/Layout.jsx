import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

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
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

/**
 * Creates a JSX element to be used on all pages as a footer,
 *     which contains a link to the About and Contact pages.
 * @return {JSX element} Returns a valid JSX Footer with links
 *     to About and Contact.
 */
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

/**
 * Defines a way to create navigation links in the navigation
 *     bar on the side of the webpage.
 * @params {JSX element} Element to be put into the nav bar.
 * @return {JSX element} Returns a valid JSX element that contains
 *     a navigation link.
 */
function CreateNavLinks({ items }) {
	const navigate = useNavigate()
	const { pathname } = useLocation()

	let linkList = items.map((linkObj) => {
		const { text, icon, key } = linkObj;

		return (
			<ListItem key={text} onClick={() => navigate(key)}>
				<ListItemButton
					dense
					sx={{
						py: 0,
						minHeight: 27,
						color: 'rgba(255, 255, 255, .9)'
					}}
					selected={pathname === key}
				>
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
						sx={{ mt: 1, ml: 1 }}
					/>

				</ListItemButton>
			</ListItem >
		)
	})

	return linkList
}

/**
 * Creates a button to log a user out.
 * @return {JSX element} Returns a JSX element to log
 *      a user out.
 */
function LogOutLink() {
	const navigate = useNavigate()

	const text = "Log Out"
	const icon = <LogoutIcon />
	const clickHandler = () => {
		const logout = async () => {
			try {
				let logout_res = await axios.post(
					`/api/auth_login/logout/`,
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

	return (
		<ListItem key={text} onClick={clickHandler}>
			<ListItemButton
				dense
				sx={{
					py: 0,
					minHeight: 27,
					color: 'rgba(255, 255, 255, .9)'
				}}
			>
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
					sx={{ mt: 1, ml: 1 }}
				/>

			</ListItemButton>
		</ListItem >
	)
}

//defines custom styled nav bar values
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

/**
 * Creates a valid Layout for the page
 * @return {JSX element} Returns a valid JSX element
 *     that defines the overall layout of a page.
 */
function Layout() {
	const drawerWidth = 285

	let [userInfo, setUserInfo] = useState({
		username: "",
		name: "",
		isadmin: false
	})

	useEffect(() => {
		//sends a get request to determine login status
		(async () => {
			const res = await axios.get(
				`/api/auth_login/`,
				{
					withCredentials: true
				}
			)

			if (res.status === 200) setUserInfo(res.data)
			else console.error(res.status)
		})();

		return () => {
			// this now gets called when the component unmounts
		};
	}, [setUserInfo]);

	//defines the links in the nav bar
	const navLinks = [
		{
			text: 'Request Observations',
			icon: <FilterCenterFocusIcon />,
			key: '/observation',
		},
		{
			text: 'Explore Logs',
			icon: <AssignmentIcon />,
			key: '/logsheet',
		},
	]

	//defines the link to the manage users page
	const manageUsers = {
		text: 'Manage Users',
		icon: <ManageAccountsIcon />,
		key: '/management',
	}


	return (
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
						<ListItem>
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
						</ListItem>

						<ListItem>
							<ListItemText
								primary={userInfo.name}
								secondary={userInfo.username}
								primaryTypographyProps={{
									align: "left",
									fontSize: 14,
									fontWeight: 'medium',
								}}
								secondaryTypographyProps={{
									align: "left",
									fontSize: 12,
									fontWeight: 'medium',
								}}
								sx={{ marginLeft: 2 }}
							/>

						</ListItem>

						<Box>
							<Divider sx={{ margin: 2 }} />
							<CreateNavLinks items={navLinks} />


							<Divider sx={{ margin: 2 }} />
							{userInfo.isadmin === true ?
								<CreateNavLinks items={[manageUsers]} /> :
								null
							}

							<LogOutLink />
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
	);
}


export { Layout }
