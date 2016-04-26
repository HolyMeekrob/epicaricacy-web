const imageDir = '/assets/images/about/';
const normalImg = `${imageDir}/me_normal.jpg`;
const angryImg = `${imageDir}/me_angry.jpg`;

const updateMe = (image) => {
	document.querySelector('#meImg').src = image;
};

const makeAngry = () => { // eslint-disable-line no-unused-vars
	updateMe(angryImg);
};

const makeNormal = () => { // eslint-disable-line no-unused-vars
	updateMe(normalImg);
};
