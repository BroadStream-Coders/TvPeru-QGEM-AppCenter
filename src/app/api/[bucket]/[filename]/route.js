import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request, { params }) {
  try {
    const { filename, bucket } = await params;

    if (!filename) {
      return new Response(JSON.stringify({
        ok: false,
        error: 'Nombre de archivo requerido'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log(`🪣 Bucket: ${bucket}`);
    console.log('📖 Leyendo archivo:', filename);

    // Descargar el archivo desde Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
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

export async function POST(request, { params }) {
  try {
    const { filename, bucket } = await params;

    if (!filename) {
      return new Response(JSON.stringify({
        ok: false,
        error: 'Nombre de archivo requerido'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Leer el JSON del body de la request
    const jsonData = await request.json()

    console.log(`🪣 Bucket: ${bucket}`);
    console.log('📁 Guardando archivo:', filename)
    console.log('📄 Datos recibidos:', jsonData)

    // Convertir el JSON a string para guardarlo como archivo
    const jsonString = JSON.stringify(jsonData, null, 2)

    // Crear el archivo como Blob
    const fileBlob = new Blob([jsonString], { type: 'application/json' })

    // Subir a Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filename, fileBlob, {
        contentType: 'application/json',
        upsert: true // Sobrescribir si ya existe
      })

    if (error) {
      console.error('❌ Error al subir archivo:', error)
      return new Response(JSON.stringify({
        ok: false,
        error: error.message,
        details: error
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Obtener la URL pública del archivo (si el bucket es público)
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('json-files')
      .getPublicUrl(filename)

    console.log('✅ Archivo guardado exitosamente')

    return new Response(JSON.stringify({
      ok: true,
      message: 'JSON guardado exitosamente',
      filename: filename,
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
      timestamp: new Date().toISOString(),
      size: jsonString.length
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