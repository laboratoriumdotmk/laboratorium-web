import React from 'react'
import Link from 'next/link'
import type { Project } from '@/payload-types'
import { Media } from '@/components/Media'

interface ProjectCardProps {
  project: Project
  locale?: string
}

const statusLabels: Record<string, string> = {
  ongoing: 'Тековен',
  completed: 'Завршен',
  upcoming: 'Претстоен',
}

export function ProjectCard({ project, locale = 'mk' }: ProjectCardProps) {
  const title = typeof project.title === 'string' ? project.title : (project.title as any)?.[locale] || ''
  const summary = typeof project.summary === 'string' ? project.summary : (project.summary as any)?.[locale] || ''
  const firstImage = project.images?.[0]?.image

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block border border-rule hover:border-ink transition-colors"
    >
      <div className="aspect-[3/2] overflow-hidden bg-cream-dark relative">
        {firstImage && typeof firstImage === 'object' ? (
          <Media
            resource={firstImage}
            imgClassName="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full halftone-bg flex items-center justify-center">
            <span className="text-2xl text-rule" aria-hidden="true">⚗</span>
          </div>
        )}
        {project.status && (
          <span className="absolute top-3 left-3 bg-cream/90 type-label px-2 py-1 text-ink">
            {statusLabels[project.status] || project.status}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl leading-snug mb-2 group-hover:text-lab-accent transition-colors">
          {title}
        </h3>
        {summary && (
          <p className="text-ink-faded text-sm leading-relaxed line-clamp-2">{summary}</p>
        )}
      </div>
    </Link>
  )
}
