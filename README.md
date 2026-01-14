# 🎙️ Sonic Branding Premium - InnovAi: Guía para Principiantes

¡Bienvenido! Esta es la guía maestra para poner en marcha la plataforma de **Sonic Branding del ICPR (80 Aniversario)**. Si no sabes nada de programación, GitHub o terminales, no te preocupes. Esta guía está diseñada para llevarte de la mano, paso a paso, como si estuviéramos juntos frente a la computadora.

---

## 🌟 ¿Qué es esta aplicación?
Es una "estación de trabajo inteligente". Permite crear música, voces y diseños usando Inteligencia Artificial para la marca ICPR. Imagínalo como un centro de mando donde la IA hace el trabajo pesado de creación.

---

## 🛠️ Requisitos: Lo que necesitas tener instalado
Antes de empezar, necesitamos dos "herramientas" básicas en tu computadora:

1.  **Node.js**: Es el "motor" que permite que la aplicación funcione.
    *   **Cómo instalarlo**: Ve a [nodejs.org](https://nodejs.org/), descarga la versión que dice **"LTS"** (la más estable) e instálala como cualquier otro programa (Siguiente, Siguiente, Siguiente).
2.  **Visual Studio Code (VS Code)**: Es el "bloc de notas" especial donde veremos el código.
    *   **Cómo instalarlo**: Descárgalo en [code.visualstudio.com](https://code.visualstudio.com/).
3.  **Git**: Es el sistema que nos permite descargar el proyecto de internet.
    *   **Cómo instalarlo**: Ve a [git-scm.com](https://git-scm.com/) y descárgalo.

---

## 🚀 Paso a Paso: Desde Cero hasta Correr la App

### Paso 1: Descargar el Proyecto (Clonar)
1.  Abre el programa **Terminal** (en Mac busca "Terminal" en Spotlight; en Windows busca "PowerShell").
2.  Escribe esto y presiona la tecla Enter:
    ```bash
    git clone https://github.com/rerm06/sonic-branding-premium-innovai.git
    ```
    *Esto creará una carpeta en tu computadora con todos los archivos.*
3.  Entra a esa carpeta escribiendo:
    ```bash
    cd sonic-branding-premium-innovai
    ```

### Paso 2: Instalar las "Piezas" (Dependencias)
La aplicación es como un set de LEGO. Ya tienes las instrucciones, ahora necesitamos traer todas las piezas.
1.  En la misma terminal, escribe esto y espera a que termine:
    ```bash
    npm install
    ```
    *Verás muchas barras de carga. Es normal. Significa que está descargando las herramientas necesarias.*

### Paso 3: Configurar las "Llaves" (API Keys)
Para que la Inteligencia Artificial te conteste, necesitamos poner las "llaves" de los servicios.
1.  Abre la carpeta del proyecto en **Visual Studio Code**.
2.  Busca un archivo llamado `.env` (si no existe, crea uno nuevo con ese nombre exacto: punto e n v).
3.  Copia y pega este texto dentro, reemplazando lo que está entre comillas con tus llaves reales:
    ```text
    VITE_GEMINI_API_KEY="TU_LLAVE_DE_GOOGLE_AQUI"
    VITE_ELEVENLABS_API_KEY="TU_LLAVE_DE_ELEVENLABS_AQUI"
    ```
    *¿Dónde consigo estas llaves?*
    - **Google Gemini**: En [Google AI Studio](https://aistudio.google.com/).
    - **ElevenLabs**: En tu perfil de [ElevenLabs.io](https://elevenlabs.io/).

### Paso 4: Preparar la Base de Datos (Supabase)
La app necesita un lugar donde guardar lo que creas.
1.  Entra a [supabase.com](https://supabase.com/) y crea un proyecto gratuito.
2.  Busca una sección llamada **"SQL Editor"** (tiene un icono de `>_`).
3.  Haz clic en "New Query" y pega este código (no intentes entenderlo, solo pégalo y dale al botón **RUN**):
    ```sql
    -- Este código crea el espacio para guardar tus audios y videos
    CREATE TABLE IF NOT EXISTS innovation_assets (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK (type IN ('image', 'audio', 'video')),
      url TEXT NOT NULL,
      prompt TEXT,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ```

### Paso 5: ¡Encender la Aplicación!
Este es el momento de la verdad.
1.  Regresa a tu terminal y escribe:
    ```bash
    npm run dev
    ```
2.  Verás un mensaje que dice algo como: `  ➜  Local:   http://localhost:3000/`
3.  Presiona la tecla **Command (o Ctrl)** y haz clic en ese enlace, ¡o ábrelo en tu navegador favorito!

---

## 📂 ¿Qué hay dentro de las carpetas? (Explicación simple)
Si abres el proyecto, verás carpetas. Aquí te explico qué son de forma sencilla:

- **`src/components`**: Aquí están las "ventanas" y "botones" que ves en la pantalla.
- **`src/lib`**: Aquí están las "neuronas" que conectan con la Inteligencia Artificial.
- **`dist`**: Es la versión "terminada" de la app, lista para subirse a internet como una página web real.
- **`public`**: Aquí guardamos las imágenes fijas y logos (como el del 80 Aniversario).

---

## 🆘 Problemas Comunes y Soluciones
- **"No se reconoce el comando npm"**: Significa que Node.js no se instaló bien. Reinicia tu computadora.
- **"Error de API Key"**: Revisa que en el archivo `.env` no haya espacios extra y que las comillas estén bien puestas.
- **"Pantalla en blanco"**: Abre la consola del navegador (clic derecho -> Inspeccionar -> Console) para ver si hay algún error en rojo.

---

## 💡 Consejo de Oro
Si alguna vez quieres actualizar la aplicación con los cambios de GitHub, solo escribe en la terminal:
```bash
git pull origin main
```

---
> Elaborado por **Innovai Solution** - Diseñado para ser entendido por humanos, no solo por máquinas. 🚀
