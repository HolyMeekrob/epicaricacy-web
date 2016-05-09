export default {
	'collections.yfts': {
		perPage: 5,
		layout: 'yfts/home.html',
		first: 'yfts/index.html',
		path: 'yfts/:num/index.html',
		filter: () => true,
		noPageOne: true
	},
	'collections.fiction': {
		perPage: 5,
		layout: 'fiction/home.html',
		first: 'fiction/index.html',
		path: 'fiction/:num/index.html',
		filter: () => true,
		noPageOne: true
	}
};
