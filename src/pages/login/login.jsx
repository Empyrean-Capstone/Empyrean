import React from 'react';
<<<<<<< HEAD
import axios from 'axios';
=======
>>>>>>> d96357252c6ea9c73d143d90e71a0fdc29b059da
import './style.css'

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import TextField from '@mui/material/TextField';
import { LoadingButton } from "@mui/lab"

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

function Login() {

	const [isLoading, setLoading] = React.useState("");

	const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });}; 

	const [values, setValues] = React.useState({
		username: "",
		password: "",
	});

	const props = { values, handleChange }

	return (
		<div>
			<Item
				sx={{ width: 400,
					height: 300,
					display: 'center',
					mt: '40%',
					ml: '40%',
					}}
			>
	
				<TextField
					sx={{mt: 2, mb: 2}}
					required
					fullWidth
					id="outlined"
					value={values.username}
					size="small"
					onChange={handleChange("username")}
					label="Username"
					type="text"
					InputLabelProps={{
						shrink: true,
					}}
				/>

				<TextField
					sx={{mt: 2, mb: 2}}
					required
					fullWidth
					id="outlined"
					value={values.password}
					size="small"
					onChange={handleChange("password")}
					label="Password"
					type="text"
					InputLabelProps={{
						shrink: true,
					}}
				/>

				<LoadingButton
					sx={{mt: 2, mb: 2}}
					variant="contained"
					type="submit"
					onClick={() => {
						setLoading("Login");
						
						const initLogin = async (values) => {
							try {
								const resp = await axios.post('http://localhost:5000/login', values);
								if( resp ) {
									console.log("Logged In");
								}
							} catch (err) {
								// Error Handling?
								console.error(err);
							}

							setLoading("");
						};

						initLogin(props.values);

					}}
					loadingPosition="center"
					loading={isLoading === "Login"}
					disabled={isLoading !== "" && isLoading !== "Login"}
					variant="contained"
					type="submit"
					sx={{}}
					onClick={() => {
						setLoading("Login");
						console.log(props.values.username);
						console.log(props.values.password);

						setTimeout(() => {
							setLoading("");
						}, 1000);
					}}
					loadingPosition="center"
					//loading={}
					//disabled={}
				>
					Login
				</LoadingButton>
			</Item>
		</div>
	)
}

export { Login }
