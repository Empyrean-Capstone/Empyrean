import React, { useState, useEffect, useContext } from 'react';

import { SocketContext } from '../../context/socket';
import './style.css'

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import TableContainer from '@mui/material/TableContainer';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

// icons
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import PendingIcon from '@mui/icons-material/Pending';
import CheckIcon from '@mui/icons-material/Check';


function getChipProps(params) {
	const chipProps = {
		"Pending": { color: "primary", icon: <PendingIcon /> },
		"In Progress": { color: "warning", icon: <DownloadForOfflineIcon /> },
		"Complete": { color: "success", icon: <CheckIcon /> },
	}

	let label = params.value
	let props = chipProps[label]

	return (
		<Chip icon={props.icon} label={label} color={props.color} variant="outlined" />
	)
}


function showProgress(params) {
	if (params.value === "None") {
		return <LinearProgress sx={{ width: "80%" }} />
	}

	return params.value
}


const columns = [
	{
		field: 'id',
		headerName: 'Observation ID',
		width: 300,
		valueGetter: ({ value }) => value && Number(value),
	},

	{
		field: 'target',
		headerName: 'Target',
		width: 300,
	},

	{
		field: 'progress',
		headerName: 'Progress',
		width: 240,
		renderCell: (params) => {
			return getChipProps(params)
		}
	},

	{
		field: 'date',
		headerName: 'Date',
		width: 300,
		renderCell: (params) => {
			return showProgress(params)
		}
	},

	{
		field: 'sigToNoise',
		headerName: 'Signal-to-Noise',
		width: 300,
		renderCell: (params) => {
			return showProgress(params)
		}
	},
];


function EmptyOverlay() {
	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			height: '100%',
		}}>
			<Box sx={{ fontSize: 40 }}>📭</Box>
			<Box sx={{ fontStyle: "italic" }}>There Are No Observations In This Logsheet...</Box>
		</div>
	)
}


function Logsheet() {
	const tableHeight = 1000
	const [logMatrix, setLogMatrix] = useState([]);
	const [isLogLoading, setLogLoading] = useState(false);
	const socket = useContext(SocketContext);

	useEffect(() => {
		socket.on("setObservations", (logsheetDataStr) => {
			let logObjs = JSON.parse(logsheetDataStr)

			setLogMatrix(logObjs)
			setLogLoading(false)
		})

		setLogLoading(true)
		socket.emit("retrieveObservations");
	}, [socket])

	socket.on("updateObservations", (newLogJson) => {
		let newLogObjs = JSON.parse(newLogJson)
		let updatedMatrix = {}

		Object.entries(newLogObjs).forEach(([id, incomingData]) => {
			let curLog = logMatrix[id]

			updatedMatrix[id] = { ...curLog, ...incomingData }
			setLogMatrix((prevMatrix) => ({ ...prevMatrix, ...updatedMatrix }))
		})

	})


	const logRows = Object.entries(logMatrix).map(([id, data]) => {
		return { ...data, "id": id }
	})

	return (
		<TableContainer>
			<h2 className="horiz-align">Logsheet</h2>
			<h5 className="horiz-align">Current sheet: 20220101.001</h5>

			<DataGrid
				sx={{ height: tableHeight * .9 }}
				autoPageSize={true}
				sortingOrder={["asc", "desc"]}
				rows={logRows}
				columns={columns}
				slots={{
					noRowsOverlay: EmptyOverlay,
					toolbar: GridToolbar
				}}
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
