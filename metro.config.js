/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const exclusionList = require('metro-config/src/defaults/exclusionList');
const { getDefaultConfig } = require('metro-config');
const { resolver: defaultResolver } = getDefaultConfig.getDefaultValues();

module.exports = {
	transformer: {
		getTransformOptions: async () => ({
			transform: {
				experimentalImportSupport: false,
				inlineRequires: true,
			},
		}),
	},
	resolver: {
		blacklistRE: exclusionList([/#current-cloud-backend\/.*/]),
		sourceExts: [...defaultResolver.sourceExts, 'cjs'],
	},
};
