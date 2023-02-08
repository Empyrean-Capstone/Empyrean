import React from 'react';
import './style.css'
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { LoadingButton } from "@mui/lab"


function Search() {

	const handleChange = (prop) => (event) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const [values, setValues] = React.useState({
		exposureTime: "",
		CCDTemperature: "",
		imageType: "",
		gain: "",
		offset: "",
		gamma: "",
		dateObserved: "",
		instrument: "",
		rowOrder: "",
		object: "",
		observationType: "",
		AIRM: "",
		observer: "",
		observerID: "",
		logID: "",
		MJDObservation: "",
	});

	const [isLoading, setLoading] = React.useState("");

	const fields_row1 = [
		{ name: "Exposure Time", value: "Exposure Time" },
		{ name: "CCD Temperature", value: "CCD Temperature" },
		{ name: "Image Type", value: "Image Type" },
		{ name: "Gain", value: "Gain" },
	]
	const fields_row2 = [
		{ name: "Offset", value: "Offset" },
		{ name: "Gamma", value: "Gamma" },
		{ name: "Date Observed", value: "Date Observed" },
		{ name: "Instrument", value: "Instrument" },
	]
	const fields_row3 = [
		{ name: "Row Order", value: "Roworder" },
		{ name: "Object", value: "Object" },
		{ name: "Observation Type", value: "Observation Type" },
		{ name: "AIRM", value: "AIRM" },
	]
	const fields_row4 = [
		{ name: "Observer", value: "Observer" },
		{ name: "Observer ID", value: "Observer ID" },
		{ name: "Log ID", value: "Log ID" },
		{ name: "MJD Observation", value: "MJD Observation" },
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

	// select all entries that are 
	function sendQuery() {
		return (
			//TODO FIX THIS, have correct outputs work to be sent out
			console.log(values),
			console.log("SELECT observationID, target, date, signalToNoise FROM observation WHERE observationID='" + values.observationID)
		)
	}


	return (
		<div>
			<Typography align="left">
				<h2 className="horiz-align">Logsheet</h2>
				<h5 className="horiz-align">Locate previous observations with one or more fields</h5>
			</Typography>

			<Stack className="horiz-align vert-space" direction="row" spacing={3}>
				{fields_row1.map(field_init)}
			</Stack>

			<Stack className="horiz-align vert-space" direction="row" spacing={3}>
				{fields_row2.map(field_init)}
			</Stack>

			<Stack className="horiz-align vert-space" direction="row" spacing={3}>
				{fields_row3.map(field_init)}
			</Stack>


			<Stack className="horiz-align vert-space" direction="row" spacing={3}>
				{fields_row4.map(field_init)}
			</Stack>


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

						handleChange()

						sendQuery(values)

						setTimeout(() => {
							setLoading("");
						}, 1000);
					}}
					loadingPosition="center"
					loading={isLoading === "Start"}
					disabled={isLoading !== "" && isLoading !== "Start"}
				>
					Search
				</LoadingButton>
			</Tooltip>
		</div>
	);
}

export { Search }