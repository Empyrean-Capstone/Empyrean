import React, { useState, useEffect, useContext } from 'react';

import { SocketContext } from '../../context/socket';
import './style.css'

import TableContainer from '@mui/material/TableContainer';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';


const columns = [
	{
		field: 'id',
		headerName: 'Observation ID',
		width: 300,
	},
	{
		field: 'progress',
		headerName: 'Progress',
		width: 300,
	},
	{
		field: 'target',
		headerName: 'Target',
		width: 600,
	},
	{
		field: 'date',
		headerName: 'Date',
		width: 600,
	},
	{
		field: 'sigToNoise',
		headerName: 'Signal-to-Noise',
		width: 300
	},
];


function Logsheet() {
	const tableHeight = 800
	const [logMatrix, setLogMatrix] = useState([]);
	const socket = useContext(SocketContext);

	useEffect(() => {
		socket.on("setObservations", (logsheetData) => {
			setLogMatrix(logsheetData)
		})

		socket.emit("retrieveObservations", {});
	}, [socket])

	socket.on("prependNewObservation", (newLogArr) => {
		// https://reactjs.org/docs/hooks-reference.html#functional-updates

		setLogMatrix([newLogArr, ...logMatrix])
	})

	socket.on("updateNewObservation", (updatedLog) => {
		let updatedMatrix = [...logMatrix]
		updatedMatrix[0] = updatedLog

		setLogMatrix(updatedMatrix)
	})

	function initNames(id, target, progress, date, sigToNoise) {
		return { id, target, progress, date, sigToNoise };
	}

	const rows = Array.from({ length: logMatrix.length }, (_, index) => {
		const row = logMatrix[index];
		return initNames(...row);
	});

	return (
		<TableContainer style={{ height: tableHeight }}>
			<h2 className="horiz-align">Logsheet</h2>
			<h5 className="horiz-align">Current sheet: 20220101.001</h5>

			<div style={{ height: tableHeight * .9, width: '100%' }}>
				<DataGrid rows={rows} columns={columns} slots={{ toolbar: GridToolbar }}/>
			</div>
		</TableContainer>
	);
}

export { Logsheet }
