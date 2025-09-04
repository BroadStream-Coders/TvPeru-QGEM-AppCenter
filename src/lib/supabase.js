import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Función para probar la conexión
export async function testSupabaseConnection() {
  try {
    console.log('🔄 Probando conexión a Supabase...')
    console.log('📍 URL:', supabaseUrl)
    console.log('🔑 Anon Key (primeros 20 chars):', supabaseAnonKey?.substring(0, 20) + '...')
    
    // Usamos la tabla auth.users que siempre existe en Supabase
    // Solo contamos los registros sin obtener datos sensibles
    const { data, error, count } = await supabase
      .from('auth.users')
      .select('*', { count: 'exact', head: true })
    
    if (!error) {
      console.log('✅ Conexión a Supabase exitosa!')
      console.log(`ℹ️  Usuarios registrados: ${count || 0}`)
      console.log('🗄️  Base de datos funcionando correctamente')
      return { 
        success: true, 
        message: 'Conexión exitosa',
        userCount: count || 0
      }
    }
    
    // Si hay error pero es de permisos, la conexión funciona
    if (error && (error.message.includes('permission') || error.message.includes('access'))) {
      console.log('✅ Conexión a Supabase exitosa!')
      console.log('ℹ️  Sin permisos para auth.users (normal con anon key)')
      console.log('🗄️  Base de datos funcionando correctamente')
      return { 
        success: true, 
        message: 'Conexión exitosa (sin permisos auth, pero conectado)'
      }
    }
    
    // Cualquier otro error
    console.error('❌ Error de conexión:', error.message)
    return { success: false, error: error.message }
    
  } catch (err) {
    console.error('❌ Error inesperado:', err.message)
    return { success: false, error: err.message }
  }
}