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
	const styles = {
		"active": {
			backgroundColor: "#334155",
			color: "#ebeef2",
			"&:hover": {
				backgroundColor: "#334155",
				color: "#ebeef2"
			}
		},
		"inactive": {
			backgroundColor: "#ebeef2",
			color: "#334155",
			"&:hover": {
				backgroundColor: "#5B6676",
				color: "#ebeef2",
			}
		}
	}

	function button_init(name) {
		return (
			<Button
				sx={[
					{
						fontWeight: 'bold',
						maxWidth: '20px',
					},
					active === name ? styles["active"] : styles["inactive"]
				]}
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
	const [isLoading, setLoading] = React.useState("");

	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const [values, setValues] = React.useState({
		object: "",
		right_ascension: 0,
		declination: 0,
		altitude: 0,
		visible: 0,
		num_exposures: 0,
		exposure_time: 0,
	});

	const fields_row1 = [
		{ name: "Right Ascension (α)", value: "right_ascension" },
		{ name: "Declination (δ)", value: "declination" },
	]
	const fields_row2 = [
		{ name: "Altitude", value: "altitude" },
		{ name: "Visible", value: "visible" },
	]
	const fields_row3 = [
		{ name: "Number of Exposures", value: "num_exposures" },
		{ name: "Exposure Time (secs)", value: "exposure_time" },
	]

	function field_init(type) {
		return (
			<TextField
				required
				className="half-containers"
				id="outlined"
				variant="outlined"
				size="small"
				value={values[type.value]}
				onChange={handleChange(type.value)}
				label={type.name}
				InputLabelProps={{
					shrink: true,
				}}
			/>
		)
	}

	const props = { values, handleChange }

	return (
		<div>
			<Typography align="left">
				<h2 className="horiz-align">Observe</h2>
				<h5 className="horiz-align">Start observations from here</h5>
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
							setLoading("Resolve");
							console.log(props.values.object);

							setTimeout(() => {
								setLoading("");
							}, 1000);
						}}
						loadingPosition="center"
						loading={isLoading === "Resolve"}
						disabled={isLoading !== "" && isLoading !== "Resolve"}
					>
						Resolve
					</LoadingButton>
				</Tooltip>
			</Stack>

			<Stack className="horiz-align vertically-space" direction="row" spacing={3}>
				{fields_row1.map(field_init)}
			</Stack>

			<Stack className="horiz-align vertically-space" direction="row" spacing={3}>
				{fields_row2.map(field_init)}
			</Stack>


			<Stack className="horiz-align vertically-space" direction="row" spacing={3}>
				{fields_row3.map(field_init)}
			</Stack>

			<Stack className="horiz-align" direction="row" spacing={1}>
				<Tooltip title="Begin Observation">
					<LoadingButton
						className="button"
						color="success"
						variant="contained"
						// https://stackoverflow.com/questions/38154469/submit-form-with-mui
						type="submit"
						sx={{}}
						onClick={() => {
							setLoading("Start");
							console.log(props.values);

							setTimeout(() => {
								setLoading("");
							}, 1000);
						}}
						loadingPosition="center"
						loading={isLoading === "Start"}
						disabled={isLoading !== "" && isLoading !== "Start"}
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
							setLoading("Stop");

							setTimeout(() => {
								setLoading("");
							}, 1000);
						}}

						loadingPosition="center"
						loading={isLoading === "Stop"}
						disabled={isLoading !== "" && isLoading !== "Stop"}
					>
						Stop
					</LoadingButton>
				</Tooltip>
			</Stack>

		</div>
	)
}

export { Observe }
