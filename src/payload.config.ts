import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import { Categories } from './collections/Categories'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Events } from './collections/Events'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { Spaces } from './collections/Spaces'
import { Users } from './collections/Users'
import { Vendors } from './collections/Vendors'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { SiteSettings } from './globals/SiteSettings'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const useR2 = Boolean(
  process.env.S3_ENDPOINT &&
    process.env.S3_BUCKET &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY,
)

const emailAdapter = process.env.RESEND_API_KEY
  ? resendAdapter({
      defaultFromAddress: process.env.CONTACT_EMAIL || 'noreply@laboratorium.mk',
      defaultFromName: 'Laboratorium',
      apiKey: process.env.RESEND_API_KEY,
    })
  : process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.CONTACT_EMAIL || 'noreply@laboratorium.mk',
        defaultFromName: 'Laboratorium',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
      })
    : undefined

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
    meta: {
      titleSuffix: '— Laboratorium Admin',
    },
  },

  localization: {
    locales: [
      { label: 'Македонски', code: 'mk' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'mk',
    fallback: true,
  },

  editor: defaultLexical,

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    prodMigrations: undefined,
  }),

  ...(emailAdapter ? { email: emailAdapter } : {}),

  collections: [
    Pages,
    Posts,
    Events,
    Spaces,
    Projects,
    Vendors,
    ContactSubmissions,
    Media,
    Categories,
    Users,
  ],

  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, SiteSettings],
  plugins: [
    ...plugins,
    ...(useR2
      ? [
          s3Storage({
            collections: {
              media: {
                prefix: 'media',
              },
            },
            bucket: process.env.S3_BUCKET as string,
            config: {
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
              },
              region: process.env.S3_REGION || 'auto',
              endpoint: process.env.S3_ENDPOINT,
              forcePathStyle: true,
            },
          }),
        ]
      : []),
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true
        const secret = process.env.CRON_SECRET
        if (!secret) return false
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
