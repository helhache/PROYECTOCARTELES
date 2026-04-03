import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { useState } from 'react';
import axios from 'axios';

export default function BotonesExportarLocal({ orientacion, esColor, activacionId, descripcion }) {
  const [exportando, setExportando] = useState(false);

  const capturar = async () => {
    const nodo = document.getElementById('preview-cartel');
    if (!nodo) throw new Error('No se encontró el cartel');
    return toPng(nodo, { quality: 1, pixelRatio: 2 });
  };

  const registrarDescarga = async (tipo) => {
    try {
      await axios.post('/api/asignaciones/log', {
        activacion_id: activacionId,
        tipo_exportacion: tipo,
        es_color: esColor,
      });
    } catch {}
  };

  const exportarPDF = async () => {
    setExportando(true);
    try {
      const dataUrl = await capturar();
      const nodo = document.getElementById('preview-cartel');
      const esH = orientacion === 'horizontal';
      const pdf = new jsPDF({ orientation: esH ? 'landscape' : 'portrait', unit: 'mm', format: 'a4' });
      const pdfAncho = esH ? 297 : 210;
      const pdfAlto = esH ? 210 : 297;
      const prop = Math.min(pdfAncho / nodo.offsetWidth, pdfAlto / nodo.offsetHeight);
      const iW = nodo.offsetWidth * prop;
      const iH = nodo.offsetHeight * prop;
      pdf.addImage(dataUrl, 'PNG', (pdfAncho - iW) / 2, (pdfAlto - iH) / 2, iW, iH);
      pdf.save(`cartel_${descripcion || 'cartel'}_${Date.now()}.pdf`.replace(/\s+/g, '_').toLowerCase());
      await registrarDescarga('PDF');
    } catch (err) {
      alert('Error al generar PDF');
    } finally {
      setExportando(false);
    }
  };

  const exportarPNG = async () => {
    setExportando(true);
    try {
      const dataUrl = await capturar();
      const a = document.createElement('a');
      a.download = `cartel_${descripcion || 'cartel'}_${Date.now()}.png`.replace(/\s+/g, '_').toLowerCase();
      a.href = dataUrl;
      a.click();
      await registrarDescarga('PNG');
    } catch {
      alert('Error al generar PNG');
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="botones-exportar" style={{ flexDirection: 'row', marginTop: '1rem' }}>
      <button className="btn-exportar btn-pdf" onClick={exportarPDF} disabled={exportando} style={{ flex: 1 }}>
        {exportando ? 'Generando...' : 'Descargar PDF'}
      </button>
      <button className="btn-exportar btn-png" onClick={exportarPNG} disabled={exportando} style={{ flex: 1 }}>
        {exportando ? 'Generando...' : 'Descargar PNG'}
      </button>
    </div>
  );
}
