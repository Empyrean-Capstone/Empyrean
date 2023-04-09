import { Link } from "react-router-dom";

/**
 * Creates a JSX element to be displayed as a NOT_FOUND
 *     page, containing a link back to the login.
 * @return {JSX element} Returns a JSX element as a NOT_FOUND
 *     page.
 */
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
