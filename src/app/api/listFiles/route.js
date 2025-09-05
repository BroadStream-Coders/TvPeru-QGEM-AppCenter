import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    console.log('📂 Listando archivos del storage...')

    // Listar archivos del bucket 'json-files'
    const { data, error } = await supabaseAdmin.storage
      .from('json-files')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'updated_at', order: 'desc' }
      })

    if (error) {
      console.error('❌ Error al listar archivos:', error)
      return new Response(JSON.stringify({
        ok: false,
        error: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Filtrar solo archivos (no carpetas) y archivos JSON
    const jsonFiles = data.filter(file =>
      file.name &&
      !file.name.endsWith('/') &&
      (file.name.endsWith('.json') || file.metadata?.mimetype === 'application/json')
    )

    console.log(`✅ ${jsonFiles.length} archivos JSON encontrados`)

    return new Response(JSON.stringify({
      ok: true,
      files: jsonFiles,
      count: jsonFiles.length,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Error inesperado:', error)
    return new Response(JSON.stringify({
      ok: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}