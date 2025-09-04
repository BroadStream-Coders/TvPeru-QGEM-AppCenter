import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request, { params }) {
  try {
    const { filename } = await params

    if (!filename) {
      return new Response(JSON.stringify({
        ok: false,
        error: 'Nombre de archivo requerido'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log('📖 Leyendo archivo:', filename)

    // Descargar el archivo desde Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('json-files')
      .download(filename)

    if (error) {
      console.error('❌ Error al leer archivo:', error)
      return new Response(JSON.stringify({
        ok: false,
        error: error.message
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Convertir el Blob a texto
    const jsonText = await data.text()

    // Parsear el JSON
    const jsonData = JSON.parse(jsonText)

    console.log('✅ Archivo leído exitosamente')

    return new Response(JSON.stringify({
      ok: true,
      filename: filename,
      data: jsonData,
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