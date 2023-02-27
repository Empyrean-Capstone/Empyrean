import React, {useState, useEffect} from 'react';
import './style.css'

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableVirtuoso } from 'react-virtuoso';
import { Typography } from '@mui/material';

import { io } from 'socket.io-client';

let socket;

function LinearProgressWithLabel(props) {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Box sx={{ minWidth: 35 }}>
				<Typography variant="body2" color="text.secondary">{`${Math.round(
					props.value,
				)}%`}</Typography>
			</Box>
			<Box sx={{ width: '55%', mr: 1 }}>
				<LinearProgress variant="determinate" {...props} />
			</Box>
		</Box>
	);
}

LinearProgressWithLabel.propTypes = {
	/**
	 * The value of the progress indicator for the determinate and buffer variants.
	 * Value between 0 and 100.
	 */
	value: PropTypes.number.isRequired,
};

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

function requestData() {
	socket.emit("retrieveLogsheetData", {name: "test"});
}


function Logsheet() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // open socket connection
        // create websocket
        socket = io();

        socket.on("retrieveLogsheetData", (chat) => {
            setMessages(chat)
        })

		socket.emit("retrieveLogsheetData", {});
        // when component unmounts, disconnect
        return (() => {
            socket.disconnect()
        })
    }, [])

	const rows = Array.from({ length: messages.length }, (_, index) => {
		const row = messages[index];
		return initNames(...row);
	});

	
	return (
		<TableContainer style={{ height: 400 }}>
			<button onClick={requestData}>Request Data</button>
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
