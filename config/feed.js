export default {
	collection: 'yfts',
	destination: 'yfts.xml',
	postDescription: (file) => {
		file.date = file.publishDate; // eslint-disable-line no-param-reassign
		file.author = 'Andy Steinberg'; // eslint-disable-line no-param-reassign
		return file.contents;
	},
	title: 'Your Favorite Thing Sucks',
	description: 'A hate blog for just about everything',
	copyright: '2016 Andy Steinberg',
	managingEditor: 'Andy Steinberg'
};
