const excerptRegex = /\s*<!--\s*more\s*-->/i;

export const config = {
	moreRegExp: excerptRegex,
	stripTags: false,
	pruneLength: 0,
	pruneString: ''
};

export const addAnchorFiles = '*/**/*.html';

export const addAnchorTransformer = (str) => {
	const anchor = '<a name="post-excerpt"></a>';

	if (excerptRegex.test(str)) {
		return str.replace(excerptRegex, (match) => `${match}${anchor}`);
	}

	const firstParagraphRegex = /(<p>[\s\S]*?<\/p>[\s\S]*?)(<p>)/i;
	return str.replace(firstParagraphRegex,
		(match, p1, p2) => `${p1}${anchor}${p2}`); // eslint-disable-line no-unused-vars
};

export const addAnchorConfig = {
	transformer: addAnchorTransformer
};
