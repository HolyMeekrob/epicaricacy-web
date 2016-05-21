import metalsmith from 'metalsmith';
import branch from 'metalsmith-branch';
import collections from 'metalsmith-collections';
import dateFormatter from 'metalsmith-date-formatter';
import drafts from 'metalsmith-drafts';
import excerpts from 'metalsmith-better-excerpts';
import feed from 'metalsmith-feed';
import layouts from 'metalsmith-layouts';
import markdown from 'metalsmith-markdownit';
import pageData from 'metalsmith-page-data';
import pagination from 'metalsmith-pagination';
import permalinks from 'metalsmith-permalinks';
import postcss from 'metalsmith-postcss';
import serve from 'metalsmith-serve';
import transformer from 'metalsmith-transformer';
import nunjucks from 'nunjucks';
import { releaseFiles } from './release';

import collectionConfig from './config/collections';
import cssConfig from './config/postcss';
import dateConfig from './config/dates';
import excerptConfig from './config/excerpts';
import layoutConfig from './config/layouts';
import markdownConfig from './config/markdown';
import serveConfig from './config/serve';
import pageDataConfig from './config/pageData';
import paginationConfig from './config/pagination';
import permalinkConfig from './config/permalinks';

import feedGenerator from './config/feed';
import { includeFile, options as transformerConfig } from './config/lineEndings';

import { cleanDir } from './clean';

const env = nunjucks.configure('src/templates', { watch: false, nocache: true });

// Nunjucks filter to use the pretty url for any index.html addresses
env.addFilter('prettifyUrl', (str) =>
	str.replace(/index\.html/i, ''));

const yftsFeedConfig = feedGenerator(
	'yfts', 'Your Favorite Thing Sucks', 'A hate blog for just about everything');

const fictionFeedConfig =	feedGenerator(
	'fiction', 'Andy\'s Fiction', 'A collection of various short works');

const addBuild = (ms) =>
	ms.build((err) => {
		if (err) {
			console.error(err);
		}
		else {
			console.log('Build complete');
		}
	});

const addServe = (ms) => ms.use(serve(serveConfig));

const getBase = () =>
	metalsmith(__dirname)
		.metadata({
			site: {
				url: 'http://www.epicaricacy.com'
			}
		})
		.source('./src/content')
		.clean(false)
		.use(drafts())
		.use(markdown(markdownConfig))
		.use(collections(collectionConfig))
		.use(permalinks(permalinkConfig))
		.use(excerpts(excerptConfig))
		.use(feed(yftsFeedConfig))
		.use(feed(fictionFeedConfig))
		.use(pagination(paginationConfig))
		.use(pageData(pageDataConfig))
		.use(dateFormatter(dateConfig))
		.use(layouts(layoutConfig))
		.use(branch(includeFile)
			.use(transformer(transformerConfig)))
		.use(postcss(cssConfig))
		.destination('./dist');

const build = () =>	addBuild(getBase());

const buildAndServe =	() => addBuild(addServe(getBase()));

const clean = () => {
	cleanDir('./dist');
	console.log('Clean complete');
};

const help = () => {
	console.log('build:\t\t\tBuild source to output');
	console.log('clean:\t\t\tClean output directory');
	console.log('start:\t\t\tBuild source and start server');
	console.log('release {filename}:\tRelease a draft for publication. Use \'all\' to publish all drafts.');
	console.log('help:\t\t\tOutput this help');
};

const commandIndex = 2;

switch (process.argv[commandIndex]) {
	case 'build':
		clean();
		build();
		break;

	case 'clean':
		clean();
		break;

	case 'buildAndServe':
		clean();
		buildAndServe();
		break;

	case 'help':
		help();
		break;

	case 'release':
		if (process.argv.length === commandIndex + 1) {
			console.log('Filename(s) required.');
			break;
		}

		releaseFiles(process.argv.slice(commandIndex + 1).join(' '), `${__dirname}/src/content`)
			.then((files) => {
				const releasedFiles = files.filter((file) => file !== undefined);
				if (releasedFiles.length === 0) {
					console.log('No drafts found.');
				}
				else {
					releasedFiles.forEach((file) => {
						console.log(`${file} has been marked for publication`);
					});
				}
			});
		break;

	default:
		console.error(`Unsupported command: ${process.argv[commandIndex]}`);
		break;
}
