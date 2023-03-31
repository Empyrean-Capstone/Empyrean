import Grid from '@mui/material/Unstable_Grid2'

import { PaperPane } from '../../components/PaperPane/PaperPane'
import { Search } from '../../components/Search'
import { Logsheet } from '../../components/Logsheet'


function GridComponent({ size, Component }) {
	return (
		<Grid containers item xs={size}>
			<PaperPane><Component /></PaperPane>
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

export { LogsheetPage }
