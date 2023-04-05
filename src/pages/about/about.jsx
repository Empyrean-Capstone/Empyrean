import './style.css'
import Grid from '@mui/material/Unstable_Grid2'
import { PaperPane } from '../../components/PaperPane/PaperPane'

function About() {
	return (
		<div>
			<Grid spacing={2}>
				<PaperPane>
					<h1>About</h1>
					<p>This tool was created to assist in the operation of Lowell Observatories' spectrographs.
						Without this tool, observations had to be made at the same location as the spectrograph, with no option for remote control.
						The spectrograph also requires significant setup time.
						Additionally, there were many settings that Lowell was having to choose which ended up being the same every time.
						These two factors meant that operation was not only time consuming, but difficult to use comfortably at night and possible to lose data if some setting are not configured properly.
					</p>
					<p>
						That's where this tool comes in.
						The goal is to reduce the strain on astronomers to make it simple to utilize their spectrograph every clear night, from wherever the astronomer is.
						There configurations are minimal, and all of the data is guaranteed to be in one place so none is lost.
						With this tool, astronomers at Lowell and elsewhere can use their spectrographs in confort and in confidence.
					</p>
				</PaperPane>
			</Grid>
		</div>
	);
}

export { About };
