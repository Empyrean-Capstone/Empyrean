import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';

import {
	GridRowModes,
	DataGrid,
	GridToolbarContainer,
	GridToolbarColumnsButton,
	GridToolbarFilterButton,
	GridToolbarDensitySelector,
	GridActionsCellItem,
} from '@mui/x-data-grid';

// icons
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CancelIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import { PaperPane } from '../../components/PaperPane/PaperPane'
import { SocketContext } from '../../context/socket';



const initrows = [
	{
		id: "0",
		name: "user",
		username: "user",
		role: "user",
	},

	{
		id: "1",
		name: "jmp",
		username: "testing",
		role: "admin",
	},
]


function EmptyOverlay() {
	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			height: '100%',
		}}>
			<Box><PeopleIcon /></Box>
			<Box sx={{ fontStyle: "italic" }}>There Are No Users In The System</Box>
		</div>
	)
}


function ManageUsers() {
	const tableHeight = 1000

	const [isLogLoading, setLogLoading] = useState(false);
	const [rows, setRows] = React.useState(initrows);
	const [rowModesModel, setRowModesModel] = React.useState({});

	const socket = useContext(SocketContext);


	function GridToolbarAddRow() {
		const handleClick = () => {
			const id = 2;
			const emptyRow = {
				id,
				name: '',
				username: '',
				role: 'user',
			}

			setRows((oldRows) => [...oldRows, emptyRow]);

			setRowModesModel((oldModel) => ({
				...oldModel,
				[id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
			}));
		};

		return (
			<GridToolbarContainer>
				<Button
					sx={{ fontSize: 12 }}
					size="small"
					color="primary"
					startIcon={<PersonAddIcon />}
					onClick={handleClick}
				>
					Add User
				</Button>
			</GridToolbarContainer>
		);
	}

	GridToolbarAddRow.propTypes = {
		setRowModesModel: PropTypes.func.isRequired,
		setRows: PropTypes.func.isRequired,
	};

	function CustomToolbar() {
		return (
			<GridToolbarContainer>
				<GridToolbarAddRow />
				<GridToolbarColumnsButton />
				<GridToolbarFilterButton />
				<GridToolbarDensitySelector />
			</GridToolbarContainer>
		);
	}

	const handleRowEditStart = (event) => {
		event.defaultMuiPrevented = true;
	};

	const handleRowEditStop = (event) => {
		event.defaultMuiPrevented = true;
	};

	const handleEditClick = (id) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
	};

	const handleSaveClick = (id) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
	};

	// TODO: must delete from database
	const handleDeleteClick = (id) => () => {
		setRows(rows.filter((row) => row.id !== id));
	};

	const handleCancelClick = (id) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});

		const editedRow = rows.find((row) => row.id === id);
		if (editedRow.isNew) {
			setRows(rows.filter((row) => row.id !== id));
		}
	};

	const processRowUpdate = (newRow) => {
		const updatedRow = { ...newRow, isNew: false };
		setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
		return updatedRow;
	};

	const handleRowModesModelChange = (newRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const columns = [
		{ field: 'id', headerName: 'ID', width: 90 },
		{
			field: "name",
			headerName: "Name",
			description: "This name will appear in the OBSERVER header of the user's FITS files",
			sortable: true,
			width: 350,
			editable: true,
		},
		{
			field: "username",
			headerName: "Username",
			description: "This username is used for user authentication",
			sortable: true,
			width: 200,
			editable: true,
		},
		{
			field: "role",
			headerName: "Role",
			description: "The user's role determines what features they have access to",
			sortable: true,
			width: 125,
			editable: true,
			type: "singleSelect",

			// set these dynamically:
			// https://github.com/mui/mui-x/issues/3528
			// https://mui.com/x/react-data-grid/column-definition/#special-properties
			valueOptions: [
				{ value: "user", label: "User" },
				{ value: "admin", label: "Admin" },
			],
		},
		{
			field: 'actions',
			type: 'actions',
			headerName: '',
			width: 150,
			align: "left",
			cellClassName: 'actions',
			getActions: ({ id }) => {
				const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

				if (isInEditMode) {
					return [
						<GridActionsCellItem
							icon={<SaveOutlinedIcon />}
							label="Save"
							onClick={handleSaveClick(id)}
							color="inherit"
						/>,
						<GridActionsCellItem
							icon={<CancelIcon />}
							label="Cancel"
							className="textPrimary"
							onClick={handleCancelClick(id)}
							color="inherit"
						/>,
					];
				}

				return [
					<GridActionsCellItem
						icon={<ModeEditOutlineOutlinedIcon />}
						label="Edit"
						className="textPrimary"
						onClick={handleEditClick(id)}
						color="inherit"
					/>,
					<GridActionsCellItem
						icon={<DeleteOutlineOutlinedIcon />}
						label="Delete"
						onClick={handleDeleteClick(id)}
						color="inherit"
					/>,
				];
			},
		},
	];

	//  useEffect(() => {
	//  	socket.on("setUsers", (userDataStr) => {
	//  		let userObjs = JSON.parse(userDataStr)

	//  		//  setLogMatrix(userObjs)
	//  		setLogLoading(false)
	//  	})

	//  	setLogLoading(true)

	//  	socket.emit("retrieveUsers");
	//  }, [socket])

	return (
		<PaperPane>
			<TableContainer>
				<DataGrid
					disableRowSelectionOnClick

					sx={{ height: tableHeight * .9 }}
					autoPageSize={true}
					sortingOrder={["asc", "desc"]}

					rows={rows}
					columns={columns}
					initialState={{
						sorting: {
							sortModel: [{ field: 'Name', sort: 'desc' }],
						},
					}}

					editMode="row"
					rowModesModel={rowModesModel}
					onRowModesModelChange={handleRowModesModelChange}
					onRowEditStart={handleRowEditStart}
					onRowEditStop={handleRowEditStop}
					processRowUpdate={processRowUpdate}

					slots={{
						noRowsOverlay: EmptyOverlay,
						toolbar: CustomToolbar,
					}}
					slotProps={{
						toolbar: { setRows, setRowModesModel },
					}}

					loading={isLogLoading}
				/>
			</ TableContainer>
		</ PaperPane>
	);
}


export { ManageUsers }
