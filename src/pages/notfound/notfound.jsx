import { Link } from "react-router-dom";

function NotFound() {
	return (
		<div>
			<h1>Oops! You seem to be lost.</h1>
			<p>Here are some helpful links:</p>
			<Link to='/'>Log In</Link>
		</div>
	)
}

export { NotFound }
