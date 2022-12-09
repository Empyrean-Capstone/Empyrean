export default class APIService{

	// Insert an article
	
    static SubmitPlanet(body){
	const requestOptions = {
	    method: "POST",
	    headers: { 'Content-Type': 'application/json'},
	    body: JSON.stringify( body )
	};
	return fetch('/subsystem_communication/submit', requestOptions )
	    .then( response => console.log( response ) )
		    .catch(error => {
			console.log( "hi" )
			console.log(error)})
	}

}
