# GEMINI.md — Plan Maestro del Proyecto: Nuevo Repositorio GitHub

## 1) Resumen ejecutivo
- Este proyecto consiste en la creación de un **nuevo repositorio en GitHub** para la plataforma **Sonic Branding Premium**, asegurando que todo el código actual, estética y módulos de IA se sincronicen correctamente en una nueva ubicación remota.

## 2) Interpretación de la solicitud
- **Intención del usuario**: Crear un repositorio limpio y nuevo en GitHub para el proyecto actual.
- **Alcance IN**: 
  - Creación de repositorio vía API de GitHub.
  - Configuración de remotos en Git local.
  - Push de la rama `main` al nuevo repositorio.
- **Alcance OUT**: 
  - Migración de issues o PRs antiguos.

## 3) Supuestos y decisiones (sin preguntas)
- **Supuestos**:
  1. El usuario desea el repositorio en su cuenta personal (`rerm06`).
  2. El nombre del repositorio será `sonic-branding-premium-innovai`.
- **Decisiones**:
  1. Se creará el repo como **público** para facilitar la visibilidad inicial (a menos que se indique lo contrario, pero por defecto los proyectos de portafolio suelen serlo).
  2. Se renombrará el remoto actual `origin` a `backup` y el nuevo será `origin`.

## 4) Entregables
- Nuevo repositorio en GitHub: `https://github.com/rerm06/sonic-branding-premium-innovai`.
- Código fuente sincronizado.

## 5) Criterios de aceptación y validación
- El comando `git push origin main` debe ejecutarse exitosamente.
- URL del repositorio accesible y con archivos visibles.

## 6) Arquitectura y diseño
- **Repositorio**: GitHub Personal.
- **Branch Strategy**: Main branch as primary.

## 7) Cadena multi‑agente (roles y handoffs)
- **Agent 1: Architect (Orchestrator)**: Gestiona la creación del repo y configuración de Git.
- **Agent 2: Implementation (Git)**: Ejecuta los comandos de push y config.
- **Agent 3: Validator**: Confirma la existencia del repo y la integridad de los archivos.

## 8) Plan por fases (end-to-end)
- **Fase 0**: Preparación (Verificar estado local).
- **Fase 1**: Crear repositorio en GitHub.
- **Fase 2**: Reconfigurar remotos locales.
- **Fase 3**: Push inicial.
- **Fase 4**: Validación final.

## 9) Políticas de ejecución (terminal/browser) y seguridad
- No se incluirán archivos sensibles (ignorados por `.gitignore`).
- Se verificará el contenido de `RECREATION_PROMPT.md` antes de subir.

## 10) Estándares de calidad
- commits limpios.
- Documentación mínima requerida en el repo.

## 11) Registro de cambios y evidencia
- [x] Creación de repo: Exitoso.
- [ ] Push local: Fallido (Terminal Auth).
- [x] Sincronización vía MCP (Archivos base): Completada.
