import React, { useState, useEffect, useContext } from 'react';
import './style.css'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableVirtuoso } from 'react-virtuoso';
import { SocketContext } from '../../context/socket';

function initNames(obsId, target, progress, date, sigToNoise) {
	return { obsId, target, progress, date, sigToNoise };
}

const columns = [
	{
		width: 80,
		label: 'Observation ID',
		dataKey: 'obsId',
	},
	{
		width: 100,
		label: 'Target',
		dataKey: 'target',
	},
	{
		width: 120,
		label: 'Progress',
		dataKey: 'progress',
	},
	{
		width: 100,
		label: 'Date',
		dataKey: 'date',
	},
	{
		width: 60,
		label: 'Signal-to-Noise',
		dataKey: 'sigToNoise',
	},
];

const VirtuosoTableComponents = {
	Scroller: React.forwardRef((props, ref) => (
		<TableContainer {...props} ref={ref} />
	)),
	Table: (props) => <Table {...props} style={{ borderCollapse: 'separate' }} />,
	TableHead,
	TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
	TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

function fixedHeaderContent() {
	return (
		<TableRow>
			{columns.map((column) => (
				<TableCell
					key={column.dataKey}
					variant="head"
					align={column.numeric || false ? 'right' : 'left'}
					style={{ width: column.width }}
					sx={{
						backgroundColor: 'background.paper',
						fontWeight: 'bold'
					}}
				>
					{column.label}
				</TableCell>
			))}
		</TableRow>
	);
}

function rowContent(_index, row) {
	return (
		<React.Fragment>
			{columns.map((column) => (
				<TableCell
					key={column.dataKey}
					align={column.numeric || false ? 'right' : 'left'}
				>
					{row[column.dataKey]}
				</TableCell>
			))}
		</React.Fragment>
	);
}

function Logsheet() {
	const [logMatrix, setLogMatrix] = useState([]);

	const socket = useContext(SocketContext);

	useEffect(() => {
		socket.on("setObservations", (logsheetData) => {
			setLogMatrix(logsheetData)
		})

		socket.emit("retrieveObservations", {});
	}, [socket])

	socket.on("prependObservation", (newLogArr) => {
		// https://reactjs.org/docs/hooks-reference.html#functional-updates

		setLogMatrix([newLogArr, ...logMatrix])
	})

	const rows = Array.from({ length: logMatrix.length }, (_, index) => {
		const row = logMatrix[index];
		return initNames(...row);
	});

	return (
		<TableContainer style={{ height: 400 }}>
			<h2 className="horiz-align">Logsheet</h2>
			<h5 className="horiz-align">Current sheet: 20220101.001</h5>

			<TableVirtuoso
				data={rows}
				components={VirtuosoTableComponents}
				fixedHeaderContent={fixedHeaderContent}
				itemContent={rowContent}
			/>
		</TableContainer>
	);
}

export { Logsheet }
