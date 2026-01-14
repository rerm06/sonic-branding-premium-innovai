# GEMINI.md — Plan Maestro del Proyecto

## 1) Resumen ejecutivo
- Qué se va a construir: Una plataforma de Sonic Branding Premium para ICPR Junior College.
- Valor para el usuario: Centralizar la identidad sonora y visual en una experiencia interactiva de alta fidelidad.
- Resultado esperado: Repositorio en GitHub con código estructurado en `/src` y documentación detallada.

## 2) Interpretación de la solicitud
- Intención del usuario: Subir el proyecto completo a GitHub.
- Alcance IN: Estructuración `/src`, README ultra-detallado, configuración de remotos, push de archivos.
- Alcance OUT: Hosting final (Netlify/Vercel) no solicitado explícitamente pero preparado en build.

## 3) Supuestos y decisiones (sin preguntas)
1. Supuesto: El usuario tiene un token de GitHub configurado localmente pero falla la autenticación de terminal.
2. Decisión: Usar MCP `github-mcp-server` para realizar los pushes iniciales y asegurar la integridad del repositorio remoto.

## 4) Entregables
- Repositorio: `sonic-branding-premium-innovai`
- Estructura limpia en `/src`.
- README.md para no-desarrolladores.

## 5) Criterios de aceptación y validación
- El repositorio en GitHub debe reflejar la estructura local actual.
- Las dependencias deben estar actualizadas en `package.json`.
- La configuración de Vite y Tailwind debe apuntar a `/src`.

## 8) Plan por fases (end-to-end)
Fase 0: Preparación (Restructuración `/src`). Completado.
Fase 1: Documentación (README ultra-detallado). Completado.
Fase 2: GitHub (Creación y Push inicial). Completado vía MCP.
Fase 3: Validación Final. En curso.
