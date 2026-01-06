import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Usługi (Oferta)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nazwa Usługi',
      type: 'string', 
    }),
    defineField({
        name: 'price',
        title: 'Cena (tekst, np. "od 2500 PLN")',
        type: 'string',
    }),
    defineField({
        name: 'isPopular',
        title: 'Wyróżniona? (Bestseller)',
        type: 'boolean',
        initialValue: false
    }),
    defineField({
        name: 'description',
        title: 'Krótki opis',
        type: 'text',
        rows: 3
    }),
    defineField({
        name: 'features',
        title: 'Lista korzyści (punkty)',
        type: 'array',
        of: [{ type: 'string' }]
    }),
  ],
})