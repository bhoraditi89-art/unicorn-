import React from 'react';
import { X, ShieldCheck, Award, Building2, CheckCircle2, Download, Share2, Calendar, User } from 'lucide-react';
import { IssuedCertificate } from '../../types';
import { downloadCertificatePdf } from '../../utils/pdfCert';

interface CertificateVerifyModalProps {
  cert: IssuedCertificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateVerifyModal: React.FC<CertificateVerifyModalProps> = ({
  cert,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !cert) return null;

  const handleDownload = async () => {
    await downloadCertificatePdf(cert);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Verification Status Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="flex items-center justify-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Officially Verified Credential</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Unicorn Public Verification Portal
          </h2>
          <p className="text-xs text-slate-400">
            Issued by Sanjivani College of Engineering, Kopargaon (Autonomous)
          </p>
        </div>

        {/* Certificate Credential Card */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4 text-xs">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-slate-400">Certificate ID:</span>
            <span className="font-mono font-bold text-amber-400">{cert.certificateNumber}</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-slate-400 text-[11px]">Recipient</div>
              <div className="text-sm font-bold text-white mt-0.5">{cert.studentName}</div>
              <div className="text-slate-400 text-[11px]">{cert.studentDepartment}</div>
            </div>

            <div>
              <div className="text-slate-400 text-[11px]">Event / Workshop</div>
              <div className="text-sm font-bold text-indigo-300 mt-0.5">{cert.eventTitle}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <div className="text-slate-400 text-[11px]">Organizing Body</div>
                <div className="font-semibold text-slate-200 mt-0.5">{cert.clubName}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[11px]">Date Issued</div>
                <div className="font-semibold text-slate-200 mt-0.5">{cert.issueDate}</div>
              </div>
            </div>

            <div>
              <div className="text-slate-400 text-[11px]">Signatories</div>
              <div className="font-semibold text-slate-300 mt-0.5">{cert.signerName}</div>
              <div className="text-[10px] text-slate-500">{cert.signerTitle}</div>
            </div>

            <div>
              <div className="text-slate-400 text-[11px]">SHA-256 Cryptographic Checksum</div>
              <div className="font-mono text-[10px] text-slate-500 break-all mt-0.5 bg-slate-900 p-2 rounded-lg">
                {cert.verificationHash}
              </div>
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownload}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-amber-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF</span>
          </button>

          <a
            href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.eventTitle)}&organizationName=${encodeURIComponent('Unicorn OS - Sanjivani COE')}&issueDate=${cert.issueDate}`}
            target="_blank"
            rel="noreferrer"
            className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Add to LinkedIn</span>
          </a>
        </div>

      </div>
    </div>
  );
};
