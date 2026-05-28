// Type declarations for modules without official typings

declare module '@payloadcms/next/css' {}
declare module '@payloadcms/admin-bar' {
  export interface PayloadAdminBarProps {
    [key: string]: unknown
  }
  export interface PayloadMeUser {
    id?: string
    email?: string
    [key: string]: unknown
  }
  export const PayloadAdminBar: React.FC<PayloadAdminBarProps & { [key: string]: unknown }>
}
