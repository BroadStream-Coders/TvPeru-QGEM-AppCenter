import { testSupabaseConnection } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🧪 Iniciando prueba de conexión a Supabase...')

    const result = await testSupabaseConnection()

    if (result.success) {
      return new Response(JSON.stringify({
        ok: true,
        message: '✅ Supabase conectado correctamente',
        timestamp: new Date().toISOString(),
        details: result
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      return new Response(JSON.stringify({
        ok: false,
        message: '❌ Error de conexión a Supabase',
        error: result.error,
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    console.error('❌ Error en test de Supabase:', error)
    return new Response(JSON.stringify({
      ok: false,
      message: '❌ Error inesperado',
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}