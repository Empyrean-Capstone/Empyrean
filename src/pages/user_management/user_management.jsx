import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { GridEmptyOverlay, GridPagination } from '../../components/DataGrid';
import { PaperPane } from '../../components/PaperPane/PaperPane'
import { SocketContext } from '../../context/socket';

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
	useGridApiRef
} from '@mui/x-data-grid';

// icons
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CancelIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';


const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


/**
 * Creates an empty overlay grid if there are no users in the system.
 * @return {JSX element} Returns an empty JSX element grid.
 */
function EmptyOverlay() {
	return (
		<GridEmptyOverlay
			icon=<PeopleIcon />
			text="There Are No Users In The System"
		/>
	)
}

// Defines the style color, background color, and font size.
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

/**
 * Renders an error message.
 * @param {JSX element} Takes in a field that has an error attached to it.
 * @note Not passing props correctly:
 * @see https://github.com/mui/material-ui/issues/33476
 * @return {JSX element} Returns a valid JSX element containing the error
 *     message.
 */
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


/**
 * Creates the User Management page.
 * @return {JSX element} Returns a valid JSX element containing the
 *     user management page.
 */
function ManageUsers() {
	const apiRef = useGridApiRef();
	const tableHeight = 1000

	const [canAddUser, setCanAddUser] = useState(true);
	const [isLogLoading, setLogLoading] = useState(false);
	const [rowModesModel, setRowModesModel] = React.useState({});
	const [rows, setRows] = React.useState([]);
	const [snackbar, setSnackbar] = React.useState(null);

	const socket = useContext(SocketContext);

	const handleCloseSnackbar = () => setSnackbar(null);

	/**
	 * Creates a user for the user table.
	 * @return {JSX element} Returns a valid JSX element containing the add
	 *     user button.
	 */
	function GridToolbarAddRow() {
		const handleClick = () => {
			setCanAddUser(false)

			// Sends a get request to the users for permission to create.
			const createUser = async () => {
				try {
					let createRes = await axios.get(
						`/api/users/`,
						{
							withCredentials: true
						}
					)

					if (createRes.status === 201) {
						let newRow = initRows(...createRes.data)

						setRows((oldRows) => [...oldRows, newRow]);

						newRow["isNew"] = true

						setRowModesModel((oldModel) => ({
							...oldModel,
							[newRow.id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
						}));

						setCanAddUser(true)

						setSnackbar({
							children: `User #${newRow.id} created`,
							severity: 'success',
						});
					}
				}
				catch (err) {
					console.log(err)
					setSnackbar({
						children: `User creation failed`,
						severity: 'error',
					});
				}
			};

			createUser()
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

	/**
	 * Creates a custom toolbar using a grid.
	 * @return {JSX element} Returns a JSX element containing the
	 *     custom toolbar.
	 */
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

	/**
	 * Validates a row when it is updated.
	 * @note There is currently no means of manualing triggering
	 *     preProcessEditCellProps, which is the canonical way
	 *     of validating MUI data grid rows. This callback only
	 *     fires on text change, that we're aware of. We can force
	 *     it to run by manually setting a cell values.
	 * @see https://github.com/mui/mui-x/issues/5009
	 */
	function validateOnLeave(id) {
		const row = apiRef.current.getRowWithUpdatedValues(id)

		Object.entries(row).map(([key, value]) => (
			apiRef.current.setEditCellValue({ id: id, field: key, value: value })
		))
	}

	const handleRowEditStart = (event) => {
		event.defaultMuiPrevented = true;
	};

	const handleRowEditStop = (event) => {
		const id = event.id
		validateOnLeave(id)

		setCanAddUser(true)
		event.defaultMuiPrevented = true;
	};

	const handleEditClick = (id) => () => {
		setCanAddUser(false)
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
	};

	const handleSaveClick = (id) => () => {
		validateOnLeave(id)

		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
		setCanAddUser(true)
	};

	// Sends a post request to delete a user from the database.
	const deleteUser = async (rowID) => {
		try {
			let deleteRes = await axios.post(
				`/api/users/delete/`,
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

	// Handles trying to delete the last user or deleting any other user.
	const handleDeleteClick = (id) => () => {
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

	// Handles cancelling an operation.
	const handleCancelClick = (id) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});

		const row = rows.find((row) => row.id === id);

		if (row.isNew) {
			deleteUser(id)
			setRows(rows.filter((row) => row.id !== id));
		}

		setCanAddUser(true)
	};

	// Sends a post request to update user rows.
	const processRowUpdate = (newRow) => {
		const updateUser = async (updatedRow) => {
			try {
				let updateRes = await axios.post(
					`/api/users/update/`,
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
			id: newRow.id,
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


	/**
	 * Checks string length is valid
	 * @param {string | int} Takes in a string and integer length.
	 * @return {Boolean | NULL} Returns true if the str is null or less than
	 *     the passed in length, or null if not.
	 */
	function validateStrLen(str, len) {
		if (str === null || str.length < len) return true
		return null
	}

	/**
	 * Confirms a string is unique.
	 * @param {int | string | string} Takes in the current ID, the string
	 *     to check, and the column name.
	 * @return {NULL | string } Returns null if the current ID is not in the
	 *     columns, returns the string if it already exists.
	 */
	function ensureStrUnique(curID, str, columnName) {
		const existingValues = rows.map((row) => {
			if (curID !== row.id) return row[columnName]

			return null
		})

		return existingValues.includes(str)
	}

	/**
	 * Defines all of the columns for user fields. This includes
	 *     several advanced features depending on the column.
	 * @return {JSX element} Contains several return values for some
	 *     columns.
	 */
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

				if (
					validateStrLen(params.props.value, 1) ||
					ensureStrUnique(params.id, params.props.value, "username")
				) {
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
			description: "Allows the user to administer other users",
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

	/**
	 * Initializes Rows in the grid.
	 * @param {int | string | string | string | boolean} Takes in various fields
	 *     each with proper values.
	 * @return {int | string | string | string | boolean} Returns the passed in values
	 *     as a valid row.
	 */
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

					apiRef={apiRef}
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
						pagination: GridPagination,
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
