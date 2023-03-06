import React, {useState, useEffect, useContext} from 'react';
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
import {SocketContext} from '../../context/socket';

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

function Logsheet() {
    const [messages, setMessages] = useState([
		['ORD.00925', 'VY Canis Majoris', 'Complete', '19 min ago', '$209,465'],
		['ORD.10000', 'Mu Cephei', 'Complete', '1 day, 3 hours ago', '$0.50'],
		['ORD.12345', 'Antares', 'Complete', '3 months ago', '$100,000,000'],
		['ORD.12346', 'Antares', 'Complete', '3 months ago', '$100,000,000'],
		['ORD.12347', 'Antares', 'Complete', '3 months ago', '$100,000,000'],
		['ORD.12348', 'Antares', 'Complete', '3 months ago', '$100,000,000'],
		['ORD.12349', 'Antares', 'Complete', '3 months ago', '$100,000,000'],
		['ORD.12350', 'Antares', 'Complete', '3 months ago', '$100,000,000'],
		['ORD.12351', 'Antares', 'Complete', '3 months ago', '$100,000,000'],
		['ORD.12352', 'Antares', 'Complete', '3 months ago', '$100,000,000'],
	]);

	const socket = useContext( SocketContext );
    useEffect(() => {

        socket.on("retrieveLogsheetData", (logsheetData) => {
            setMessages(logsheetData)
        })

		socket.on("newObservation", (logsheetData) => {
			// setMessages([logsheetData, ...messages])
			// https://reactjs.org/docs/hooks-reference.html
			// Look at functional updates, this is where I'm getting this
			setMessages( formerMessages => {
				formerMessages = [formerMessages, ...logsheetData]
			})
		})

		socket.emit("retrieveLogsheetData", {});
		
    }, [socket])

	const rows = Array.from({ length: messages.length }, (_, index) => {
		const row = messages[index];
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
