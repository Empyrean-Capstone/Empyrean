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
		seconds: 0,
		exposures: 0
	});

	const [isPointLoading, setPointLoading] = React.useState(false);
	const [pointTxtVal, setPointTxtVal] = React.useState("Point");

	const [isStartLoading, setStartLoading] = React.useState(false);
	const [startTxtVal, setStartTxtVal] = React.useState("Start");

	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const props = { values, handleChange }

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
							id="outlined-adornment-seconds"
							value={values.seconds}
							size="small"
							onChange={handleChange("seconds")}
							endAdornment={<InputAdornment position="end">Second(s)</InputAdornment>}
							aria-describedby="outlined-seconds-helper-text"
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
						value={values.exposures}
						size="small"
						onChange={handleChange("exposures")}
						label="Exposures"
						type="number"
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
							setPointTxtVal("Pointing");

							setTimeout(() => {
								setPointLoading(false);
								setPointTxtVal("Point");
							}, 1000);
						}}
						loading={isPointLoading}
						loadingPosition="start"
						disabled={isStartLoading === true}
					>
						{pointTxtVal}
					</LoadingButton>

					<LoadingButton
						variant="contained"
						// https://stackoverflow.com/questions/38154469/submit-form-with-mui
						type="submit"
						sx={{}}
						startIcon={<RocketIcon />}
						onClick={() => {
							setStartLoading(!isStartLoading);
							setStartTxtVal("Starting");
							console.log(props.values);

							setTimeout(() => {
								setStartLoading(false);
								setStartTxtVal("Start");
							}, 1000);
						}}
						loading={isStartLoading}
						loadingPosition="start"
						disabled={isPointLoading === true}
					>
						{startTxtVal}
					</LoadingButton>
				</Stack>
			</div>
		</>
	)
}
