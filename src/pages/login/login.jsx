import React from 'react';
import axios from 'axios';

import './style.css'
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


function Login() {
	const navigate = useNavigate();

	const [authState, setAuthState] = React.useState({
		set: false,
		msg: "",
		severity: ""
	});

	const [creds, setCreds] = React.useState({
		username: "",
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
				<PaperPane
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
						key={"Username"}
						label={"Username"}
						id="username"
						variant="filled"
						value={creds["username"]}
						onChange={handleCredChange("username")}
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
											msg: "Credentials are incorrect",
											severity: "error"
										})
									}
									finally {
										setLoading("")
									}
								};

								attemptLogin(creds);
							}}
							loadingPosition="center"
							loading={isLoading === "login"}
						>
							Login
						</LoadingButton>
					</ Stack>

					<Snackbar open={authState.set} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
						<Alert variant="standard" severity={authState.severity} sx={{ width: '100%' }}>
							{authState.msg}
						</Alert>
					</Snackbar>

				</PaperPane >
			</Grid>
		</Grid >
	)
}

export { Login }
