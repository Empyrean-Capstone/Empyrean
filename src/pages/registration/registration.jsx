import React from 'react';
import axios from 'axios';

import './style.css'

import Grid from '@mui/material/Unstable_Grid2'
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MuiAlert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from "@mui/lab"
import { styled } from '@mui/material/styles';

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));


function Register() {
	const [authState, setAuthState] = React.useState({
		set: false,
		msg: "",
		severity: ""
	});


	const [creds, setCreds] = React.useState({
		email: "",
		name: "",
		password: "",
	});

	const handleCredChange = (prop) => (event) => {
		setCreds({ ...creds, [prop]: event.target.value });
		setAuthState("")
	};

	const [isLoading, setLoading] = React.useState("");

	const [showPassword, setShowPassword] = React.useState(true);

	return (
		<Grid
			container
			spacing={0}
			display="flex"
			alignItems="center"
			justifyContent="center"
			sx={{ backgroundColor: "#ebeef2" }}
			style={{ minHeight: '100vh' }
			}
		>
			<Grid item>
				<Item
					sx={{
						width: 400,
						height: '20%',
					}}
				>
					<img src={require("../../images/lowell.png")} alt="Logo" />

					<TextField
						sx={{ mt: 2, mb: 2 }}
						required
						fullWidth
						disabled={isLoading !== ""}
						type="text"
						id="email"
						key={"email"}
						label={"Email"}
						variant="filled"
						value={creds["email"]}
						onChange={handleCredChange("email")}
						InputLabelProps={{
							shrink: true,
						}}
					/>

					<TextField
						sx={{ mt: 2, mb: 2 }}
						required
						fullWidth
						disabled={isLoading !== ""}
						key={"Name"}
						label="Observer Name"
						id="filled-start-adornment"
						variant="filled"
						value={creds["name"]}
						onChange={handleCredChange("name")}
						InputLabelProps={{
							shrink: true,
						}}
					/>

					<TextField
						sx={{ mt: 2, mb: 2 }}
						required
						fullWidth
						disabled={isLoading !== ""}
						type={showPassword ? 'text' : 'password'}
						key={"Password"}
						label="Password"
						id="filled-start-adornment"
						variant="filled"
						value={creds["password"]}
						onChange={handleCredChange("password")}
						InputProps={{
							endAdornment: <InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={() => setShowPassword((show) => !show)}
									onMouseDown={(event) => {
										event.preventDefault();
									}}
									edge="end"
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}}
						InputLabelProps={{
							shrink: true,
						}}
					/>


					<LoadingButton
						sx={{ mt: 2, mb: 2 }}
						type="submit"
						variant="contained"
						onClick={() => {
							setLoading("registration");
							const attemptRegistration = async (values) => {
								try {
									let reg_res = await axios.post(
										`/api/auth_login/register/`,
										values,
										{
											withCredentials: true
										}
									)
									if (reg_res.status === 201) {
										setLoading("");

										setAuthState({
											set: true,
											msg: `user "${values.username}" sucessfully registered`,
											severity: "success"
										})
									}
								} catch (err) {
									setAuthState({
										set: true,
										msg: `user "${values.username}" already exists`,
										severity: "error"
									})
								}
								finally {
									setLoading("")
								}
							};

							attemptRegistration(creds);
						}}
						loadingPosition="center"
						loading={isLoading === "registration"}
						disabled={isLoading === "login"}
					>
						Register
					</LoadingButton>

					<Snackbar open={authState.set} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
						<Alert variant="standard" severity={authState.severity} sx={{ width: '100%' }}>
							{authState.msg}
						</Alert>
					</Snackbar>

				</Item >
			</Grid>
		</Grid >
	)
}

export { Register }
