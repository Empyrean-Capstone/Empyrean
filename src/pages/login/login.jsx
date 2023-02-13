import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { LoadingButton } from "@mui/lab"

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    }; 

function Login() {

	const [isLoading, setLoading] = React.useState("");

	const [values, setValues] = React.useState({
		username: "",
		password: "",
	});

	const props = { values, handleChange }

	return (
		<div>
			<Item
				sx={{}}
			>
				<TextField
					required
					fullWidth
					id="outlined"
					value=''
					size="small"
					onChange={handleChange("username")}
					label="Username"
					type="text"
					InputLabelProps={{
						shrink: true,
					}}
				/>

				<TextField
					required
					fullWidth
					id="outlined"
					value=''
					size="small"
					onChange={handleChange("password")}
					label="Password"
					type="text"
					InputLabelProps={{
						shrink: true,
					}}
				/>

				<LoadingButton
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
					loading={}
					disabled={}
				>
					Login
				</LoadingButton>
			</Item>
		</div>
	)
}

export { Login }
