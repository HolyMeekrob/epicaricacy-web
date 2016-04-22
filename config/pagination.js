export default {
	'collections.yfts': {
		perPage: 5,
		layout: 'yfts/index.html',
		first: 'yfts/index.html',
		path: 'yfts/:num/index.html',
		filter: () => true,
		noPageOne: true
	}
};
