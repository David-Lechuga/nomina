# Calculadora de Nóminas 2026 · Policía Local de Vejer

Versión actualizada.

## Cambios
- Se elimina el campo genérico de productividad/gratificaciones.
- En Antigüedad y noches, cada selector muestra su importe total calculado.
- En Horas extraordinarias, cada selector muestra su importe total calculado.
- Pagas adicionales y Retenciones aparecen en apartados independientes.
- El resumen se actualiza automáticamente.

## Probar
1. Descomprime el ZIP.
2. Abre la carpeta `calculadora_nominas_vejer` en Visual Studio Code.
3. Abre `index.html` y pulsa `Go Live`.
4. Compara varios resultados con el Excel original antes de publicar.

## Fórmulas estimadas
- Base Seguridad Social: `bruto + 422`.
- Seguridad Social: `((bruto + 422) * 6,71) / 100`.
- IRPF: `(bruto * porcentaje_IRPF) / 100`.
- Líquido: `bruto - Seguridad Social - IRPF`.

Comprueba los importes y fórmulas con la hoja Excel original antes de utilizar la calculadora como referencia definitiva.
