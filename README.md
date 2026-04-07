# 🎬 CineBoard — Production Bible

> **Workshop Edition** — Esta versión fue creada en vivo durante un workshop usando **Vibe Coding** directamente en **GitHub Copilot Agent Mode**.

CineBoard es una aplicación web interactiva que funciona como una "biblia de producción" digital para producciones audiovisuales. Permite a cada departamento de una producción tener su propio espacio organizado con tareas, documentos, comentarios y actividad en tiempo real.

## Origen

Esta app nació de una necesidad real: Sofía, estudiante de cine de 21 años y asistente de dirección, necesitaba una herramienta para organizar la pre-producción de sus proyectos. Todo estaba disperso en Google Drive, WhatsApp y documentos sueltos. CineBoard resuelve eso con un espacio centralizado y accesible para todo el equipo.

## 🛠️ Vibe Coding + Agent Mode

Esta versión fue construida **completamente con Vibe Coding** usando GitHub Copilot en Agent Mode:

- **Sin código escrito manualmente** — todo fue generado por el agente a partir de los requerimientos de la stakeholder
- **Desde cero hasta app funcional** en una sesión de workshop
- El agente configuró el proyecto, eligió el stack, creó los modelos de datos, diseñó los componentes y resolvió los errores de build de forma autónoma

## Funcionalidades

- **Dashboard** con estadísticas generales y progreso por departamento
- **8 departamentos** — Fotografía, Dirección de Arte, Cinematografía, Sonido, Producción, Vestuario, Maquillaje, Edición
- **Workspace por departamento** con tabs de Checklist, Documentos y Equipo
- **Tareas interactivas** — marcar como completadas, expandir detalles, agregar comentarios
- **Crear nuevas tareas** por departamento
- **Feed comunitario** — actividad en tiempo real de toda la producción
- **Vista de documentos** — mood boards, spreadsheets, links e imágenes organizados por departamento
- **Sidebar responsiva** con navegación mobile

## Stack técnico

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4 + shadcn/ui
- Zustand (state management)
- Lucide React (icons)

## Cómo ejecutar

```bash
pnpm install
pnpm dev
```
