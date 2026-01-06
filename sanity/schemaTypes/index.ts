import { type SchemaTypeDefinition } from 'sanity'
import post from './post'
import project from './project'
import service from './service'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, project, service],
}