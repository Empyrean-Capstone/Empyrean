import React from 'react';
import axios from 'axios';

import './style.css'
import { loginFormSchema } from '../../validations/login'
import { PaperPane } from '../../components/PaperPane';

import Grid from '@mui/material/Unstable_Grid2'
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from "@mui/lab"
import { useNavigate } from "react-router-dom";


const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

/**
 * Creates the Login page, which has the ability to
 *     validate users using a username and password created
 *     in the user management page.
 * @return {JSX element} Returns a valid JSX element containing
 *     the login page with text fields and login button.
 */
function Login() {
	const navigate = useNavigate();

	const defaultCredVals = {
		username: "",
		password: "",
	}

	const [authState, setAuthErr] = React.useState({ set: false, msg: "" });

	const [creds, setCreds] = React.useState(defaultCredVals);

	const [inputErrs, setInputErrs] = React.useState(defaultCredVals)

	const handleCredChange = (prop) => (event) => {
		setCreds({ ...creds, [prop]: event.target.value });
		setAuthErr({ set: false, msg: "" })
	};

	const [isLoading, setLoading] = React.useState(false);

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
				<PaperPane
					sx={{
						width: 400,
						height: '20%',
					}}
				>
					<img src={require("../../images/lowell.png")} alt="Logo" />

					{/*Represents a text field with several advanced features.*/}
					<TextField
						sx={{ mt: 2, mb: 2 }}
						required
						fullWidth
						disabled={isLoading}
						type="text"
						key={"Username"}
						label={"Username"}
						id="username"
						variant="filled"
						value={creds["username"]}
						onChange={handleCredChange("username")}
						error={inputErrs["username"] === "" ? false : true}
						helperText={inputErrs["username"]}
						InputLabelProps={{
							shrink: true,
						}}
					/>

					{/*Represents a text field with several advanced features.*/}
					<TextField
						sx={{ mt: 2, mb: 2 }}
						required
						fullWidth
						disabled={isLoading}
						type={showPassword ? 'text' : 'password'}
						key={"Password"}
						label="Password"
						id="filled-start-adornment"
						variant="filled"
						value={creds["password"]}
						onChange={handleCredChange("password")}
						error={inputErrs["password"] === "" ? false : true}
						helperText={inputErrs["password"]}
						InputProps={{
							endAdornment: <InputAdornment position="end">
								<IconButton
									// Allows a user to change password visibility for privacy.
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
							type="submit"
							variant="contained"
							onClick={() => {
								/**
								 * Checks the login request and allows the user to login.
								 * @param {JSX element} Takes in the username and password fields.
								 * @return {Boolean} Response to user login request.
								 */
								function validateLoginRequest(values) {
									try {
										loginFormSchema.validateSync(values, { abortEarly: false })

										return true
									} catch (validation_err) {
										let errors = {}

										validation_err.inner.forEach(error => {
											if (error.path) {
												errors[error.path] = error.message;
											}
										});

										setInputErrs({ ...inputErrs, ...errors })
										return false
									}
								}

								// Sends a post request to authenticate a user.
								const attemptLogin = async (values) => {
									console.log(values)

									try {
										let auth_res = await axios.post(
											`/api/auth_login/`,
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
										setAuthErr({
											set: true,
											msg: "Credentials are incorrect",
										})
									}
									finally {
										setLoading(false)
									}
								};

								setLoading(true);

								setInputErrs(defaultCredVals)

								const isFormValid = validateLoginRequest(creds)

								//  const salt = bcrypt.genSaltSync(0);
								//  values.password = bcrypt.hashSync(values.password, salt);

								if (isFormValid) attemptLogin(creds);
								else setLoading(false)

							}}
							loadingPosition="center"
							loading={isLoading}
						>
							Login
						</LoadingButton>
					</ Stack>

					<Snackbar open={authState.set} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
						<Alert variant="standard" severity="error" sx={{ width: '100%' }}>
							{authState.msg}
						</Alert>
					</Snackbar>

				</PaperPane >
			</Grid>
		</Grid >
	)
}

export { Login }
