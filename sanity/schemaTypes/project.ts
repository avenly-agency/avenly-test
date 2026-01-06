import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Realizacje (Portfolio)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nazwa Projektu / Klienta',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategoria',
      type: 'string',
      options: {
        list: [
            { title: 'Strona WWW', value: 'Strona WWW' },
            { title: 'Sklep Online', value: 'Sklep Online' },
            { title: 'Aplikacja Webowa', value: 'Aplikacja Webowa' },
            { title: 'Automatyzacja AI', value: 'Automatyzacja AI' },
        ],
      },
    }),
    defineField({
        name: 'description',
        title: 'Krótki opis (na kafelkę)',
        type: 'text', 
        rows: 3,
    }),
    defineField({
        name: 'tech',
        title: 'Technologie (np. React, Next.js)',
        type: 'array',
        of: [{ type: 'string' }],
    }),
    defineField({
      name: 'image',
      title: 'Zdjęcie Główne',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'liveUrl',
      title: 'Link do strony (Live)',
      type: 'url',
    }),
    // Opcjonalnie: Pełny opis case study
    defineField({
        name: 'content',
        title: 'Opis Case Study',
        type: 'array',
        of: [{ type: 'block' }]
    })
  ],
})