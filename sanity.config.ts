'use client'

/**
 * Konfiguracja dla Sanity Studio (Panel Admina)
 * montowanego pod adresem /studio
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Importujemy zmienne środowiskowe i schematy
// Upewnij się, że te ścieżki pasują do Twoich folderów!
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'

export default defineConfig({
  basePath: '/studio', // <-- To musi pasować do folderu w app/studio
  projectId,
  dataset,
  
  // Tu podpinamy nasze definicje (blog, portfolio, oferta)
  schema,

  plugins: [
    structureTool(), // Buduje menu po lewej stronie w Studio
    visionTool({defaultApiVersion: apiVersion}), // Narzędzie do testowania zapytań
  ],
})