# TV Perú - Que Gane El Mejor - App Center

**App Center** es una plataforma web desarrollada con **Next.js 13 (App Router)** y **TailwindCSS**, destinada a centralizar la gestión de juegos y herramientas interactivas utilizadas en el programa de televisión *"Que Gane El Mejor"* de TV Perú.

## 📺 Descripción del Proyecto

El sistema funciona como un **centro de control unificado**, ofreciendo acceso a distintos módulos y aplicaciones construidas en Unity (exportadas en WebGL), así como a utilidades internas para la producción en tiempo real. De esta manera, los operadores y el equipo de producción cuentan con una sola interfaz desde la cual pueden administrar juegos, verificar el estado de los servicios y acceder a herramientas de soporte.

## ✨ Características Principales

- **🎮 Despliegue de builds Unity WebGL** directamente en la plataforma, facilitando su acceso desde cualquier dispositivo con navegador
- **🔌 Consumo de APIs para servicios backend**, evitando dependencias en tiempo real mediante sockets. La comunicación con la nube se realiza únicamente a través de peticiones HTTP hacia el servidor principal
- **📊 Panel de estado del sistema**, con indicadores sobre la disponibilidad del backend y del servicio en la nube
- **🎨 Diseño enfocado en usabilidad y claridad**, usando TailwindCSS con estilos modernos (fondos translúcidos, gradientes, layouts responsivos)
- **🚀 Arquitectura escalable con Next.js**, que permite organizar las aplicaciones como rutas independientes, simplificando el mantenimiento y la extensión futura del sistema

## 🏗️ Arquitectura del Sistema

El proyecto está concebido bajo una **arquitectura dividida** en dos servicios:

### 1. Frontend (tvperu-qgem-appcenter)

- **Despliegue**: Servicio estático en **Vercel**
- **Función**: Servir la interfaz gráfica y los builds Unity WebGL
- **Disponibilidad**: Constante durante la emisión del programa
- **Independencia**: **No depende directamente del backend** para seguir funcionando

### 2. Backend (tvperu-qgem-MainServer)

- **Despliegue**: **Render** (capa gratuita)
- **Función**: Manejar la base de datos, almacenamiento en la nube y futuras integraciones
- **Limitaciones**: Límites de uso que pueden causar paradas temporales

## ⚡ Estrategia de Continuidad de Servicio

La división entre frontend y backend responde a la necesidad de garantizar **alta disponibilidad** del App Center durante las transmisiones en vivo:

- **Frontend (App Center)**: Fundamental e **indispensable**, debe estar siempre operativo
- **Backend**: Agrega funciones de valor añadido. Si se deshabilita, la aplicación sigue funcionando en modo **"tradicional"**
- **Modo de contingencia**: Los datos pueden descargarse manualmente (USB) para su posterior manejo si el backend está inactivo

> ⚠️ **Importante**: Si el backend cae, únicamente se pierde el servicio de la nube, pero **el colector y el resto de la plataforma siguen funcionando normalmente**.

## 🚀 Comenzar a Desarrollar

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/tvperu-qgem-appcenter.git
cd tvperu-qgem-appcenter

# Instalar dependencias
npm install
# o
yarn install
# o
pnpm install
```

### Desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

### Scripts Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo con Turbopack
npm run build        # Construye la aplicación para producción
npm run start        # Inicia el servidor de producción
npm run lint         # Ejecuta ESLint para verificar el código
```

## 📁 Estructura del Proyecto

``` cmd
tvperu-qgem-appcenter/
├── public/
│   └── unity/                 # Builds Unity WebGL
│       ├── data-collector/    # Herramienta de recolección de datos
│       └── interactive-games/ # Juegos interactivos
├── src/
│   └── app/
│       ├── globals.css        # Estilos globales con Tailwind
│       ├── layout.tsx         # Layout principal
│       └── page.tsx           # Página de inicio (App Center)
└── ...
```

## 🛠️ Tecnologías Utilizadas

- **[Next.js 15](https://nextjs.org/)** - Framework de React con App Router
- **[React 19](https://react.dev/)** - Biblioteca de interfaz de usuario
- **[TailwindCSS 4](https://tailwindcss.com/)** - Framework de CSS utilitario
- **[TypeScript](https://www.typescriptlang.org/)** - Superset de JavaScript con tipado estático
- **[Unity WebGL](https://unity.com/)** - Motor de juegos para aplicaciones web

## 🌐 Despliegue

### Producción (Vercel)

La forma más fácil de desplegar tu aplicación Next.js es usar la [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Variables de Entorno

Asegúrate de configurar las siguientes variables de entorno:

```bash
NEXT_PUBLIC_BACKEND_URL=https://tu-backend.render.com
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🤝 Contribuciones

Este es un proyecto privado desarrollado como servicio independiente para TV Perú y el programa "Que Gane El Mejor". Las contribuciones no están abiertas al público.

## 📄 Licencia

**Todos los derechos reservados.** Copyright (c) 2025 Esteban Abanto Garcia.

Este proyecto es propiedad intelectual exclusiva del desarrollador. El software fue desarrollado bajo contrato de servicios independientes para TV Perú, pero la propiedad del código fuente y la arquitectura pertenecen al autor.

**Contacto:** <esteban.abanto.2709@gmail.com>

---

**Desarrollado para:** TV Perú - Instituto Nacional de Radio y Televisión del Perú  
**Programa:** "Que Gane El Mejor"  
**Versión del Sistema:** v1.0.0  
**Modalidad:** Servicio de desarrollo independiente
