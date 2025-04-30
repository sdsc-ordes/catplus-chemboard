// tailwind.config.js
import { skeleton } from '@skeletonlabs/skeleton/plugin';
import * as themes from '@skeletonlabs/skeleton/themes'; // Import themes

export default {
  darkMode: 'class', // Recommended
  content: [
    './src/**/*.{html,js,svelte,ts}',
    // Path to Skeleton components:
    require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
    // Or using ESM helpers if you configured that way:
    // import path from 'path';
    // import { fileURLToPath } from 'url';
    // const __filename = fileURLToPath(import.meta.url);
    // const __dirname = path.dirname(__filename);
    // path.join(__dirname, '../node_modules/@skeletonlabs/skeleton/dist/**/*.{html,js,svelte,ts}')
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // Add other plugins like forms, typography if needed
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Initialize Skeleton plugin and register themes:
    skeleton({
      themes: {
        // Register the theme(s) you want to use
        preset: [ themes.nosh ]
        // Or if using custom themes:
        // custom: [ myCustomTheme ]
      }
    })
  ]
}