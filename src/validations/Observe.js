// https://skyandtelescope.org/astronomy-resources/right-ascension-declination-celestial-coordinates/

import * as yup from 'yup';

const requestFieldsRegex = {

	// from 00:00:00.00 to 24:00:00, with max
	// values for each segment being 24:59:59.99
	right_ascension: new RegExp("^(([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](.[0-9][0-9])?|24:00:00(.00)?)$"),

	// from -90:00:00.00 to 90:00:00.00, with max
	// values for each segment being 90:59:59:99
	declination: new RegExp("^(0|[+-][0-8][0-9]:[0-5][0-9]:[0-5][0-9](.[0-9][0-9])?|90:00:00(.00)?)$"),

	// float, with two places, from -90.00 to 90.00
	altitude: new RegExp("^(-?(([0-8][0-9]?|9)(.[0-9][0-9])?|90(.00)?))$"),
}

const requestFormSchema = yup.object().shape({
	object: yup
		.string()
		.trim()
		.required("Object is required"),

	obs_type: yup
		.string()
		.required("Object Type is required"),

	right_ascension: yup
		.string()
		.trim()
		.matches(requestFieldsRegex["right_ascension"], "Right Ascension must be of the form hh:mm:ss[.ff]")
		.required("Right Ascension is required"),

	declination: yup
		.string()
		.trim()
		.matches(requestFieldsRegex["declination"], "Declination must be of the form [+-]hh:mm:ss[.ff]")
		.required("Declination is required"),

	altitude: yup
		.string()
		.trim()
		.matches(requestFieldsRegex["altitude"], "Altitude must be a float between -90 and 90")
		.required("Altitude is required"),

	num_exposures: yup
		.number("Number of Exposures must be a positive number")
		.positive("Number of Exposures must be a positive number")
		.integer("Number of Exposures must be a positive number")
		.required("Number of Exposures must be a positive number"),

	exposure_duration: yup
		.number("Exposure Duration must be a positive number")
		.positive("Exposure Duration must be a positive number")
		.integer("Exposure Duration must be a positive number")
		.required("Exposure Duration must be a positive number"),
})

export { requestFormSchema }
