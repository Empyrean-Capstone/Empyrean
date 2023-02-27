import './style.css'

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2'
import { Typography } from '@mui/material';

import { Observe } from '../../components/Observe'
import { Status } from '../../components/Status'
import { Logsheet } from '../../components/Logsheet'

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

// interesting reading: https://www.developerway.com/posts/react-component-as-prop-the-right-way
function GridComponent({ size, Component, ...props }) {
	return (
		<Grid containers item xs={size}>
			<Item><Component {...props}/></Item>
		</Grid>
	)
}

function Observation() {
	return (
		<div>
			<Typography align="left">
				<h2 className="left-gap vert">Shelyak Control</h2>
				<h5 className="left-gap">Use this interface to control the spectrograph</h5>
			</Typography>

			<Grid container className="grid-left-gap" spacing={2}>
				<GridComponent size={8} Component={Observe}></GridComponent>
				<GridComponent size={3.85} Component={Status}></GridComponent>
				<GridComponent size={11.85} Component={Logsheet}></GridComponent>
			</Grid>
		</div>
	)
}

export { Observation, Item }
