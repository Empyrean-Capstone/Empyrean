import './style.css'

import Grid from '@mui/material/Unstable_Grid2'

import { PaperPane } from '../../components/PaperPane/PaperPane'
import { Observe } from '../../components/Observe'
import { Status } from '../../components/Status'
import { Logsheet } from '../../components/Logsheet'


function GridComponent({ size, Component, ...props }) {
	return (
		<Grid containers item xs={size}>
			<PaperPane><Component {...props}/></PaperPane>
		</Grid>
	)
}

function Observation() {
	return (
		<div>
			<h2 className="left-gap vert">Shelyak Control</h2>
			<h5 className="left-gap">Use this interface to control the spectrograph</h5>

			<Grid container className="grid-left-gap" spacing={2}>
				<GridComponent size={8} Component={Observe}></GridComponent>
				<GridComponent size={3.85} Component={Status}></GridComponent>
				<GridComponent size={11.85} Component={Logsheet}></GridComponent>
			</Grid>
		</div>
	)
}

export { Observation }
