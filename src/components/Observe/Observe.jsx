// resources:
// For async posts to backend: https://medium.com/@adrianhuber17/how-to-build-a-simple-real-time-application-using-flask-react-and-socket-io-7ec2ce2da977
//

import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { LoadingButton } from "@mui/lab"

import './style.css'
import { requestFormSchema } from '../../validations/Observe'
import { SocketContext } from '../../context/socket'


function Observe() {
	const [activeButton, setActiveButton] = React.useState("object");
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
		obs_type: activeButton,
		right_ascension: "0",
		declination: "0",
		altitude: "0",
		visible: false,
		num_exposures: 0,
		exposure_duration: 0,
	});

	const [errs, setErrs] = React.useState({
		object: "",
		obs_type: "",
		right_ascension: "",
		declination: "",
		altitude: "",
		visible: "",
		num_exposures: "",
		exposure_duration: ""
	})

	const handleFieldChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });

		setErrs({ ...errs, [prop]: "" })
	}

	const props = { values, handleFieldChange }

	const [isFormEnabled, setFormEnabled] = React.useState(true)

	const socket = useContext(SocketContext);

	useEffect(() => {
		socket.on("enable_request_form", () => {
			setFormEnabled(true)
		})
	}, [socket, setFormEnabled])


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
				disabled={activeButton !== "object" &&
					type.name !== "Number of Exposures" &&
					type.name !== "Exposure Duration (secs)" ? true : false}
				className="half-containers"
				key={type.name}
				id="outlined"
				variant="outlined"
				size="small"
				value={values[type.value]}
				onChange={handleFieldChange(type.value)}
				label={type.name}
				error={errs[type.value] === "" ? false : true}
				helperText={errs[type.value]}
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
					activeButton === name ? styles["active"] : styles["inactive"]
				]}
				key={name}
				variant="contained"
				onClick={() => { setActiveButton(name); values.obs_type = name; }}
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
					disabled={activeButton !== "object" ? true : false}
					fullWidth
					id="outlined"
					value={values.obs_type === "object" ? values.object : values.obs_type}
					size="small"
					onChange={handleFieldChange("object")}
					label="object"
					type="text"
					error={(activeButton !== "object" || errs["object"] === "") ? false : true}
					helperText={activeButton !== "object" ? "" : errs["object"]}
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
						sx={{ fontSize: "9pt" }}
						onClick={() => {
							const initResolution = async (values) => {
								try {
									let res = await axios.post(`http://localhost:5000/resolve/`, values);
									setValues(res.data)
									setErrs({
										...errs,
										object: "",
										obs_type: "",
										right_ascension: "",
										declination: "",
										altitude: "",
										visible: "",
									})
								} catch (err) {
									setErrs({ ...errs, object: "No such object found" })
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
								function validateObservationRequest(values) {
									try {
										requestFormSchema.validateSync(values, { abortEarly: false })
										return true
									} catch (validation_err) {
										let errors = {}

										validation_err.inner.forEach(error => {
											if (error.path) {
												errors[error.path] = error.message;
											}
										});

										console.log(errors)

										setErrs({ ...errs, ...errors })
										return false
									}
								}

								const initObservation = async (values) => {
									try {
										const resp = await axios.post(
											`http://localhost:5000/observations/`,
											values,
											{
												withCredentials: true
											}
										);
										console.log(resp.data);
									} catch (err) {
										console.error(err);
									}
								};

								setFormEnabled(false)

								let isFormValid = validateObservationRequest(props.values)

								if (isFormValid) {
									initObservation(props.values);
								}
								else {
									setFormEnabled(true)
								}
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
										const resp = await axios.post(`http://localhost:5000/observations/end`, null);
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

		</div >
	)
}

export { Observe }
