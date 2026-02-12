import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
  async generateReceipt(data: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: any[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // Header
      doc
        .fillColor('#444444')
        .fontSize(20)
        .text('NOMINI - Comprobante', 110, 57)
        .fontSize(10)
        .text('Software de Gestión de Nómina', 200, 65, { align: 'right' })
        .moveDown();

      doc.moveTo(50, 90).lineTo(550, 90).stroke('#aaaaaa');

      // Title & Date
      doc
        .fillColor('#333333')
        .fontSize(16)
        .text(data.title, 50, 110)
        .fontSize(10)
        .text(`Fecha: ${new Date().toLocaleDateString()}`, 50, 130)
        .moveDown();

      // Content
      doc.fontSize(12).text(`Detalles del Comprobante:`, 50, 160);
      
      let y = 190;
      const drawRow = (label: string, value: string) => {
        doc.fillColor('#555555').text(label, 50, y);
        doc.fillColor('#000000').text(value, 200, y);
        y += 20;
      };

      drawRow('Beneficiario:', data.employeeName);
      drawRow('Monto:', `$${data.amount}`);
      
      if (data.type === 'loan') {
        drawRow('Tipo:', 'Préstamo');
        drawRow('Plazo Total:', `${data.totalWeeks} semanas`);
        drawRow('Cuota Semanal:', `$${data.weeklyInstallment}`);
      } else {
        drawRow('Tipo:', 'Penalización');
        drawRow('Categoría:', data.category);
        drawRow('Razón:', data.reason);
        drawRow('Plazo de Pago:', `${data.totalWeeks} semanas`);
        drawRow('Descuento Semanal:', `$${data.weeklyInstallment}`);
      }

      if (data.notes) {
        y += 10;
        doc.fillColor('#555555').text('Notas:', 50, y);
        doc.fillColor('#000000').text(data.notes, 200, y, { width: 350 });
      }

      // Footer
      doc
        .fontSize(10)
        .fillColor('#aaaaaa')
        .text(
          'Este es un comprobante generado automáticamente por Nomini.',
          50,
          700,
          { align: 'center', width: 500 }
        );

      doc.end();
    });
  }
}
