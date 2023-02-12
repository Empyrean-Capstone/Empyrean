// resources:
// For async posts to backend: https://medium.com/@adrianhuber17/how-to-build-a-simple-real-time-application-using-flask-react-and-socket-io-7ec2ce2da977
//

import React from 'react'
import axios from 'axios';
import './style.css'

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { LoadingButton } from "@mui/lab"
import { Typography } from '@mui/material';

function Observe() {
	const [active, setActive] = React.useState("Dark");
	const buttons = ["Object", "Dark", "Flat", "ThAr"]
	const buttons_values = {
		"Object" : "",
		"Dark"   : "Dark",
		"Flat"   : "Flat",
		"ThAr"   : "ThAr",
	}
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

	const [isLoading, setLoading] = React.useState("");

	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const [values, setValues] = React.useState({
		object: active,
		right_ascension: 0,
		declination: 0,
		altitude: 0,
		visible: 0,
		num_exposures: 0,
		exposure_duration: 0,
	});

	const props = { values, handleChange }

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
		{ name: "Exposure Duration (secs)", value: "exposure_duration" },
	]

	function field_init(type) {
		return (
			<TextField
				disabled={active !== "Object" &&
							type.name !== "Number of Exposures" &&
								type.name !== "Exposure Duration (secs)" ? "disabled" : ""}
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
				onClick={() => { setActive(name); values.object = buttons_values[name]; }}
			>
				{name}
			</Button>
		)
	}

	return (
		<div>
			<Typography align="left">
				<h2 className="horiz-align">Observe</h2>
				<h5 className="horiz-align">Start observations from here</h5>
			</Typography>

			<Stack className="horiz-align vert-space" direction="row" spacing={1}>
				{(buttons.map(button_init))}
			</Stack>

			<Stack className="horiz-align vert-space" direction="row" spacing={1}>
				<TextField
					disabled={active !== "Object" ? "disabled" : ""}
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

							const initResolution = async (values) => {
								try {
									const resp = await axios.post(`http://localhost:5000/resolve`, values);
									console.log(resp.data);
								} catch (err) {
									// Handle Error Here
									console.error(err);
								}

								setLoading("");
							};

							initResolution(props.values);
						}}
						loadingPosition="center"
						loading={isLoading === "Resolve"}
						disabled={isLoading !== "" && isLoading !== "Resolve"}
					>
						Resolve
					</LoadingButton>
				</Tooltip>
			</Stack>

			<Stack className="horiz-align vert-space" direction="row" spacing={3}>
				{fields_row1.map(field_init)}
			</Stack>

			<Stack className="horiz-align vert-space" direction="row" spacing={3}>
				{fields_row2.map(field_init)}
			</Stack>

			<Stack className="horiz-align vert-space" direction="row" spacing={3}>
				{fields_row3.map(field_init)}
			</Stack>

			<Stack className="horiz-align vert-space" direction="row" spacing={1}>
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

							const initObservation = async (values) => {
								try {
									const resp = await axios.post(`http://localhost:5000/observations/`, values);
									console.log(resp.data);
								} catch (err) {
									// Handle Error Here
									console.error(err);
								}

								setLoading("");
							};

							initObservation(props.values);
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
