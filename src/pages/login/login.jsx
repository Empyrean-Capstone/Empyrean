import React from 'react';
import axios from 'axios';

import './style.css'

import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Unstable_Grid2'
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MuiAlert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
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


function Login() {
	const navigate = useNavigate();

	const [isLoading, setLoading] = React.useState("");
	const [authState, setAuthState] = React.useState({
		set: false,
		msg: "",
		severity: ""
	});

	const [values, setValues] = React.useState({
		username: "",
		password: "",
	});

	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
		setAuthState("")
	};

	const [showPassword, setShowPassword] = React.useState(true);

	const props = { values, handleChange }

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

					<TextField
						sx={{ mt: 2, mb: 2 }}
						required
						fullWidth
						disabled={isLoading !== ""}
						type="text"
						key={"Username"}
						label={"Username"}
						size="small"
						id="outlined"
						value={values["username"]}
						onChange={handleChange("username")}
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
						size="small"
						id="outlined-start-adornment"
						value={values["password"]}
						onChange={handleChange("password")}
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

					<Stack
						alignItems="center"
						justifyContent="center"
						direction="row" spacing={3}
					>
						<LoadingButton
							sx={{ mt: 2, mb: 2 }}
							variant="contained"
							type="submit"
							onClick={() => {
								setLoading("login");

								//  const salt = bcrypt.genSaltSync(0);
								//  values.password = bcrypt.hashSync(values.password, salt);

								const attemptLogin = async (values) => {
									try {
										let auth_res = await axios.post(
											`http://localhost:5000/auth_login/`,
											values,
											{
												withCredentials: true
											}
										)
										if (auth_res.status === 200) {
											navigate("/observation");
										}
									}
									catch (err) {
										setAuthState({
											set: true,
											msg: "Username or password are incorrect",
											severity: "error"
										})
									}
									finally {
										setLoading("")
									}
								};

								attemptLogin(props.values);
							}}
							loadingPosition="center"
							loading={isLoading === "login"}
							disabled={isLoading === "registration"}
						>
							Login
						</LoadingButton>

						<LoadingButton
							sx={{ mt: 2, mb: 2 }}
							variant="outlined"
							type="submit"
							onClick={() => {
								setLoading("registration");
								const attemptRegistration = async (values) => {
									try {

										let reg_res = await axios.post(
											`http://localhost:5000/auth_login/register/`,
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

								attemptRegistration(props.values);
							}}
							loadingPosition="center"
							loading={isLoading === "registration"}
							disabled={isLoading === "login"}
						>
							Register
						</LoadingButton>
					</ Stack>

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

export { Login }
