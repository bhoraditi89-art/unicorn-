import { jsPDF } from 'jspdf';
import type { IssuedCertificate } from '../types';
import { generateQrDataUrl } from './qr';

export async function downloadCertificatePdf(cert: IssuedCertificate, collegeName: string = 'Sanjivani College of Engineering, Kopargaon') {
  // A4 Landscape: 297mm x 210mm
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const width = 297;
  const height = 210;

  // Background tint
  doc.setFillColor(252, 252, 254);
  doc.rect(0, 0, width, height, 'F');

  // Outer decorative border
  doc.setDrawColor(30, 41, 59); // Slate 800
  doc.setLineWidth(1.5);
  doc.rect(10, 10, width - 20, height - 20);

  // Inner gold border
  doc.setDrawColor(217, 119, 6); // Amber 600
  doc.setLineWidth(0.8);
  doc.rect(13, 13, width - 26, height - 26);

  // Corner accents
  doc.setFillColor(217, 119, 6);
  const cornerSize = 4;
  doc.rect(12, 12, cornerSize, cornerSize, 'F');
  doc.rect(width - 12 - cornerSize, 12, cornerSize, cornerSize, 'F');
  doc.rect(12, height - 12 - cornerSize, cornerSize, cornerSize, 'F');
  doc.rect(width - 12 - cornerSize, height - 12 - cornerSize, cornerSize, cornerSize, 'F');

  // College Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(collegeName.toUpperCase(), width / 2, 32, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Official Extracurricular Credential  •  ${cert.clubName}`, width / 2, 40, { align: 'center' });

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(width / 2 - 60, 45, width / 2 + 60, 45);

  // Title: Certificate of Completion
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(30, 58, 138); // Blue 900
  doc.text('CERTIFICATE OF PARTICIPATION', width / 2, 58, { align: 'center' });

  // Subtitle text
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.text('This is to certify that', width / 2, 72, { align: 'center' });

  // Recipient Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(15, 23, 42);
  doc.text(cert.studentName, width / 2, 88, { align: 'center' });

  // Underline for name
  const nameWidth = doc.getTextWidth(cert.studentName);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.8);
  doc.line((width - nameWidth) / 2 - 10, 92, (width + nameWidth) / 2 + 10, 92);

  // Department & Context
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(51, 65, 85);
  doc.text(
    `from the Department of ${cert.studentDepartment} has successfully participated in`,
    width / 2,
    103,
    { align: 'center' }
  );

  // Event Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(2, 132, 199); // Sky 600
  doc.text(`"${cert.eventTitle}"`, width / 2, 115, { align: 'center' });

  // Scope / Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Organized by ${cert.clubName}  •  Category: ${cert.naacCategory}`,
    width / 2,
    124,
    { align: 'center' }
  );

  // Signatures
  const leftSigX = 65;
  const rightSigX = width - 65;
  const sigY = 162;

  // Left Signer
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(leftSigX - 35, sigY, leftSigX + 35, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(cert.signerName.split('&')[0]?.trim() || 'Faculty Advisor', leftSigX, sigY + 6, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Faculty Coordinator / Advisor', leftSigX, sigY + 11, { align: 'center' });

  // Right Signer
  doc.line(rightSigX - 35, sigY, rightSigX + 35, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(cert.signerName.split('&')[1]?.trim() || 'Principal / IQAC Director', rightSigX, sigY + 6, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Director, Sanjivani COE & IQAC', rightSigX, sigY + 11, { align: 'center' });

  // Center Seal & QR code
  const verificationUrl = `https://unicorn.ac/verify/${cert.verificationHash.substring(0, 16)}`;
  try {
    const qrDataUrl = await generateQrDataUrl(verificationUrl);
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', width / 2 - 13, 142, 26, 26);
    }
  } catch (e) {
    console.error('Could not embed QR code in PDF:', e);
  }

  // Footer Metadata
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Certificate No: ${cert.certificateNumber}  •  Issue Date: ${cert.issueDate}`, width / 2, 175, { align: 'center' });
  doc.text(`Verify Authenticity at unicorn.ac/verify/${cert.verificationHash.substring(0, 12)}...`, width / 2, 180, { align: 'center' });

  // Save the PDF
  doc.save(`${cert.certificateNumber}-${cert.studentName.replace(/\s+/g, '_')}.pdf`);
}
