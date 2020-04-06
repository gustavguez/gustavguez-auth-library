module.exports = {
    extends: [
		'gustavguez-eslint-config'
	].map(require.resolve),
    parserOptions: {
        project: "tsconfig.json",
    },
    rules: {}
}