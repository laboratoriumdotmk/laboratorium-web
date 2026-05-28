import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: 'Contact Submission', plural: 'Contact Submissions' },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'type', 'read', 'createdAt'],
    description: 'Messages submitted via the Contact and Get Involved forms. Admins can read and delete; submissions are not publicly listable.',
  },
  access: {
    create: () => true,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  timestamps: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      label: 'Subject / Type',
      required: true,
      options: [
        { label: 'General Inquiry', value: 'general' },
        { label: 'Rent a Space', value: 'rent-space' },
        { label: 'Volunteer', value: 'volunteer' },
        { label: 'Partner with Us', value: 'partner' },
        { label: 'Host an Event', value: 'host-event' },
        { label: 'Artist Residency', value: 'residency' },
        { label: 'Become a Maker', value: 'become-maker' },
        { label: 'Support / Donate', value: 'support' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      required: true,
    },
    {
      name: 'read',
      type: 'checkbox',
      label: 'Marked as Read',
      defaultValue: false,
      admin: {
        description: 'Check this once you have handled the inquiry.',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc

        const siteSettings = await req.payload.findGlobal({ slug: 'site-settings' })
        const contactEmail =
          siteSettings?.contact?.notificationEmail ||
          siteSettings?.contact?.email ||
          process.env.CONTACT_EMAIL ||
          'contact@laboratorium.mk'

        try {
          await req.payload.sendEmail({
            to: contactEmail,
            subject: `[Laboratorium] New ${doc.type} message from ${doc.name}`,
            html: `
              <p><strong>From:</strong> ${doc.name} &lt;${doc.email}&gt;</p>
              <p><strong>Type:</strong> ${doc.type}</p>
              <p><strong>Message:</strong></p>
              <p>${doc.message.replace(/\n/g, '<br>')}</p>
              <hr>
              <p><a href="${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/contact-submissions/${doc.id}">View in admin</a></p>
            `,
          })
        } catch (err) {
          req.payload.logger.error(`Failed to send contact notification: ${err}`)
        }

        return doc
      },
    ],
  },
}
