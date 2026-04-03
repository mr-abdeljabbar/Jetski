import PDFDocument from 'pdfkit';
import { Booking, Activity, ActivityDuration } from '@prisma/client';
import path from 'path';

interface InvoiceData {
  booking: Booking & { 
    activity: Activity; 
    duration: ActivityDuration | null;
  };
  invoiceNumber: string;
}

export async function generateInvoicePDF(
  data: InvoiceData
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ 
      size: 'A4', 
      margin: 50,
      info: {
        Title: `Invoice ${data.invoiceNumber}`,
        Author: 'Taghazout Jet',
      }
    });

    // Register custom fonts (Standard fonts like Helvetica fail on Netlify)
    try {
      const regularPath = path.join(process.cwd(), 'api/fonts/Inter-Regular.ttf');
      const boldPath = path.join(process.cwd(), 'api/fonts/Inter-Bold.ttf');
      doc.registerFont('Inter', regularPath);
      doc.registerFont('Inter-Bold', boldPath);
    } catch (e) {
      console.warn('Custom fonts not found, falling back to standard fonts:', e);
    }
    
    const chunks: Buffer[] = [];
    doc.on('data', chunk => {
      chunks.push(chunk);
    });
    
    doc.on('end', () => {
      const result = Buffer.concat(chunks);
      if (result.length < 100) {
        reject(new Error('Generated PDF is empty or too small'));
      } else {
        resolve(result);
      }
    });

    doc.on('error', (err) => {
      console.error('PDFKit error:', err);
      reject(err);
    });

    const OCEAN = '#0B3C6D';
    const CORAL = '#FF6B35';
    const LIGHT_GRAY = '#F5F5F5';
    const TEXT_GRAY = '#666666';

    // ── Header Bar ──────────────────────────────────────────
    doc.rect(0, 0, 595, 100).fill(OCEAN);
    
    // Company name in header
    doc.fontSize(24)
       .font('Inter-Bold')
       .fillColor('white')
       .text('TAGHAZOUT JET', 50, 35);
    
    doc.fontSize(10)
       .font('Inter')
       .fillColor('rgba(255,255,255,0.7)')
       .text('Premium Water Sports & Activities', 50, 65);

    // Invoice label in header (right side)
    doc.fontSize(28)
       .font('Inter-Bold')
       .fillColor('white')
       .text('INVOICE', 400, 30, { align: 'right', width: 145 });

    doc.fontSize(10)
       .font('Inter')
       .fillColor('rgba(255,255,255,0.7)')
       .text(data.invoiceNumber, 400, 62, { align: 'right', width: 145 });

    // ── Company & Customer Info Block ────────────────────────
    doc.fillColor(OCEAN).font('Inter-Bold').fontSize(9)
       .text('FROM', 50, 125, { characterSpacing: 2 });
    
    doc.fillColor(TEXT_GRAY).font('Inter').fontSize(10)
       .text('Taghazout Jet', 50, 142)
       .text('Taghazout Beach', 50, 157)
       .text('Agadir 80022, Morocco', 50, 172)
       .text('+212 600 000 000', 50, 187)
       .text('contact@taghazoutjet.com', 50, 202);

    doc.fillColor(OCEAN).font('Inter-Bold').fontSize(9)
       .text('BILL TO', 300, 125, { characterSpacing: 2 });
    
    doc.fillColor(TEXT_GRAY).font('Inter').fontSize(10)
       .text(data.booking.fullName, 300, 142)
       .text(data.booking.phone, 300, 157);

    // ── Info Row (3 columns) ─────────────────────────────────
    doc.rect(50, 230, 495, 50).fill(LIGHT_GRAY);

    const cols = [
      { label: 'INVOICE DATE', value: new Date().toLocaleDateString('en-GB') },
      { label: 'BOOKING ID', value: data.booking.id.substring(0, 8).toUpperCase() },
      { label: 'STATUS', value: data.booking.status.toUpperCase() },
    ];

    cols.forEach((col, i) => {
      const x = 65 + i * 165;
      doc.fontSize(8).font('Inter-Bold').fillColor(CORAL)
         .text(col.label, x, 243, { characterSpacing: 1 });
      doc.fontSize(10).font('Inter').fillColor(OCEAN)
         .text(col.value, x, 257);
    });

    // ── Line Items Table ─────────────────────────────────────
    const tableTop = 310;
    
    // Table header
    doc.rect(50, tableTop, 495, 30).fill(OCEAN);
    
    const headers = ['Activity', 'Date', 'Time', 'Persons', 'Unit Price'];
    const colWidths = [195, 100, 70, 60, 70];
    let xPos = 60;
    
    headers.forEach((header, i) => {
      doc.fontSize(9).font('Inter-Bold').fillColor('white')
         .text(header, xPos, tableTop + 10);
      xPos += colWidths[i];
    });

    // Table row
    doc.rect(50, tableTop + 30, 495, 40).fill('#FAFAFA');
    
    xPos = 60;
    const rowData = [
      data.booking.activity.title,
      data.booking.startDate 
        ? new Date(data.booking.startDate).toLocaleDateString('en-GB')
        : 'N/A',
      data.booking.time || 'Flexible',
      String(data.booking.persons),
      `€${data.booking.duration?.price ?? 0}`,
    ];
    
    rowData.forEach((cell, i) => {
      doc.fontSize(10).font('Inter').fillColor(OCEAN)
         .text(cell, xPos, tableTop + 44);
      xPos += colWidths[i];
    });

    // Duration note
    if (data.booking.duration?.durationLabel) {
      doc.fontSize(9).font('Inter').fillColor(TEXT_GRAY)
         .text(
           `Duration: ${data.booking.duration.durationLabel}`, 
           60, 
           tableTop + 75
         );
    }

    // ── Totals Block ─────────────────────────────────────────
    const totalY = tableTop + 110;
    const price = data.booking.duration?.price ?? 0;
    const total = price * data.booking.persons;

    doc.rect(350, totalY, 195, 80).fill(LIGHT_GRAY);

    doc.fontSize(10).font('Inter').fillColor(TEXT_GRAY)
       .text('Subtotal:', 365, totalY + 12)
       .text(`€${price} × ${data.booking.persons}`, 480, totalY + 12, { align: 'right', width: 55 });
    
    doc.moveTo(365, totalY + 32).lineTo(535, totalY + 32)
       .strokeColor('#DDDDDD').stroke();
    
    doc.rect(350, totalY + 36, 195, 44).fill(OCEAN);
    doc.fontSize(12).font('Inter-Bold').fillColor('white')
       .text('TOTAL', 365, totalY + 50)
       .text(`€${total.toFixed(2)}`, 365, totalY + 50, { align: 'right', width: 155 });

    // ── Footer ───────────────────────────────────────────────
    doc.moveTo(50, 730).lineTo(545, 730)
       .strokeColor('#EEEEEE').lineWidth(1).stroke();
    
    doc.fontSize(9).font('Inter').fillColor(TEXT_GRAY)
       .text(
         'Thank you for booking with Taghazout Jet. We look forward to providing you with an exceptional experience.',
         50, 742, { align: 'center', width: 495 }
       );
    
    doc.fontSize(8).font('Inter').fillColor('#AAAAAA')
       .text(
         'Taghazout Beach, Agadir 80022, Morocco  •  +212 600 000 000  •  contact@taghazoutjet.com',
         50, 760, { align: 'center', width: 495 }
       );

    doc.end();
  });
}
