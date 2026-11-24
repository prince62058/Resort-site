import {defineConfig} from '@playwright/test';
import shared from './playwright.config.js';

const {channel, ...sharedUse} = shared.use;

export default defineConfig({
  ...shared,
  use: sharedUse,
  testMatch: ['responsive.spec.js', 'rooms-page.spec.js'],
  workers: 2,
  projects: [
    {name: 'mobile-chrome', use: {browserName: 'chromium', channel: 'chrome'}},
    {name: 'mobile-webkit', use: {browserName: 'webkit'}},
  ],
});
