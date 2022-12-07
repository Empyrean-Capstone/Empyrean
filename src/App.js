import React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LoadingButton } from "@mui/lab"

// https://mui.com/material-ui/material-icons/
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import RocketIcon from '@mui/icons-material/RocketLaunch';


export default function InputAdornments() {
	const [values, setValues] = React.useState({
		amount: '',
		password: '',
		weight: '',
		weightRange: '',
	});

	const [isPointLoading, setPointLoading] = React.useState(false);
	const [isStartLoading, setStartLoading] = React.useState(false);

	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	return (
		<>
			<Box
				component="form"
				sx={{
					'& .MuiTextField-root': { m: 1, width: '10ch' },
				}}
				noValidate
				autoComplete="off"
			>
				<div style={{
					display: 'flex',
					justifyContent: "center",
					alignItems: 'center',
				}}>
					<text>
						Time
						<span style={{ marginLeft: '4rem' }}>&nbsp;</span>
						0/
					</text>
					<FormControl sx={{ m: 1, width: '17ch' }} variant="outlined">
						<OutlinedInput
							id="outlined-adornment-weight"
							value={values.weight}
							size="small"
							onChange={handleChange('weight')}
							endAdornment={<InputAdornment position="end">Second(s)</InputAdornment>}
							aria-describedby="outlined-weight-helper-text"
							inputProps={{
								'aria-label': 'weight',
							}}
						/>
					</FormControl>
				</div>

				<div style={{
					display: 'flex',
					justifyContent: "center",
					alignItems: 'center',
				}}>
					<text>
						Exposures
						<span style={{ marginLeft: '5rem' }}>&nbsp;</span>
						1 of
					</text>
					<TextField
						id="outlined-number"
						label="Exposures"
						type="number"
						size="small"
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</div>
			</Box>

			<div style={{
				display: 'flex',
				justifyContent: "center",
				alignItems: 'center',
			}}>
				<Stack direction="row" spacing={5}>
					<LoadingButton
						variant="contained"
						sx={{}}
						startIcon={<LocationSearchingIcon />}
						onClick={() => {
							setPointLoading(!isPointLoading);
							setTimeout(() => {
								setPointLoading(false);
							}, 1000);
						}}
						loading={isPointLoading}
						loadingPosition="start"
						disabled={isStartLoading === true}
					>
						Point
					</LoadingButton>

					<LoadingButton
						variant="contained"
						sx={{}}
						startIcon={<RocketIcon />}
						onClick={() => {
							setStartLoading(!isStartLoading);
							setTimeout(() => {
								setStartLoading(false);
							}, 1000);
						}}
						loading={isStartLoading}
						loadingPosition="start"
						disabled={isPointLoading === true}
					>
						Start
					</LoadingButton>
				</Stack>
			</div>
		</>
	)
}
