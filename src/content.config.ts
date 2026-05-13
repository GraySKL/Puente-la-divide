import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const scenarios = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/scenarios' }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(['en', 'es']),
    slug: z.string(),
    order: z.number(),
    summary: z.string(),
    source: z.string()
  })
});

export const collections = { scenarios };
