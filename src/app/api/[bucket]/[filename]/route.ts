import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{
    filename: string
    bucket: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { filename, bucket } = await params;

    if (!filename) {
      return NextResponse.json({
        ok: false,
        error: 'Nombre de archivo requerido'
      }, { status: 400 })
    }

    console.log(`🪣 Bucket: ${bucket}`);
    console.log('📖 Leyendo archivo:', filename);

    // Descargar el archivo desde Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .download(filename)

    if (error) {
      console.error('❌ Error al leer archivo:', error)
      return NextResponse.json({
        ok: false,
        error: error.message
      }, { status: 404 })
    }

    // Convertir el Blob a texto
    const jsonText = await data.text()

    // Parsear el JSON
    let jsonData: unknown
    try {
      jsonData = JSON.parse(jsonText)
    } catch (parseError) {
      return NextResponse.json({
        ok: false,
        error: 'Error al parsear JSON'
      }, { status: 400 })
    }

    console.log('✅ Archivo leído exitosamente')

    return NextResponse.json({
      ok: true,
      filename: filename,
      data: jsonData,
      timestamp: new Date().toISOString()
    })

  } catch (error: unknown) {
    const err = error as Error;
    console.error('❌ Error inesperado:', err)
    return NextResponse.json({
      ok: false,
      error: err.message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { filename, bucket } = await params;

    if (!filename) {
      return NextResponse.json({
        ok: false,
        error: 'Nombre de archivo requerido'
      }, { status: 400 })
    }

    // Leer el JSON del body de la request
    let jsonData: unknown
    try {
      jsonData = await request.json()
    } catch (parseError) {
      return NextResponse.json({
        ok: false,
        error: 'JSON inválido en el body'
      }, { status: 400 })
    }

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
      return NextResponse.json({
        ok: false,
        error: error.message,
        details: error
      }, { status: 500 })
    }

    // Obtener la URL pública del archivo (si el bucket es público)
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filename)

    console.log('✅ Archivo guardado exitosamente')

    return NextResponse.json({
      ok: true,
      message: 'JSON guardado exitosamente',
      filename: filename,
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
      timestamp: new Date().toISOString(),
      size: jsonString.length
    })

  } catch (error: unknown) {
    const err = error as Error;
    console.error('❌ Error inesperado:', err)
    return NextResponse.json({
      ok: false,
      error: err.message
    }, { status: 500 })
  }
}