export default {
	'collections.yfts': {
		perPage: 5,
		layout: 'yfts/index.html',
		first: 'yfts/index.html',
		path: 'yfts/:num/index.html',
		filter: () => true,
		noPageOne: true
	},
	'collections.fiction': {
		perPage: 5,
		layout: 'fiction.html',
		first: 'fiction/index.html',
		path: 'fiction/:num/index.html',
		filter: () => true,
		noPageOne: true
	}
};
