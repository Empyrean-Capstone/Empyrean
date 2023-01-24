import React from 'react';
import './style.css'

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Typography } from '@mui/material';


function LinearProgressWithLabel(props) {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Box sx={{ minWidth: 35 }}>
				<Typography variant="body2" color="text.secondary">{`${Math.round(
					props.value,
				)}%`}</Typography>
			</Box>
			<Box sx={{ width: '100%', mr: 1 }}>
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

function LinearWithValueLabel() {
	const [progress, setProgress] = React.useState(0);

	React.useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 5));
		}, 800);
		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<Box sx={{ width: '100%' }}>
			<LinearProgressWithLabel value={progress} />
		</Box>
	);
}


function MakeChipRows() {
	function createData(name, status, color) {
		return { name, status, color};
	}

	const chip_rows = [
		createData("Mirror", "Object", "info"),
		createData("LED", "Off", "warning"),
		createData("Thorium Argon", "On", "success"),
		createData("Tungston", "Off",  "warning"),
		createData("Camera", "Idle", "info"),
	];

	function makeChipRow(row) {
		return (
			<TableRow
				key={row.name}
				sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
			>
				<TableCell sx={{ fontWeight: 'bold' }} component="th" scope="row">{row.name}</TableCell>
				<TableCell align="center">
					<Chip sx={{ fontWeight: 'bold' }} size="small" color={row.color} label={row.status} />
				</TableCell>
			</TableRow>
		)
	}

	return (chip_rows.map(makeChipRow))
}

function MakeProgRows() {
	function createData(name, status) {
		return { name, status };
	}
	const prog_rows = [
		createData("Current Exposure",),
		createData("Remaining Exposures",),
	]

	function makeProgRow(row) {
		return (
			<TableRow
				key={row.name}
				sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
			>
				<TableCell sx={{ fontWeight: 'bold' }} component="th" scope="row">{row.name}</TableCell>
				<TableCell>
					<LinearWithValueLabel />
				</TableCell>
			</TableRow>
		)
	}

	return (prog_rows.map(makeProgRow))
}

function Status() {

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }}>

				<TableHead>
					<TableRow>
						<TableCell sx={{ fontSize: "large", fontWeight: 'bold' }}>System</TableCell>
						<TableCell sx={{ fontSize: "large", fontWeight: 'bold' }} align="center">Status</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					<MakeChipRows />
					<MakeProgRows />
				</TableBody>

			</Table>
		</TableContainer>
	)

}

export { Status }
