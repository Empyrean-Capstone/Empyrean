import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

// Creates a constant theme with background color,
//     padding, text alignment, and text color.
const PaperPane = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

export { PaperPane }
