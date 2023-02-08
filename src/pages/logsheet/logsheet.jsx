import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2'

import { Search } from '../../components/Search/Search'
import { Logsheet } from '../../components/Logsheet/Logsheet'

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

function GridComponent({ size, Component }) {
	return (
		<Grid containers item xs={size}>
			<Item><Component /></Item>
		</Grid>
	)
}


function LogsheetPage() {
return (
	<div>
		<Grid container spacing={2}>
			<GridComponent size={8} Component={Search}></GridComponent>
			<Grid item xs={12}>
			<GridComponent size={12} Component={Logsheet}></GridComponent>
			</Grid>
		</Grid>
	</div>
)
}

export { LogsheetPage, Item }
