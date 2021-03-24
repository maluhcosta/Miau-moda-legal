/* GULPFILE PATHS */
const INIT_PATH = './src';
const DEST_PATH = './dist';
const SOURCE_MAP_PATH = '.'
const PATHS = {
    css: {
        origin: [
            `${ INIT_PATH }/assets/css/style.css`
        ],
        dist: `${ DEST_PATH }/assets/css`,
    },

    html: {
        origin: `${ INIT_PATH }/html/*.html`,
        dist: DEST_PATH
    },
    
    images: {
        origin: [
            `${ INIT_PATH }/assets/images/*/*.*`,
            `${ INIT_PATH }/assets/images/*.*`
        ],
        dist: `${ DEST_PATH }/assets/images`
    }
};

module.exports = {
    INIT_PATH,
    DEST_PATH,
    SOURCE_MAP_PATH,
    PATHS
};