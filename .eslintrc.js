module.exports = {
    extends: [
		'gustavguez-eslint-config'
	].map(require.resolve),
    parserOptions: {
        project: "tsconfig.json",
    },
    rules: {
		"@typescript-eslint/no-magic-numbers": "off",
		"complexity": ["error", 6]
	}
}