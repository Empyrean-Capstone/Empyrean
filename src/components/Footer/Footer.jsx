import './style.css'
import {BrowserRoute, Route, Switch, Link} from 'react-router-dom'

/**
 * Creates a footer component with links to 
 *     the about and contact pages.
 * @return {JSX element} Returns a JSX footer
 *     for use with every page that contains links
 *     to About and Contact pages.
 */
function Footer() {
	return (
		<div>
			<hr id="footer-line-break"/>
			<footer id='footer-section'>
				<p id="left-info">
					Wanted information here
				</p>
				<span>
					Version Perhaps
				</span>
					<ul id="right-info">
						<li class="footer-nav-link"><Link to="/about">About</Link></li>
						<li class="footer-nav-link"><Link to="/contact">Contact</Link></li>
					</ul>
			</footer>
		</div>
	)
}

export { Footer }
