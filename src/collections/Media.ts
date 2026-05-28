import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Content',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      localized: true,
      required: true,
      admin: {
        description: 'Describe the image for screen readers and SEO.',
      },
    },
    {
      name: 'caption',
      type: 'richText',
      label: 'Caption',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 300 },
      { name: 'square', width: 500, height: 500 },
      { name: 'small', width: 600 },
      { name: 'card', width: 800 },
      { name: 'medium', width: 1100 },
      { name: 'large', width: 1600 },
      { name: 'hero', width: 1920 },
      { name: 'og', width: 1200, height: 630 },
    ],
  },
}
