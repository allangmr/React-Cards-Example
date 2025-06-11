# 🚪 Configurador de Puertas de Seguridad

Una aplicación web moderna y responsiva para configurar puertas de seguridad personalizadas, construida con React, TypeScript, y las mejores prácticas de desarrollo frontend.

## ✨ Características

- **Step-by-Step Configuration**: Interfaz intuitiva con navegación por pasos
- **Interactive Material Cards**: Cards interactivas con 3 tipos de imagen (rounded, square, wide 16:9)
- **Real-time Price Calculation**: Cálculo automático del precio total
- **Redux State Management**: Gestión de estado centralizada con Redux Toolkit
- **Responsive Design**: Diseño totalmente responsivo para todas las pantallas
- **Modern UI/UX**: Interfaz moderna con animaciones suaves
- **Type Safety**: Completamente tipado con TypeScript
- **Testing**: Tests unitarios con Vitest y Testing Library
- **Component Documentation**: Documentación de componentes con Storybook

## 🛠️ Tecnologías Utilizadas

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **State Management**: Redux Toolkit + React Redux
- **Styling**: Sass con arquitectura BEM
- **Type System**: TypeScript 5.8.3
- **Testing**: Vitest + React Testing Library
- **Component Documentation**: Storybook
- **Linting**: ESLint con configuración moderna

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── MaterialCard/    # Card para selección de materiales
│   ├── StepMenu/        # Menú lateral de navegación por pasos
│   ├── StepNavigation/  # Navegación flotante inferior
│   ├── Layout/          # Layout principal de la aplicación
│   └── DoorConfigurator/ # Componente principal del configurador
├── store/               # Configuración de Redux
│   ├── index.ts         # Store principal
│   └── configuratorSlice.ts # Slice del configurador
├── hooks/               # Hooks personalizados
│   └── redux.ts         # Hooks tipados para Redux
├── types/               # Tipos TypeScript
│   └── index.ts         # Definiciones de tipos principales
├── styles/              # Estilos globales y variables Sass
│   ├── _variables.scss  # Variables de diseño
│   └── _mixins.scss     # Mixins reutilizables
├── utils/               # Utilidades y helpers
│   └── mockData.ts      # Datos de ejemplo
└── App.tsx              # Componente raíz
```

## 🎨 Características del Diseño

### Step Menu (Sidebar)
- **Posición**: Fijo a la izquierda (280px de ancho)
- **Funcionalidades**: 
  - Navegación visual por pasos
  - Indicadores de progreso
  - Estados: current, completed, disabled
  - Barra de progreso general

### Material Cards
- **Tipos de imagen**:
  - `rounded`: Imágenes circulares (1:1) para cerraduras y accesorios
  - `square`: Imágenes cuadradas (1:1) para materiales y colores
  - `wide`: Imágenes rectangulares (16:9) para vistas de puertas completas
- **Interactividad**: Hover effects, selección visual
- **Accesibilidad**: Inputs nativos con labels asociados

### Step Navigation (Footer flotante)
- **Posición**: Fijo en la parte inferior
- **Funcionalidades**:
  - Navegación entre pasos
  - Display del precio total en tiempo real
  - Botones de acción contextuales

## 🚀 Instalación y Uso

### Prerequisitos
- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd door-security-configurator

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar tests
npm run test

# Ejecutar Storybook
npm run storybook

# Build para producción
npm run build
```

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run test         # Ejecutar tests
npm run test:ui      # Tests con interfaz visual
npm run test:coverage # Tests con reporte de cobertura
npm run lint         # Linter
npm run storybook    # Documentación de componentes
npm run build-storybook # Build de Storybook
```

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: Layout completo con sidebar
- **Tablet**: Navegación adaptada
- **Mobile**: Sidebar colapsable, navegación optimizada

## 🧪 Testing

El proyecto incluye tests unitarios para:
- Componentes principales
- Lógica de Redux
- Interacciones de usuario
- Renderizado condicional

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con UI visual
npm run test:ui
```

## 📚 Storybook

Documentación interactiva de componentes disponible:

```bash
npm run storybook
```

Incluye:
- Documentación automática
- Controles interactivos
- Diferentes variantes de componentes
- Estados de ejemplo

## 🎯 Flujo de Usuario

1. **Paso 1 - Cerradura**: Selección de tipo de cerradura (radio buttons)
2. **Paso 2 - Material**: Elección del material principal (radio buttons)
3. **Paso 3 - Refuerzo Militar**: Selección múltiple de refuerzos (checkboxes)
4. **Paso 4 - Color**: Personalización del acabado (radio buttons)
5. **Paso 5 - Accesorios**: Selección múltiple de extras (checkboxes)

Cada paso:
- Valida la selección antes de continuar
- Actualiza el precio total en tiempo real
- Permite navegación hacia atrás para modificaciones
- Guarda el progreso automáticamente

## 🔧 Configuración de Estado

El estado global se maneja con Redux Toolkit:

```typescript
interface ConfiguratorState {
  currentStep: number;
  steps: Step[];
  stepConfigs: StepConfig[];
  selections: Selection[];
  totalPrice: number;
}
```

## 🎨 Sistema de Diseño

### Colores
- **Primary**: #2c3e50 (Azul oscuro)
- **Secondary**: #3498db (Azul)
- **Accent**: #e74c3c (Rojo)
- **Success**: #27ae60 (Verde)

### Tipografía
- **Font Family**: Inter
- **Tamaños**: 0.75rem - 2rem
- **Pesos**: 300, 400, 500, 600, 700

### Espaciado
- **Sistema**: 0.25rem - 3rem
- **Consistencia**: Múltiplos de 0.25rem

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Desarrollado por

Este proyecto fue creado como una demostración de desarrollo frontend moderno con React, TypeScript y las mejores prácticas de la industria.

---

**¡Explora el configurador y personaliza tu puerta de seguridad ideal! 🚪✨**
