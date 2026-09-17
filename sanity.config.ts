import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { apiVersion, dataset, safeProjectId } from './sanity/env';
import { schemaTypes } from './sanity/schemaTypes';
import { structure } from './sanity/structure';

/**
 * Sanity Studio configuration. Run locally with `npm run studio:dev`
 * (http://localhost:3333) and host it with `npm run studio:deploy`
 * (→ https://<project>.sanity.studio). projectId/dataset come from env vars —
 * never hardcoded. `visionTool` (GROQ playground) is handy for the developer;
 * it can be removed for a purely non-technical editor experience.
 */
export default defineConfig({
  name: 'default',
  title: 'PeakAdventure Tours — Content',
  projectId: safeProjectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: { types: schemaTypes },
});
