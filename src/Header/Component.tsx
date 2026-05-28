import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { headers } from 'next/headers'
import React from 'react'

export async function Header() {
  const hdrs = await headers()
  const pathname = hdrs.get('x-pathname') || hdrs.get('x-invoke-path') || '/'
  const locale = pathname.startsWith('/en') ? 'en' : 'mk'
  const headerData = await getCachedGlobal('header', 1, locale)()

  return <HeaderClient data={headerData} />
}
