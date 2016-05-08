const me = 'Andy Steinberg';
const year = '2016';

const copyright = `${year} ${me}`;

export default (collection, title, description) => {
	return {
		collection,
		destination: `${collection}.xml`,
		postDescription: (file) => {
			file.date = file.publishDate; // eslint-disable-line no-param-reassign
			file.author = me; // eslint-disable-line no-param-reassign
			return file.contents;
		},
		title,
		description,
		copyright
	};
};
