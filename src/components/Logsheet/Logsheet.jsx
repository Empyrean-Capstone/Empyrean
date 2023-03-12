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
		width: 240,
	},
	{
		field: 'target',
		headerName: 'Target',
		width: 600,
	},
	{
		field: 'date',
		headerName: 'Date',
		width: 300,
	},
	{
		field: 'sigToNoise',
		headerName: 'Signal-to-Noise',
		width: 300
	},
];


function Logsheet() {
	const tableHeight = 1000
	const [logMatrix, setLogMatrix] = useState([]);
	const [isLogLoading, setLogLoading] = useState(false);
	const socket = useContext(SocketContext);

	useEffect(() => {
		socket.on("setObservations", (logsheetData) => {
			setLogMatrix(logsheetData)
			setLogLoading(false)
		})

		setLogLoading(true)
		socket.emit("retrieveObservations", {});
	}, [socket])

	socket.on("prependNewObservation", (newLogArr) => {
		// https://reactjs.org/docs/hooks-reference.html#functional-updates

		setLogMatrix([newLogArr, ...logMatrix])
	})

	socket.on("updateNewObservation", (updatedLogArr) => {
		let updatedMatrix = [...logMatrix]
		updatedMatrix[0] = updatedLogArr

		setLogMatrix(updatedMatrix)
	})

	socket.on("removeNewObservation", () => {
		// https://reactjs.org/docs/hooks-reference.html#functional-updates
		let rmMatrix = logMatrix.slice(1)
		setLogMatrix(rmMatrix)
	})

	function initNames(id, target, progress, date, sigToNoise) {
		return { id, target, progress, date, sigToNoise };
	}

	const rows = Array.from({ length: logMatrix.length }, (_, index) => {
		const row = logMatrix[index];
		return initNames(...row);
	});

	return (
		<TableContainer>
			<h2 className="horiz-align">Logsheet</h2>
			<h5 className="horiz-align">Current sheet: 20220101.001</h5>

			<DataGrid
				sx={{ height: tableHeight * .9 }}
				autoPageSize={true}
				sortingOrder={["asc", "desc"]}
				rows={rows}
				columns={columns}
				slots={{ toolbar: GridToolbar }}
				initialState={{
					sorting: {
						sortModel: [{ field: 'id', sort: 'desc' }],
					},
				}}
				loading={isLogLoading}
			/>
		</TableContainer >
	);
}

export { Logsheet }
