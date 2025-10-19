# ⏰ Registro Ágil de Fugas de Tiempo

<div align="center">

Una aplicación web para registrar de forma rápida y sencilla las "fugas de tiempo" a medida que ocurren, permitiendo un análisis posterior de los patrones de pérdida de tiempo.

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.75.1-3ECF8E?logo=supabase)](https://supabase.com/)

</div>

## 📋 Descripción

**Fugas de Tiempo** es una herramienta diseñada para ayudarte a identificar y analizar las interrupciones y pérdidas de tiempo en tu jornada laboral. Registra cada interrupción en el momento en que ocurre y obtén estadísticas visuales para mejorar tu productividad.

### ✨ Características Principales

- 🎯 **Registro Rápido**: Captura interrupciones en segundos con una interfaz intuitiva
- 📊 **Estadísticas Visuales**: Analiza tus patrones de pérdida de tiempo con gráficos interactivos
- 🏷️ **Categorización**: 5 categorías predefinidas de fugas de tiempo
  - Interrupciones
  - Correos impulsivos
  - Microtareas imprevistas
  - Reuniones inesperadas
  - Reuniones que se alargan
- ✏️ **Gestión Completa**: Edita o elimina registros según sea necesario
- 🔐 **Autenticación Segura**: Sistema de usuarios con Supabase Auth
- 📱 **Diseño Responsive**: Funciona perfectamente en móviles, tablets y escritorio
- 🌙 **Interfaz Moderna**: Tema oscuro y diseño minimalista

## 🚀 Inicio Rápido

### Prerequisitos

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- Una cuenta de [Supabase](https://supabase.com/) (gratis)

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd fuga-tiempo
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` y añade tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-anon-key
   ```
   
   > 💡 **¿Dónde encuentro mis credenciales?**
   > 1. Accede a tu proyecto en [Supabase](https://app.supabase.com/)
   > 2. Ve a Settings → API
   > 3. Copia la URL del proyecto y la clave `anon` `public`

4. **Configura la base de datos**
   
   Abre el editor SQL de Supabase y ejecuta el script de creación de la base de datos:
   
   - Ve a tu proyecto en Supabase → SQL Editor
   - Copia y ejecuta el contenido del archivo [`data/bbdd.sql`](./data/bbdd.sql)
   
   Este script creará:
   - La tabla `fugas_tiempo` con todos los campos necesarios
   - Las políticas de Row Level Security (RLS) para proteger los datos
   - Índices para mejorar el rendimiento de las consultas

5. **Inicia la aplicación**
   ```bash
   npm run dev
   ```
   
   La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
fuga-tiempo/
├── auth/                    # Componentes de autenticación
│   └── Auth.tsx            # Página de login/registro
├── components/             # Componentes reutilizables
│   ├── Icons.tsx          # Iconos SVG
│   └── Notification.tsx   # Sistema de notificaciones
├── constants/             # Constantes y configuración
│   ├── categories.tsx     # Categorías de fugas
│   └── strings.ts         # Textos de la aplicación
├── data/                  # Scripts de base de datos
│   └── bbdd.sql          # Script de creación de tablas
├── data-entry/            # Módulo de registro
│   └── DataEntry.tsx      # Formulario de registro rápido
├── list/                  # Módulo de listado
│   ├── List.tsx          # Tabla de registros
│   ├── EditModal.tsx     # Modal de edición
│   └── DeleteConfirmModal.tsx
├── services/              # Servicios externos
│   └── supabaseService.ts # API de Supabase
├── sidebar/               # Navegación
│   └── Sidebar.tsx        # Menú lateral
├── statistics/            # Módulo de estadísticas
│   ├── Statistics.tsx     # Página de análisis
│   └── BarChart.tsx       # Gráfico de barras
├── utils/                 # Utilidades
│   └── date.ts           # Funciones de fecha
├── App.tsx                # Componente principal
├── types.ts               # Tipos TypeScript
└── index.tsx              # Punto de entrada
```

## 🛠️ Tecnologías Utilizadas

- **[React 19](https://reactjs.org/)** - Biblioteca de UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Vite](https://vitejs.dev/)** - Build tool y dev server
- **[Supabase](https://supabase.com/)** - Backend as a Service
  - Autenticación de usuarios
  - Base de datos PostgreSQL
  - Row Level Security (RLS)
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilos mediante clases utility

## 📝 Scripts Disponibles

```bash
# Desarrollo - inicia el servidor de desarrollo
npm run dev

# Construcción - genera la versión de producción
npm run build

# Vista previa - previsualiza la versión de producción
npm run preview
```

## 🎯 Uso de la Aplicación

### 1. Registro de Usuario
- Crea una cuenta nueva o inicia sesión con tu cuenta existente
- Recibirás un email de verificación en el registro

### 2. Registrar una Fuga de Tiempo
1. Selecciona la categoría que mejor describe la interrupción
2. La fecha y hora se establecen automáticamente (puedes modificarlas)
3. Opcionalmente, indica la duración en minutos
4. Añade detalles adicionales si lo deseas
5. Haz clic en "Registrar Fuga de Tiempo"

### 3. Ver Estadísticas
- Accede a la sección "Estadísticas" desde el menú lateral
- Selecciona un rango de fechas
- Visualiza un gráfico de barras con los minutos totales por categoría

### 4. Gestionar Registros
- Ve a "Listado" para ver todos tus registros
- Edita o elimina registros según sea necesario

## 🔒 Seguridad

- Todas las credenciales se gestionan mediante variables de entorno
- El archivo `.env` está incluido en `.gitignore` para prevenir exposición de secretos
- Se implementa Row Level Security (RLS) en Supabase para protección de datos
- Cada usuario solo puede ver y modificar sus propios registros

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si encuentras algún problema o tienes sugerencias:

1. Crea un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🐛 Solución de Problemas

### Error: "Missing Supabase environment variables"
- Asegúrate de haber creado el archivo `.env` con las variables correctas
- Reinicia el servidor de desarrollo después de crear/modificar el `.env`

### La autenticación no funciona
- Verifica que las credenciales de Supabase sean correctas
- Asegúrate de que el email de verificación no esté en spam
- Comprueba que la tabla `fugas_tiempo` existe y tiene las políticas RLS configuradas

### No se muestran los registros
- Verifica que estás autenticado
- Comprueba que las políticas RLS estén correctamente configuradas
- Revisa la consola del navegador para ver posibles errores

## 📧 Contacto

Si tienes preguntas o necesitas ayuda, no dudes en contactar.

---

<div align="center">
Hecho con ❤️ para mejorar la productividad
</div>
