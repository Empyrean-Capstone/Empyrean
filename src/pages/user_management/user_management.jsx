import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import TableContainer from '@mui/material/TableContainer';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import {
	DataGrid,
	GridActionsCellItem,
	GridEditInputCell,
	GridRowModes,
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarFilterButton,
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


const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


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


const StyledTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	'& .MuiTooltip-arrow': {
		color: theme.palette.error.main,
	},
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.error.main,
		color: theme.palette.error.contrastText,
		whiteSpace: "pre-line",
		fontSize: 11.5
	},
}));


// Not passing props correctly:
// https://github.com/mui/material-ui/issues/33476
function renderEditName(props) {
	const { error, errormessage } = props;

	return (
		<StyledTooltip
			arrow
			open={!!error}
			title={errormessage}
		>
			<GridEditInputCell {...props} />
		</StyledTooltip>
	)
}


function ManageUsers() {
	const tableHeight = 1000

	const [canAddUser, setCanAddUser] = useState(true);
	const [isLogLoading, setLogLoading] = useState(false);
	const [rowModesModel, setRowModesModel] = React.useState({});
	const [rows, setRows] = React.useState([]);
	const [snackbar, setSnackbar] = React.useState(null);

	const socket = useContext(SocketContext);

	const handleCloseSnackbar = () => setSnackbar(null);


	function GridToolbarAddRow() {
		const handleClick = () => {
			setCanAddUser(false)

			const id = -1;
			const emptyRow = {
				id,
				name: '',
				username: '',
				password: '',
				isadmin: false,
				isNew: true
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
					disabled={!canAddUser}
				>
					Add User
				</Button>
			</GridToolbarContainer>
		);
	}

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
		setCanAddUser(true)
		event.defaultMuiPrevented = true;
	};

	const handleEditClick = (id) => () => {
		setCanAddUser(false)
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
	};

	const handleSaveClick = (id) => () => {
		setCanAddUser(true)
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
	};

	const handleDeleteClick = (id) => () => {
		const deleteUser = async (rowID) => {
			try {
				let deleteRes = await axios.post(
					`http://localhost:5000/users/delete/`,
					{ id: rowID },
					{
						withCredentials: true
					}
				)

				if (deleteRes.status === 200) {
					setSnackbar({
						children: `User #${rowID} deleted`,
						severity: 'success',
					});
				}
			}
			catch (err) {
				console.log(err)
				setSnackbar({
					children: `User #${rowID} deletion failed`,
					severity: 'error',
				});
			}
		};

		if (rows.length > 1) {
			deleteUser(id)
			setRows(rows.filter((row) => row.id !== id));
		}
		else {
			setSnackbar({
				children: `Deletion prevented: must have at least one user`,
				severity: 'error',
			});
		}
	};

	const handleCancelClick = (id) => () => {
		setCanAddUser(true)
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});

		const row = rows.find((row) => row.id === id);

		if (row.isNew) {
			setRows(rows.filter((row) => row.id !== id));
		}
	};

	const processRowUpdate = (newRow) => {
		const updateUser = async (updatedRow) => {
			try {
				let updateRes = await axios.post(
					`http://localhost:5000/users/update/`,
					updatedRow,
					{
						withCredentials: true
					}
				)

				if (updateRes.status === 200) {
					setSnackbar({
						children: `User #${newRow.id} saved`,
						severity: 'success',
					});
				}
			}
			catch (err) {
				console.log(err)
				setSnackbar({
					children: `User #${newRow.id} save failed`,
					severity: 'error',
				});
			}
		};

		let rowData = {
			name: newRow.name,
			username: newRow.username,
			password: newRow.password,
			isadmin: newRow.isadmin,
		}

		updateUser(rowData)

		const updatedRow = { ...newRow, isNew: false };
		setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

		return updatedRow;
	};

	const handleProcessRowUpdateError = React.useCallback((error) => {
		setSnackbar({ children: error.message, severity: 'error' });
	}, []);

	const handleRowModesModelChange = (newRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};


	function validateStrLen(str, len) {
		if (str === null || str.length < len) return true
		return null
	}

	function validateName(cur_id, username) {
		const existingUsernames = rows.map((row) => {
			if (cur_id !== row.id) return row.username

			return null
		})
		return existingUsernames.includes(username)
	}


	const columns = [
		{
			field: "id",
			headerName: "ID",
			description: "User's ID. Indelible.",
			sortable: true,
			width: 200,
		},
		{
			field: "name",
			headerName: "Name",
			description: "This name will appear in the OBSERVER header of the user's FITS files",
			sortable: true,
			width: 350,
			editable: true,
			renderEditCell: renderEditName,
			preProcessEditCellProps: async (params) => {
				let hasError = validateStrLen(params.props.value, 1)

				return {
					...params.props,
					error: hasError,
					errormessage: "Ensure that the user's name is:\n• more than 0 characters long"
				};
			}
		},
		{
			field: "username",
			headerName: "Username",
			description: "This username is used for user authentication",
			sortable: true,
			width: 200,
			editable: true,
			renderEditCell: renderEditName,
			preProcessEditCellProps: async (params) => {
				let hasError = null

				if (validateStrLen(params.props.value, 1) || validateName(params.props.value)) {
					hasError = true
				}

				return {
					...params.props,
					error: hasError,
					errormessage: "Ensure that the user's username is:\n• more than 0 characters long\n• unique",
				};
			}
		},
		{
			field: "password",
			headerName: "Password",
			sortable: true,
			width: 200,
			editable: true,
			renderEditCell: renderEditName,
			preProcessEditCellProps: async (params) => {
				let hasError = null
				hasError = validateStrLen(params.props.value, 5)

				return {
					...params.props,
					error: hasError,
					errormessage: "Ensure that the user's password is:\n• more than 5 characters long"
				};
			}
		},
		{
			field: "isadmin",
			headerName: "Is Admin?",
			description: "The user's role determines what features they have access to",
			sortable: true,
			width: 125,
			editable: true,
			type: 'boolean',
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

	function initRows(id, username, name, password, isadmin) {
		return { id, name, username, password, isadmin }
	}

	useEffect(() => {
		socket.on("setUsers", (userDataStr) => {
			let users = JSON.parse(userDataStr)

			let userMatrix = users.map(function(arr) {
				return initRows(...arr)
			})

			setRows(userMatrix)
			setLogLoading(false)
		})

		setLogLoading(true)

		socket.emit("retrieveUsers");
	}, [socket])


	return (
		<PaperPane>
			<TableContainer
				sx={{
					'& .MuiDataGrid-cell--editable': {
						'& .MuiInputBase-root': {
							height: '100%',
						},
					},
					'& .Mui-error': {
						backgroundColor: `rgb(126,10,15, 0.1)`,
						color: '#750f0f',
					},
				}}
			>
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
					onProcessRowUpdateError={handleProcessRowUpdateError}

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
			{!!snackbar && (
				<Snackbar
					open
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					onClose={handleCloseSnackbar}
					autoHideDuration={2500}
				>
					<Alert {...snackbar} onClose={handleCloseSnackbar} />
				</Snackbar>
			)}
		</ PaperPane>
	);
}


export { ManageUsers }
