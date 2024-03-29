import './style.css'

import Grid from '@mui/material/Unstable_Grid2'

import { PaperPane } from '../../components/PaperPane/PaperPane'
import { Observe } from '../../components/Observe'
import { Status } from '../../components/Status'
import { Logsheet } from '../../components/Logsheet'

/**
 * Creates a grid with a given size, component, and optional properties.
 * @param {int | JSX element | JSX element} Takes in a integer size for 
 *     the grid, the component to be put into a grid, and any additional
 *     properties.
 * @return {JSX element} Returns a valid JSX element as a grid.
 */
function GridComponent({ size, Component, ...props }) {
	return (
		<Grid containers item xs={size}>
			<PaperPane><Component {...props}/></PaperPane>
		</Grid>
	)
}

/**
 * Creates the Observation Page
 * @return {JSX element} Returns a valid JSX element as the observation
 *     page.
 */
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
