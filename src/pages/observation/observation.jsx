import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2'

import { Observe } from '../../components/Observe'

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

// interesting reading: https://www.developerway.com/posts/react-component-as-prop-the-right-way
function GridComponent({ size, Component }) {
	return (
		<Grid containers item xs={size}>
			<Item><Component /></Item>
		</Grid>
	)
}

function Observation() {
	return (
		<div>
			<Grid container spacing={2}>
				<GridComponent size={8} Component={Observe}></GridComponent>

				<Grid item xs={4}>
					<Item>TODO: Status component</Item>
				</Grid>

				<Grid item xs={12}>
					<Item>TODO: Logsheet component</Item>
				</Grid>

			</Grid>
		</div>
	)
}

export { Observation, Item }
