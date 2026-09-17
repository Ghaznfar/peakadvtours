import { defineCliConfig } from 'sanity/cli';

/**
 * Sanity CLI config (for `npx sanity ...` — dataset management, deploy, etc.).
 * Reads the project id/dataset from env; never hardcode credentials.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
  autoUpdates: true,
});
