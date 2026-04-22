# Generacion de PDF desde Markdown

El proyecto esta preparado para exportar documentos .md a PDF con Pandoc desde VS Code mediante la task definida en .vscode/tasks.json (Pandoc -> PDF (Eisvogel)).

## Requisitos

- Pandoc
- XeLaTeX (incluido en MacTeX)
- Plantilla Eisvogel
- Node.js y npm (para renderizar bloques Mermaid con Mermaid CLI via npx)

## Instalacion en macOS (recomendada)

```bash
brew install pandoc
brew install --cask mactex-no-gui
brew install eisvogel
```

Nota: tras instalar MacTeX, puede ser necesario reiniciar terminal/VS Code para que xelatex quede en el PATH.

## Como generar un PDF

1. Abre el archivo .md que quieras exportar (por ejemplo docs/Anteproyecto.md).
2. Ejecuta la tarea de compilacion con Cmd+Shift+B.
3. Selecciona Pandoc -> PDF (Eisvogel) si se solicita.
4. El PDF se genera en la carpeta pdf junto al markdown (por ejemplo docs/pdf/Anteproyecto.pdf).

### Si el markdown tiene bloques Mermaid

1. Abre el .md con diagrama Mermaid.
2. Ejecuta una de estas tareas:
	- `Pandoc -> PDF (Eisvogel + Mermaid)`: limpia todos los temporales (`.mmd`, `.png`, `.svg`).
	- `Pandoc -> PDF (Eisvogel + Mermaid, cache PNG)`: limpia solo (`.mmd`, `.svg`) y conserva `.png` para recompilaciones mas rapidas.
3. El filtro Lua `filters/mermaid.lua` convierte cada bloque Mermaid en un PNG temporal bajo `docs/images/mermaid/`.
4. Pandoc inserta esos PNG en el PDF final.
5. La limpieza final depende de la tarea elegida.

## Comando equivalente en terminal

```bash
cd docs
pandoc Anteproyecto.md -o pdf/Anteproyecto.pdf --template=eisvogel --pdf-engine=xelatex
```

Con Mermaid:

```bash
cd docs
pandoc arquitectura-modelo-er.md -o pdf/arquitectura-modelo-er.pdf --template=eisvogel --pdf-engine=xelatex --lua-filter=filters/mermaid.lua
```

Para limpiar temporales al terminar tambien en terminal:

```bash
cd docs
pandoc arquitectura-modelo-er.md -o pdf/arquitectura-modelo-er.pdf --template=eisvogel --pdf-engine=xelatex --lua-filter=filters/mermaid.lua; exit_code=$?; if [ -d images/mermaid ]; then find images/mermaid -type f \( -name '*.mmd' -o -name '*.png' -o -name '*.svg' \) -delete; fi; exit $exit_code
```

Para conservar cache PNG y limpiar solo `.mmd` y `.svg` en terminal:

```bash
cd docs
pandoc arquitectura-modelo-er.md -o pdf/arquitectura-modelo-er.pdf --template=eisvogel --pdf-engine=xelatex --lua-filter=filters/mermaid.lua; exit_code=$?; if [ -d images/mermaid ]; then find images/mermaid -type f \( -name '*.mmd' -o -name '*.svg' \) -delete; fi; exit $exit_code
```

## Errores comunes

- Error con imagenes no encontradas: ejecuta la conversion desde la carpeta del .md (o usa la task de VS Code, que ya lo hace).
- xelatex no encontrado: instala/reinstala MacTeX y abre una terminal nueva.
- plantilla eisvogel no encontrada: instala la plantilla o ajusta --template a una ruta local valida.
- Mermaid no renderiza y aparece como codigo: usa una tarea con Mermaid (`Pandoc -> PDF (Eisvogel + Mermaid)` o `Pandoc -> PDF (Eisvogel + Mermaid, cache PNG)`) o el comando con `--lua-filter=filters/mermaid.lua`.
