import { CalendarSearch } from '../../components/CalendarSearch/CalendarSearch'
import { Logsheet } from '../../components/Logsheet/Logsheet'
import { PaperPane } from '../../components/PaperPane/PaperPane'

import Grid from '@mui/material/Unstable_Grid2'
import Typography from '@mui/material/Typography';


function GridComponent({ size, Component }) {
	return (
		<Grid containers item xs={size}>
			<PaperPane><Component /></PaperPane>
		</Grid>
	)
}

function InstructionBox() {
	return (
		<PaperPane>
			<Typography variant="h6" align="left">
				Instructions
			</Typography>
			<Typography variant="body2" align="left">
				This page allows the user to query their observations by more advanced parameters than are available in the
				logsheet itself. While the logsheet below offers filtering functionality on all columns, allowing the user to
				search for observations that contain a substring, the parameters at left allow the user to search by means other
				than strings.
			</Typography>
		</PaperPane >
	)
}


function LogsheetPage() {
	return (
		<div>
			<Grid container spacing={2} direction="row">
				<GridComponent size={4} Component={CalendarSearch}></GridComponent>
				<GridComponent size={2} Component={InstructionBox}></GridComponent>
			</Grid>
			<Grid container spacing={2}>
				<GridComponent size={14} Component={Logsheet}></GridComponent>
			</Grid>
		</div>
	)
}

export { LogsheetPage }
