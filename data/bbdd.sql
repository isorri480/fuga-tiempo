-- ============================================
-- Script de creación de la base de datos
-- Fugas de Tiempo - Time Leak Tracker
-- ============================================

-- Crear la tabla fugas_tiempo
CREATE TABLE IF NOT EXISTS public.fugas_tiempo (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fecha_hora_registro TIMESTAMPTZ NOT NULL,
  tipo_fuga TEXT NOT NULL,
  descripcion_adicional TEXT,
  minutos_duracion INTEGER
);

-- Habilitar Row Level Security
ALTER TABLE public.fugas_tiempo ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Políticas de seguridad (RLS)
-- ============================================

-- Política: Los usuarios solo pueden ver sus propios registros
CREATE POLICY "Users can view own records"
  ON public.fugas_tiempo FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden insertar sus propios registros
CREATE POLICY "Users can insert own records"
  ON public.fugas_tiempo FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios solo pueden actualizar sus propios registros
CREATE POLICY "Users can update own records"
  ON public.fugas_tiempo FOR UPDATE
  USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden eliminar sus propios registros
CREATE POLICY "Users can delete own records"
  ON public.fugas_tiempo FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Índices para mejorar el rendimiento
-- ============================================

-- Índice para búsquedas por usuario
CREATE INDEX IF NOT EXISTS idx_fugas_tiempo_user_id 
  ON public.fugas_tiempo(user_id);

-- Índice para búsquedas por fecha
CREATE INDEX IF NOT EXISTS idx_fugas_tiempo_fecha 
  ON public.fugas_tiempo(fecha_hora_registro DESC);

-- Índice compuesto para búsquedas filtradas por usuario y fecha
CREATE INDEX IF NOT EXISTS idx_fugas_tiempo_user_fecha 
  ON public.fugas_tiempo(user_id, fecha_hora_registro DESC);

