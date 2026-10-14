// The live database still stores the original gold "N" favicon as a setting. Treat that
// legacy value as "not customised" so the logo icon is used, while any icon the owner
// picks later in the admin studio is respected.
const legacyFavicons = ['branding/favicon-32-v1.png'];
export const defaultFavicon = 'branding/favicon-32-v2.png';
export const faviconFor = settings => (settings?.favicon && !legacyFavicons.includes(settings.favicon) ? settings.favicon : defaultFavicon);
