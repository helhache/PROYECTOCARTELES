import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { useState } from 'react';

// Botones para exportar el cartel como PDF o PNG
function BotonesExportar({ orientacion, nombreProducto }) {
  const [exportando, setExportando] = useState(false);

  // Captura el div#preview-cartel como imagen PNG
  const capturarImagen = async () => {
    const nodo = document.getElementById('preview-cartel');
    if (!nodo) throw new Error('No se encontró el elemento del cartel');

    const dataUrl = await toPng(nodo, {
      quality: 1,
      pixelRatio: 2, // Alta resolución para impresión
    });
    return { dataUrl, ancho: nodo.offsetWidth, alto: nodo.offsetHeight };
  };

  // Exportar como PDF A4
  const exportarPDF = async () => {
    setExportando(true);
    try {
      const { dataUrl, ancho, alto } = await capturarImagen();

      // Determinar orientación del PDF
      const esHorizontal = orientacion === 'horizontal';
      const pdf = new jsPDF({
        orientation: esHorizontal ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Dimensiones A4 en mm
      const pdfAncho = esHorizontal ? 297 : 210;
      const pdfAlto = esHorizontal ? 210 : 297;

      // Calcular tamaño manteniendo proporción
      const proporcion = Math.min(pdfAncho / ancho, pdfAlto / alto);
      const imgAncho = ancho * proporcion;
      const imgAlto = alto * proporcion;

      // Centrar la imagen en la página
      const x = (pdfAncho - imgAncho) / 2;
      const y = (pdfAlto - imgAlto) / 2;

      pdf.addImage(dataUrl, 'PNG', x, y, imgAncho, imgAlto);

      const nombreArchivo = `cartel_${nombreProducto || 'exportado'}_${Date.now()}.pdf`;
      pdf.save(nombreArchivo.replace(/\s+/g, '_').toLowerCase());
    } catch (err) {
      console.error('Error al exportar PDF:', err);
      alert('Error al generar el PDF. Intentá de nuevo.');
    } finally {
      setExportando(false);
    }
  };

  // Exportar directamente como PNG
  const exportarPNG = async () => {
    setExportando(true);
    try {
      const { dataUrl } = await capturarImagen();

      // Crear link de descarga
      const link = document.createElement('a');
      link.download = `cartel_${nombreProducto || 'exportado'}_${Date.now()}.png`.replace(/\s+/g, '_').toLowerCase();
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al exportar PNG:', err);
      alert('Error al generar el PNG. Intentá de nuevo.');
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="botones-exportar">
      <p className="form-label" style={{ textAlign: 'center' }}>Exportar Cartel</p>
      <button className="btn-exportar btn-pdf" onClick={exportarPDF} disabled={exportando}>
        {exportando ? '⏳ Generando...' : '📄 Descargar PDF'}
      </button>
      <button className="btn-exportar btn-png" onClick={exportarPNG} disabled={exportando}>
        {exportando ? '⏳ Generando...' : '🖼️ Descargar PNG'}
      </button>
    </div>
  );
}

export default BotonesExportar;
