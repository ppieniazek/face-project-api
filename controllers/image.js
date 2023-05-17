const setupClarifai = imageUrl => {
	const PAT = '3288cf2810c944b6853b362bb3020205';
	const USER_ID = 'ppieniazek';
	const APP_ID = 'test';
	// const MODEL_ID = 'face-detection';
	const IMAGE_URL = imageUrl;

	const raw = JSON.stringify({
		user_app_id: {
			user_id: USER_ID,
			app_id: APP_ID,
		},
		inputs: [
			{
				data: {
					image: {
						url: IMAGE_URL,
					},
				},
			},
		],
	});

	const requestOptions = {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization: `Key ${PAT}`,
		},
		body: raw,
	};

	return requestOptions;
};

const handleApiCall = (req, res) => {
	const { input } = req.body;
	fetch(`https://api.clarifai.com/v2/models/face-detection/outputs`, setupClarifai(input))
		.then(data => data.json())
		.then(data => res.json(data))
		.catch(err => res.status(400).json('unable to work with API'));
};

const handleImage = db => (req, res) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0].entries);
		})
		.catch(err => res.status(400).json('unable to get entries'));
};

module.exports = {
	handleImage,
	handleApiCall
};