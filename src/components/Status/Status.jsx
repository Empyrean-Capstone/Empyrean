import React, { useCallback, useContext, useEffect, useState } from 'react';

import './style.css'
import { SocketContext } from '../../context/socket';

import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


function makeChipRow(row) {
	return (
		<TableRow
			key={row.id}
			sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
		>
			<TableCell sx={{ fontWeight: 'bold' }} padding="none" component="th" scope="row">{row.statusName}</TableCell>
			<TableCell align="center">
				< Chip
					sx={{ fontWeight: 'bold' }}
					size="small"
					color={row.color}
					label={row.statusValue}
				/>
			</TableCell>
		</TableRow>
	)
}


function Status() {
	const socket = useContext(SocketContext);

	const [stateData, setState] = useState({
		isLoading: true,
		data: []
	})

	const updateData = useCallback((updates) => {
		let tempData = stateData.data;

		for (let i in updates) {
			let updatedKey = false;

			const cur_obj = updates[i]
			const cur_id = cur_obj.id

			for (let index in tempData) {
				if (tempData[index].id === cur_id) {
					tempData[index] = updates[i]
					updatedKey = true;
				}
			}
			// Incase the status being updated is a new status type
			if (!updatedKey) {
				tempData.push(updates[i]);
			}
		}
		setState({ loading: false, data: tempData })
	}, [stateData.data]);

	socket.on('frontend_update_status', updateData);

	useEffect(() => {
		fetch('/api/status/index').then(res => res.json()).then((result) => {
			setState({ isLoading: false, data: result });
		})
	}, []);

	return (
		<TableContainer>
			<h2 className="horiz-align vert-space">Spectrograph Status</h2>

			<Table sx={{ minWidth: 150 }}>
				<TableHead>
					<TableRow>
						<TableCell sx={{ fontWeight: "bold" }} padding="none">SYSTEM</TableCell>
						<TableCell sx={{ fontWeight: "bold" }} padding="none" align="center">STATUS</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{stateData.data.map(makeChipRow)}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export { Status }
