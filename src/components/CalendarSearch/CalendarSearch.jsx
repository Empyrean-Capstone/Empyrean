import React, { useState, useContext } from 'react';

import { SocketContext } from '../../context/socket';
import './style.css'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TableContainer from '@mui/material/TableContainer';


function CalendarSearch() {
	const [logMatrix, setLogMatrix] = useState([]);
	const [selectedStartDate, setSelectedStartDate] = useState(null)
	const [selectedEndDate, setSelectedEndDate] = useState(null)
	const socket = useContext(SocketContext);

	socket.on("updateObservations", (newLogJson) => {
		let newLogObjs = JSON.parse(newLogJson)
		let updatedMatrix = {}

		Object.entries(newLogObjs).forEach(([id, incomingData]) => {
			let curLog = logMatrix[id]

			updatedMatrix[id] = { ...curLog, ...incomingData }
			setLogMatrix((prevMatrix) => ({ ...prevMatrix, ...updatedMatrix }))
		})

	})

	const handleClick = (e) => {
		e.preventDefault();
		socket.emit("retrieveDateObservations", {startDay: selectedStartDate.$D, startMonth: selectedStartDate.$M, startYear: selectedStartDate.$y,  
			endDay: selectedEndDate.$D, endMonth: selectedEndDate.$M, endYear: selectedEndDate.$y})
		}

	return (
		<TableContainer>
			<h2 className="horiz-align">Calendar Search</h2>
			<h5 className="horiz-align">Query by Date</h5>

			<Stack className="horiz-align vert-space" direction="row" spacing={2}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DatePicker className="left-align" 
						renderInput={(params) => <TextField {...params} />}
						value={selectedStartDate}
						format="YYYY-MM-DD"
						disableFuture="true"
						slotProps={{
							textField: {
								helperText: 'Start Date',
							},
						}}
						onChange={(newValue) => {
							setSelectedStartDate(newValue)
						}} 
					/>
				</LocalizationProvider>

				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DatePicker 
						renderInput={(params) => <TextField {...params} />}
						value={selectedEndDate}
						format="YYYY-MM-DD"
						disableFuture="true"
						slotProps={{
							textField: {
								helperText: 'End Date',
							},
						}}
						onChange={(newValue) => {
							setSelectedEndDate(newValue)
						}} 
					/>
				</LocalizationProvider>
			</Stack>

			<Button variant="contained" color="success" onClick={handleClick}>Submit</Button>
		</TableContainer >
	);
}

export { CalendarSearch }
