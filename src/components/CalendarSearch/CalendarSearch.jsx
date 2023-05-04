import React, { useState, useContext } from 'react';

import { SocketContext } from '../../context/socket';
import './style.css'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

/**
 * Creates a way to search the logsheet component via two dates,
 *     returning all observations between them.
 * @return {JSX element} Returns a valid component to be used
 *     within the logsheet page.
 */
function CalendarSearch() {
	const [selectedStartDate, setSelectedStartDate] = useState(null)
	const [selectedEndDate, setSelectedEndDate] = useState(null)
	const socket = useContext(SocketContext);

	const handleClick = () => {
		socket.emit("retrieveDateObservations", {
			startDay: selectedStartDate["$D"],
			startMonth: selectedStartDate["$M"],
			startYear: selectedStartDate["$y"],
			endDay: selectedEndDate["$D"],
			endMonth: selectedEndDate["$M"],
			endYear: selectedEndDate["$y"],
		})
	}
	
	/**
	 * Provides a way to select a date from a provided
	 *     calender.
	 * @props {const date} Takes in a start and\or end date
	 * @return {JSX element} Returns a valid element used
	 *     within this component
	 */
	function DateSelect(props) {
		return (
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DatePicker
					value={props.value}
					format="YYYY-MM-DD"
					disableFuture={true}
					minDate={props.minDate}
					slotProps={{
						textField: {
							helperText: props.helperText,
							size: "small"
						}
					}}
					onChange={props.onChange}
				/>
			</LocalizationProvider>
		)
	}

	return (
		<>
			<h2 className="horiz-align">Advanced Observation Search</h2>
			<h5 className="horiz-align">Query the observation logsheet</h5>

			<Stack className="horiz-align vert-space" direction="row" spacing={2}>

				<DateSelect
					helperText={"Start Date"}
					minDate={null}
					value={selectedStartDate}
					onChange={(newValue) => setSelectedStartDate(newValue)}
				/>

				<DateSelect
					helperText={"End Date"}
					minDate={selectedStartDate}
					value={selectedEndDate}
					onChange={(newValue) => setSelectedEndDate(newValue)}
				/>
			</Stack>

			<Stack className="horiz-align vert-space" direction="row" spacing={2}>
				<Button variant="contained" color="success" onClick={handleClick}>Submit</Button>
			</Stack>

		</>
	);
}

export { CalendarSearch }
