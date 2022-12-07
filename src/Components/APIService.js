export default class APIService{

	// Insert an article
	
	static SubmitPlanet(body){
		return fetch('/submit',{
      		 method : 'POST',
      		 headers : {
      		    'Content-Type':'application/json',
            },
            body:JSON.stringify(body)
    })
	.catch(error => console.log(error))
	}

}
