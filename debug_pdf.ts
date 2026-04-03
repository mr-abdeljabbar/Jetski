import PDFDocument from 'pdfkit';
import fs from 'fs';

const doc = new PDFDocument({ size: 'A4' });
const chunks: Buffer[] = [];
doc.on('data', chunk => chunks.push(chunk));
doc.on('end', () => {
  const result = Buffer.concat(chunks);
  console.log('Result size:', result.length);
  fs.writeFileSync('debug.pdf', result);
});

doc.fontSize(25).text('Some text with an embedded font!', 100, 100);
doc.rect(50, 50, 100, 100).fill('#FF0000');
doc.end();
