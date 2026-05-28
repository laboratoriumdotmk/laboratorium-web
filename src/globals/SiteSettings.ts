import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  admin: {
    description: 'Global site identity, contact info, social links, and award badges. Used in the footer, contact page, and schema.org structured data.',
    group: 'Settings',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      label: 'Site Name',
      defaultValue: 'Laboratorium',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
      localized: true,
      admin: {
        description: 'Short manifesto line shown in the hero. e.g. "A laboratory of beautiful things."',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Default OG / Social Share Image',
      admin: {
        description: 'Fallback image used for social sharing when a page has no specific image.',
      },
    },
    {
      type: 'group',
      name: 'contact',
      label: 'Contact',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Public Email',
          defaultValue: 'contact@laboratorium.mk',
        },
        {
          name: 'notificationEmail',
          type: 'email',
          label: 'Notification Recipient (for contact form)',
          admin: {
            description: 'Where to send new contact form submissions.',
          },
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Primary Phone',
          defaultValue: '+389 72 905 555',
        },
        {
          name: 'phoneAlt',
          type: 'text',
          label: 'Alt Phone',
          defaultValue: '+389 2 314 2044',
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Address',
          defaultValue: 'Blvd. Kliment Ohridski 68, 1000 Skopje, North Macedonia',
        },
        {
          name: 'hours',
          type: 'text',
          label: 'Opening Hours',
          localized: true,
          admin: {
            description: 'e.g. "Mon–Sun, open for events in the evenings"',
          },
        },
        {
          name: 'contactPerson',
          type: 'text',
          label: 'Contact Person',
          defaultValue: 'Kalina Dukovska',
        },
      ],
    },
    {
      type: 'group',
      name: 'social',
      label: 'Social Links',
      fields: [
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram URL',
          defaultValue: 'https://instagram.com/lab.ratorium',
        },
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook URL',
          defaultValue: 'https://www.facebook.com/lab.rat.rium/',
        },
        {
          name: 'linktree',
          type: 'text',
          label: 'Linktree URL',
          defaultValue: 'https://linktr.ee/lab.ratorium',
        },
      ],
    },
    {
      type: 'group',
      name: 'awards',
      label: 'Awards & Network Memberships',
      admin: {
        description: 'Listed in the footer and About page.',
      },
      fields: [
        {
          name: 'items',
          type: 'array',
          label: 'Badge Items',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Name',
              localized: true,
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL (optional)',
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo (optional)',
            },
          ],
        },
      ],
    },
    {
      name: 'footerText',
      type: 'textarea',
      label: 'Footer Credit / Legal Line',
      localized: true,
      admin: {
        description: 'e.g. "© 2025 Laboratorium. Design by ..."',
      },
    },
  ],
}
