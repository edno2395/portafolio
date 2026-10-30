# Portafolio | Eder Humberto Nole Yacila

**Ingeniero de Sistemas titulado · Desarrollo de software y automatización de procesos**

[Ver portafolio en línea](https://edno2395.github.io/portafolio/) · [Repositorio](https://github.com/edno2395/portafolio)

## Sobre el proyecto

Portafolio profesional donde presento soluciones desarrolladas para optimizar procesos, automatizar tareas, procesar información y crear aplicaciones web y sistemas de gestión. Reúne proyectos realizados con **Python, PowerShell, PHP, JavaScript y bases de datos**, con una interfaz minimalista, responsiva y orientada a facilitar la exploración de mis trabajos.

## Funcionalidades

- **Carrusel de proyectos adaptable:** muestra tarjetas con imágenes, descripciones y tecnologías, con navegación mediante flechas y gestos táctiles.
- **Búsqueda y filtros dinámicos:** permite localizar proyectos por nombre o tecnología y filtrarlos por categoría.
- **Galerías de capturas:** permite explorar las imágenes de cada proyecto.
- **Panel administrativo (`/admin/`):** facilita agregar, editar, ordenar, ocultar y eliminar proyectos, así como gestionar categorías.
- **Publicación mediante GitHub:** los cambios del administrador se envían al repositorio mediante la API de GitHub, con un token autorizado.
- **Gestión de imágenes:** admite imágenes alojadas en el repositorio (`assets/proyectos/`) y enlaces externos.
- **Contacto profesional:** formulario conectado a **Formspree**, avisos con **SweetAlert2** y acceso directo a **WhatsApp**.
- **Diseño responsivo:** adaptado a computadora, tablet y celular.

## Proyectos y áreas de trabajo

Entre los proyectos presentados o desarrollados se encuentran:

- **Gestión de asientos contables:** automatización de procesos y reportes contables con Python.
- **Carga masiva de datos a Oracle:** importación y validación de archivos con Python y SQL*Loader.
- **Extracción masiva SFTP:** automatización de transferencias con PowerShell y WinSCP.
- **Convertidor Excel a TXT:** transformación de archivos y seguimiento del procesamiento.
- **Bot de consulta y validación OSIPTEL:** automatización de consultas y comparación de registros con Excel, Python y Playwright.
- **Sistemas de gestión:** aplicaciones para ventas, inventario y procesos administrativos.
- **Desarrollo web:** sitios y páginas de presentación responsivas.

Los proyectos publicados y su orden se administran desde el panel, sin editar manualmente las tarjetas del HTML.

## Tecnologías

| Área | Herramientas y tecnologías |
| --- | --- |
| Frontend | HTML5, CSS3, JavaScript, Bootstrap |
| Backend y aplicaciones | Python, PHP, programación orientada a objetos, AJAX |
| Bases de datos | Oracle Database / PL/SQL, MySQL, SQL Server |
| Automatización | Python, PowerShell, Playwright, WinSCP, SQL*Loader |
| Procesamiento de datos | Excel, CSV, TXT, Pandas, OpenPyXL |
| Servicios e integración | GitHub Pages, GitHub API, Formspree, SweetAlert2, WhatsApp |

## Estructura principal

```text
portafolio/
├── index.html                  # Sitio público
├── admin/                      # Administrador de proyectos y categorías
├── data/
│   ├── proyectos.json          # Proyectos publicados y orden
│   └── categorias.json         # Catálogo de categorías
├── assets/
│   └── proyectos/              # Capturas e imágenes
├── dist/
│   ├── css/                    # Estilos
│   └── js/                     # Interacciones del sitio
└── README.md
```

## Ejecución local

Se puede ejecutar sin instalar un framework de frontend. Desde una terminal, en la carpeta raíz:

```bash
python -m http.server 8000
```

Abrir:

- Sitio público: `http://localhost:8000/`
- Panel administrativo: `http://localhost:8000/admin/`

> Es importante utilizar un servidor local en lugar de abrir `index.html` con `file://`, ya que los proyectos se cargan mediante `fetch` desde archivos JSON.

## Publicación y administración

El sitio se publica con **GitHub Pages** desde la rama `main` y la carpeta raíz (`/`). Para actualizar proyectos, el administrador permite publicar cambios en los archivos de datos utilizando un **fine-grained personal access token** con permiso `Contents: Read and write` limitado a este repositorio.

**Seguridad:** nunca se deben subir tokens, contraseñas, credenciales, DNI, información de clientes ni capturas con datos confidenciales. El acceso a `/admin/` es público en GitHub Pages; las operaciones de escritura requieren autorización de GitHub. La ofuscación del HTML no sustituye un mecanismo de seguridad.

## Contacto

Puedes contactarme desde el [formulario del portafolio](https://edno2395.github.io/portafolio/#contacto) o por los canales profesionales disponibles en la página.

---

© 2026 Eder Humberto Nole Yacila. Portafolio personal.
