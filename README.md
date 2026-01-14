# 🎙️ Sonic Branding Premium - InnovAi

Plataforma de Diseño Sonoro y Branding impulsada por IA, diseñada específicamente para el **80 Aniversario del ICPR**. Esta aplicación permite la creación de activos sonoros, análisis de marca y orquestación de campañas mediante agentes inteligentes.

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript + Vite
- **Estética**: Tailwind CSS 4.0 + Framer Motion (Glassmorphism & 3D Transitions)
- **Base de Datos & Auth**: Supabase
- **IA Generativa**: Google Gemini (Contenido y Storyboards)
- **Síntesis de Voz**: ElevenLabs (Voces Institucionales Clonadas)
- **Visualización**: Wavesurfer.js & Recharts

---

## 🚀 Guía de Inicio Rápido

Sigue estos pasos para tener la aplicación corriendo en tu entorno local:

### 1. Requisitos Previos

- **Node.js**: Versión 18.0 o superior recomendada.
- **NPM**: Incluido con Node.js.
- **Cuenta de Supabase**: Para la base de datos y autenticación.
- **API Keys**: Google AI Studio (Gemini) y ElevenLabs.

### 2. Instalación

Clona el repositorio y entra en la carpeta del proyecto:

```bash
git clone https://github.com/rerm06/sonic-branding-premium-innovai.git
cd sonic-branding-premium-innovai
```

Instala las dependencias:

```bash
npm install
```

### 3. Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en la siguiente estructura:

```bash
# Google Gemini API Key
VITE_GEMINI_API_KEY="tu_api_key_aqui"

# ElevenLabs API Key
VITE_ELEVENLABS_API_KEY="tu_api_key_aqui"

# Supabase (Opcional si usas los del cliente hardcodeado para pruebas)
VITE_SUPABASE_URL="tu_url_supabase"
VITE_SUPABASE_ANON_KEY="tu_anon_key"
```

### 4. Configuración de Base de Datos (Supabase)

Para que el **Innovation Lab** y el **Music Lab** funcionen correctamente, debes crear las tablas necesarias. Ve a tu editor SQL en Supabase y ejecuta:

```sql
-- Tabla para activos generados en el laboratorio
CREATE TABLE IF NOT EXISTS innovation_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'audio', 'video')),
  url TEXT NOT NULL,
  prompt TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE innovation_assets ENABLE ROW LEVEL SECURITY;

-- Políticas de Acceso
CREATE POLICY "Users can view their own lab assets" ON innovation_assets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own lab assets" ON innovation_assets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own lab assets" ON innovation_assets FOR DELETE USING (auth.uid() = user_id);
```

### 5. Ejecución del Servidor de Desarrollo

Inicia la aplicación en modo desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 📦 Producción & Despliegue

### Construcción del Proyecto

Para generar el bundle optimizado para producción:

```bash
npm run build
```

Esto creará una carpeta `dist/` con todos los archivos estáticos listos para ser desplegados en Vercel, Netlify o cualquier servidor estático.

### Previsualización

Para probar el build de producción localmente:

```bash
npm run preview
```

---

## 📂 Estructura del Proyecto

```text
src/
├── components/     # Bloques de UI Premium organizados por módulos
├── context/        # Estados globales (Presentation & Studio)
├── lib/            # Singletons de servicios (Supabase, AI, Audio)
├── modules/        # Business Logic para campañas de IA
├── scripts/        # Utilidades de ingesta y mantenimiento
├── App.tsx         # Orquestador principal de navegación
└── index.tsx       # Punto de entrada de React
```

---

## 🛡️ Seguridad y Buenas Prácticas

- **Cero `any`**: El proyecto está estrictamente tipado con TypeScript.
- **Glassmorphism**: Todos los paneles usan la utilidad `.glass-panel` definida en `index.css`.
- **Rutas Prohibidas**: Los archivos sensibles como `.env` están explícitamente excluidos en `.gitignore`.

---

## 📝 Notas de Versión
**v1.0.0**: Migración completa a estructura `/src` y soporte para Tailwind 4.0. Sincronización con Repositorio Premium InnovAi.

---
> Desarrollado por **Innovai Solution** bajo el estándar "Elite" de Google Antigravity.
