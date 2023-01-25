import {Link, Outlet} from 'react-router-dom'
import './style.css'

function Layout() {
    return (
        <>
            <div id='layout-grid'>
                <div id='left-toolbar'>
                    <div id='profile-bar'>
                        UserName
                    </div>
                    <p id='main-page-title'>MAIN PAGES</p>
                    <ul id='main-links'>
                        <li class='main-page-link'>Observe</li>
                        <li class='main-page-link'>Logsheets</li>
                    </ul>
                </div>
                <div id='main-content'>
                    <div id='page-content'><Outlet/></div>
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
                </div>
            </div>
        </>
    )
}

export {Layout}