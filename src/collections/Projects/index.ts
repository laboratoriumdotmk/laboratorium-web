import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { defaultLexical } from '@/fields/defaultLexical'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { revalidatePath } from 'next/cache'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { getServerSideURL } from '@/utilities/getURL'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Project', plural: 'Projects' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', '_status'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({ slug: data?.slug as string, collection: 'projects' })
        return `${getServerSideURL()}${path}`
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({ slug: data?.slug as string, collection: 'projects' })
      return `${getServerSideURL()}${path}`
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    summary: true,
    status: true,
  },
  versions: {
    drafts: { autosave: { interval: 100 } },
    maxPerDoc: 20,
  },
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [
      ({ doc, req: { payload, context } }) => {
        if (!context.disableRevalidate) {
          revalidatePath(`/projects/${doc.slug}`)
          revalidatePath('/projects')
        }
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Project Info',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              localized: true,
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              label: 'Slug',
              required: true,
              unique: true,
              index: true,
            },
            {
              name: 'status',
              type: 'select',
              label: 'Project Status',
              options: [
                { label: 'Ongoing', value: 'ongoing' },
                { label: 'Completed', value: 'completed' },
                { label: 'Upcoming', value: 'upcoming' },
              ],
              defaultValue: 'ongoing',
            },
            {
              name: 'summary',
              type: 'textarea',
              label: 'Short Summary',
              localized: true,
              admin: {
                description: 'One or two sentences for project cards.',
              },
            },
            {
              name: 'body',
              type: 'richText',
              label: 'Full Description',
              localized: true,
              editor: defaultLexical,
            },
            {
              name: 'collaborators',
              type: 'array',
              label: 'Collaborators / Partners',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Name',
                  required: true,
                },
                {
                  name: 'role',
                  type: 'text',
                  label: 'Role (optional)',
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL (optional)',
                },
              ],
            },
            {
              name: 'images',
              type: 'array',
              label: 'Photos',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: false,
              fields: [
                { name: 'title', type: 'text', label: 'SEO Title', localized: true },
                { name: 'description', type: 'textarea', label: 'SEO Description', localized: true },
                { name: 'image', type: 'upload', relationTo: 'media', label: 'OG Image' },
              ],
            },
          ],
        },
      ],
    },
    { name: 'publishedAt', type: 'date', admin: { hidden: true } },
  ],
}
