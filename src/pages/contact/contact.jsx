import { PaperPane } from '../../components/PaperPane/PaperPane'

/**
 * Creates the Contact page, which has information about the github
 *     and other contact information.
 * @return {JSX element} Returns a valid JSX element that contains the Contact
 *     page.
 */
function Contact() {
	return (
		<PaperPane>
			<h1>Contact Us!</h1>
			<p>If you notice any issues with this service, you can submit an issue with us <a target="_blank" rel="noreferrer" href="https://github.com/Empyrean-Capstone/Empyrean/issues">here!</a></p>
			<p>Or, you can contact us at (Insert contact info here)</p>
		</PaperPane>
	)
}

export { Contact }
