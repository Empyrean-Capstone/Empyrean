import * as yup from 'yup';

//yup adjustments for correct format 
const loginFormSchema = yup.object().shape({
	username: yup
		.string()
		.trim()
		.required("Username is required"),

	password: yup
		.string()
		.required("Password is required"),
})

export { loginFormSchema }
