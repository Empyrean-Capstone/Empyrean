// TODO:
// 1. make a factory for center input fields
// 2. make center input fields half page apiece


import React from 'react';
import './style.css'

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { LoadingButton } from "@mui/lab"
import { Typography } from '@mui/material';


function ImgTypeButtons() {
	const [active, setActive] = React.useState("Object");
	const buttons = ["Object", "Dark", "Flat", "ThAr"]

	function button_init(name) {
		return (
			<Button
				className={active === name ? 'active-button button' : 'inactive-button button'}
				variant="contained"
				onClick={() => { setActive(name) }}
			>
				{name}
			</Button>
		)
	}

	return (buttons.map(button_init))
}


function Observe() {
	const [values, setValues] = React.useState({
		altitude: 0,
		declination: 0,
		exposures: 0,
		exposure_time: 0,
		object: "",
		right_ascension: 0,
		seconds: 0,
		visible: 0,
	});
	const [resolving, setResolving] = React.useState(false);
	const [startLoading, setStartLoading] = React.useState(false);
	const [stopLoading, setStopLoading] = React.useState(false);

	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const props = { values, handleChange }

	return (
		<div>
			<Typography align="left">
				<h2>Observe</h2>
				<h5>Start observations from here</h5>
			</Typography>

			<Stack className="horiz-align vertically-space" direction="row" spacing={1}>
				<ImgTypeButtons />
			</Stack>

			<Stack className="horiz-align vertically-space" direction="row" spacing={1}>
				<TextField
					required
					fullWidth
					id="outlined"
					value={values.object}
					size="small"
					onChange={handleChange("object")}
					label="Object"
					type="text"
					InputLabelProps={{
						shrink: true,
					}}
				/>

				<Tooltip title="Resolve Astronomical Object">
					<LoadingButton
						className="button short-button"
						variant="contained"
						// https://stackoverflow.com/questions/38154469/submit-form-with-mui
						type="submit"
						sx={{}}
						onClick={() => {
							setResolving(!resolving);
							console.log(props.values.object);

							setTimeout(() => {
								setResolving(false);
							}, 1000);
						}}
						loading={resolving}
						loadingPosition="center"
						disabled={startLoading === true || stopLoading === true}
					>
						Resolve
					</LoadingButton>
				</Tooltip>
			</Stack>

			<Stack className="horiz-align vertically-space" direction="row" spacing={3}>
				<TextField
					required
					id="outlined"
					variant="outlined"
					size="small"
					value={values.right_ascension}
					onChange={handleChange("right_ascension")}
					label="Right Ascension (α)"
					InputLabelProps={{
						shrink: true,
					}}
				/>

				<TextField
					required
					id="outlined"
					value={values.declination}
					size="small"
					onChange={handleChange("declination")}
					label="Declination (δ)"
					type="text"
					InputLabelProps={{
						shrink: true,
					}}
				/>
			</Stack>

			<Stack className="horiz-align vertically-space" direction="row" spacing={3}>
				<TextField
					required
					id="outlined"
					value={values.altitude}
					size="small"
					onChange={handleChange("altitude")}
					label="Altitude"
					type="text"
					InputLabelProps={{
						shrink: true,
					}}
				/>

				<TextField
					required
					id="outlined"
					value={values.visible}
					size="small"
					onChange={handleChange("visible")}
					label="Visible"
					type="text"
					InputLabelProps={{
						shrink: true,
					}}
				/>
			</Stack>


			<Stack className="horiz-align vertically-space" direction="row" spacing={3}>
				<TextField
					required
					id="outlined-number"
					value={values.exposures}
					size="small"
					onChange={handleChange("exposures")}
					label="Number of Exposures"
					type="number"
					InputLabelProps={{
						shrink: true,
					}}
				/>

				<TextField
					required
					id="outlined-number"
					value={values.exposure_time}
					size="small"
					onChange={handleChange("exposure_time")}
					label="Exposure Time (secs)"
					type="number"
					InputLabelProps={{
						shrink: true,
					}}
				/>
			</Stack>

			<div>
				<Stack direction="row" spacing={1}>

					<Tooltip title="Begin Observation">
						<LoadingButton
							className="button"
							color="success"
							variant="contained"
							// https://stackoverflow.com/questions/38154469/submit-form-with-mui
							type="submit"
							sx={{}}
							onClick={() => {
								setStartLoading(!startLoading);
								console.log(props.values);

								setTimeout(() => {
									setStartLoading(false);
								}, 1000);
							}}
							loading={startLoading}
							loadingPosition="center"
							disabled={stopLoading === true || resolving === true}
						>
							Start
						</LoadingButton>
					</Tooltip>

					<Tooltip title="End Observation">
						<LoadingButton
							className="button"
							color="error"
							variant="contained"
							// https://stackoverflow.com/questions/38154469/submit-form-with-mui
							type="submit"
							sx={{}}
							onClick={() => {
								setStopLoading(!stopLoading);

								setTimeout(() => {
									setStopLoading(false);
								}, 1000);
							}}

							loading={stopLoading}
							loadingPosition="center"
							disabled={startLoading === true || resolving === true}
						>
							Stop
						</LoadingButton>
					</Tooltip>

				</Stack>
			</div>
		</div >
	)
}

export { Observe }
