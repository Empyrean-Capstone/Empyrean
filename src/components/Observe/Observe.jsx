// resources:
// For async posts to backend: https://medium.com/@adrianhuber17/how-to-build-a-simple-real-time-application-using-flask-react-and-socket-io-7ec2ce2da977
//

import React, { useCallback, useContext, useEffect } from 'react';
import axios from 'axios';

import './style.css'
import { SocketContext } from '../../context/socket';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { LoadingButton } from "@mui/lab"

function Observe() {
	const [active, setActive] = React.useState("object");
	const buttons = ["object", "dark", "flat", "thar"]

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


	const [values, setValues] = React.useState({
		object: "",
		observation_type: active,
		right_ascension: 0,
		declination: 0,
		altitude: 0,
		visible: false,
		num_exposures: 0,
		exposure_duration: 0,
	});

	const [object_field_error, setObjectFieldError] = React.useState({
		error: false,
		text: ""
	})

	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const handleObjectFieldChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });

		setObjectFieldError({
			error: false,
			text: ""
		})
	}

	const props = { values, handleChange }


	const [isFormEnabled, setFormEnabled] = React.useState(true)

	const socket = useContext(SocketContext);

	const enableCameraStatus = useCallback(() => {
		setFormEnabled(true)
	}, [setFormEnabled]);

	useEffect(() => {
		socket.on("enable_request_form", enableCameraStatus)
	}, [socket, enableCameraStatus])


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
				disabled={active !== "object" &&
					type.name !== "Number of Exposures" &&
					type.name !== "Exposure Duration (secs)" ? true : false}
				className="half-containers"
				key={type.name}
				id="outlined"
				variant="outlined"
				size="small"
				value={values[type.value]}
				onChange={handleChange(type.value)}
				label={type.name === "object" ? values.object : type.name}
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
				key={name}
				variant="contained"
				onClick={() => { setActive(name); values.observation_type = name; }}
			>
				{name}
			</Button>
		)
	}

	return (
		<div>
			<h2 className="horiz-align">Observe</h2>
			<h5 className="horiz-align">Start observations from here</h5>

			<Stack className="horiz-align vert-space" direction="row" spacing={1}>
				{(buttons.map(button_init))}
			</Stack>

			<Stack className="horiz-align vert-space" direction="row" spacing={1}>
				<TextField
					disabled={active !== "object" ? true : false}
					fullWidth
					id="outlined"
					value={values.observation_type === "object" ? values.object : values.observation_type}
					size="small"
					onChange={handleObjectFieldChange("object")}
					label="object"
					type="text"
					error={active !== "object" ? false : object_field_error.error}
					helperText={active !== "object" ? "" : object_field_error.text}
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
							const initResolution = async (values) => {
								let res = null

								try {
									res = await axios.post(`http://localhost:5000/resolve/`, values);
									setValues(res.data)
								} catch (err) {
									setObjectFieldError({
										error: true,
										text: "No such object found"
									})
								}

								setLoading("");
							};

							setLoading("Resolve")
							initResolution(props.values)
						}}
						loadingPosition="center"
						loading={isLoading === "Resolve"}
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
					<span>
						<LoadingButton
							className="button"
							color="success"
							variant="contained"
							// https://stackoverflow.com/questions/38154469/submit-form-with-mui
							type="submit"
							sx={{}}
							onClick={() => {
								const initObservation = async (values) => {
									try {
										const resp = await axios.post(`http://localhost:5000/observations/`, values);
										console.log(resp.data);
									} catch (err) {
										console.error(err);
									}
								};

								setFormEnabled(false)
								initObservation(props.values);
							}}
							disabled={!isFormEnabled || (isLoading !== "" && isLoading !== "Start")}
						>
							Start
						</LoadingButton>
					</span>
				</Tooltip>

				<Tooltip title="End Observation">
					<span>
						<LoadingButton
							className="button"
							color="error"
							variant="contained"
							// https://stackoverflow.com/questions/38154469/submit-form-with-mui
							type="submit"
							sx={{}}
							onClick={() => {
								const endObservation = async () => {
									try {
										const resp = await axios.post(`http://localhost:5000/observations/end`);
										console.log(resp.data);
									} catch (err) {
										console.error(err);
									}
								};

								setFormEnabled(true)
								endObservation();
							}}

							loadingPosition="center"
							loading={isLoading === "Stop"}
							disabled={isFormEnabled}
						>
							Stop
						</LoadingButton>
					</span>
				</Tooltip>
			</Stack>

		</div>
	)
}

export { Observe }
