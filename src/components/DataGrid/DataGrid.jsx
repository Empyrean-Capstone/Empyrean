import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';

import {
	gridPageCountSelector,
	gridPageSelector,
	useGridApiContext,
	useGridSelector,
} from '@mui/x-data-grid';

/**
 * Creates a grid with an empty overlay using
 *     specific style formats.
 * @props {JSX element} Element to be put into a
 *     grid.
 * @return {JSX element} Returns the original element
 *     within a stylized grid.
 */
function GridEmptyOverlay(props) {
	const icon = props.icon
	const text = props.text

	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			height: '100%',
		}}>
			<Box>{icon}</Box>
			<Box sx={{ fontStyle: "italic" }}>{text}</Box>
		</div>
	)
}

/**
 * Creates a Pagination grid using an element
 *     and specific style formats.
 * @return {JSX element} Returns a pagination grid.
 */
function GridPagination() {
	const apiRef = useGridApiContext();
	const page = useGridSelector(apiRef, gridPageSelector);
	const pageCount = useGridSelector(apiRef, gridPageCountSelector);

	return (
		<Pagination
			sx={(theme) => ({ padding: theme.spacing(1.5, 0) })}
			color="primary"
			count={pageCount}
			page={page + 1}
			onChange={(event, value) => apiRef.current.setPage(value - 1)}
		/>
	);
}


export { GridEmptyOverlay, GridPagination }
