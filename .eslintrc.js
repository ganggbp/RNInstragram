module.exports = {
	root: true,
	extends: [
		'@react-native-community',
		'airbnb-typescript',
		'prettier',
		'prettier/@typescript-eslint',
		'prettier/react',
		'plugin:prettier/recommended'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier'],
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			rules: {
				'@typescript-eslint/no-shadow': ['error'],
				'no-shadow': 'off',
				'no-undef': 'off'
			}
		}
	]
};
