module.exports = {
    globDirectory: 'public/',
    globPatterns: [
        '**/*.{js,json,html,css}'
    ],
    ignoreURLParametersMatching: [
        /^utm_/,
        /^fbclid$/
    ],
    swDest: 'public/sw.js'
};