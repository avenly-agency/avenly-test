import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post (Blog)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tytuł Artykułu',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (Adres URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'object',
      fields: [
        {name: 'name', type: 'string', title: 'Imię i Nazwisko'},
        {name: 'role', type: 'string', title: 'Rola (np. CEO)'},
        {name: 'image', type: 'image', title: 'Zdjęcie autora'}
      ]
    }),
    defineField({
      name: 'mainImage',
      title: 'Zdjęcie Główne',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'categories',
      title: 'Kategorie',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Development', value: 'Development'},
          {title: 'Design & UX', value: 'Design & UX'},
          {title: 'AI & Automatyzacja', value: 'AI & Automatyzacja'},
          {title: 'Biznes', value: 'Biznes'},
          {title: 'Marketing', value: 'Marketing'},
        ],
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data Publikacji',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Krótki opis (zajawka)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Treść Artykułu',
      type: 'array', 
      of: [{type: 'block'}], 
    }),
  ],
})