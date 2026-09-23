import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ArrowUpRight, 
  Download, 
  QrCode, 
  Share2, 
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Filter
} from 'lucide-react';
import { EventItem, EventRegistration, IssuedCertificate, UserProfile } from '../../types';
import { generateQrDataUrl } from '../../utils/qr';
import { downloadCertificatePdf } from '../../utils/pdfCert';
import confetti from 'canvas-confetti';

interface StudentPortalProps {
  activeTab: string;
  student: UserProfile;
  events: EventItem[];
  registrations: EventRegistration[];
  certificates: IssuedCertificate[];
  onRegister: (eventId: string) => void;
  onOpenEventModal: (event: EventItem) => void;
  onOpenVerifyModal: (cert: IssuedCertificate) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  activeTab,
  student,
  events,
  registrations,
  certificates,
  onRegister,
  onOpenEventModal,
  onOpenVerifyModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null);

  // Generate QR code data URLs for user's tickets
  useEffect(() => {
    async function loadQRs() {
      const qrs: Record<string, string> = {};
      for (const reg of registrations) {
        if (!qrImages[reg.ticketToken]) {
          const url = await generateQrDataUrl(reg.ticketToken);
          qrs[reg.ticketToken] = url;
        }
      }
      setQrImages(prev => ({ ...prev, ...qrs }));
    }
    loadQRs();
  }, [registrations]);

  const userEventIds = new Set(registrations.map(r => r.eventId));

  const filteredEvents = events.filter(e => {
    if (selectedCategory === 'All') return true;
    return e.category === selectedCategory;
  });

  const handleDownloadPdf = async (cert: IssuedCertificate) => {
    setDownloadingCertId(cert.id);
    try {
      await downloadCertificatePdf(cert);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingCertId(null);
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. CAMPUS EVENTS TAB */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-slate-900 border border-indigo-500/20 p-6 sm:p-10 shadow-2xl">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-2xl space-y-3 relative z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Operating System for Campus Life</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Discover, RSVP, & Own Your Extracurricular Story.
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                No more WhatsApp group chaos or Google Form hunting. Explore official student club workshops, national hackathons, and symposiums with instant QR passes.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {['All', 'Workshop', 'Hackathon', 'Webinar'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat === 'All' ? 'All Activities' : `${cat}s`}
                </button>
              ))}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Showing <span className="text-white font-semibold">{filteredEvents.length}</span> verified events
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => {
              const isRegistered = userEventIds.has(event.id);
              const capacityPercent = Math.min(100, Math.round((event.registeredCount / event.maxCapacity) * 100));

              return (
                <div
                  key={event.id}
                  className="group relative flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  {/* Banner Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    {/* Category & Status Badge */}
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase bg-slate-950/80 backdrop-blur-md text-indigo-300 border border-indigo-500/30">
                        {event.category}
                      </span>
                      {event.entryFee === 0 ? (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Free
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          ₹{event.entryFee}
                        </span>
                      )}
                    </div>

                    {/* Club Tag */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center space-x-2">
                      <img
                        src={event.clubLogo}
                        alt={event.clubName}
                        className="w-5 h-5 rounded-md object-cover border border-white/20"
                      />
                      <span className="text-xs font-semibold text-slate-200 truncate">{event.clubName}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 
                        onClick={() => onOpenEventModal(event)}
                        className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors cursor-pointer line-clamp-1"
                      >
                        {event.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {event.tagline}
                      </p>
                    </div>

                    {/* Venue & Date Meta */}
                    <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">
                          {new Date(event.startTime).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            weekday: 'short',
                          })} • {new Date(event.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>

                    {/* Capacity Indicator */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Registered</span>
                        <span className="font-semibold text-slate-200">
                          {event.registeredCount} / {event.maxCapacity} ({capacityPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            capacityPercent > 90 ? 'bg-amber-500' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${capacityPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* CTA Actions */}
                    <div className="pt-2 flex items-center space-x-2">
                      {isRegistered ? (
                        <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Registered (Pass Active)</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            onRegister(event.id);
                            triggerCelebration();
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>RSVP & Get QR Ticket</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => onOpenEventModal(event)}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="View Full Details"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. MY QR TICKETS TAB */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">My Active Event Passes</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Present your unique entry QR at the venue door. Club volunteers will scan this code to grant instant entry.
            </p>
          </div>

          {registrations.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
              <QrCode className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">You have no active event registrations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {registrations.map(reg => {
                const event = events.find(e => e.id === reg.eventId);
                const qrUrl = qrImages[reg.ticketToken];

                return (
                  <div
                    key={reg.id}
                    className="relative rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col sm:flex-row"
                  >
                    {/* Left: Event Details */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                            reg.status === 'CHECKED_IN'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}>
                            {reg.status === 'CHECKED_IN' ? '✓ Checked In (Present)' : '● Valid Entry Pass'}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2">
                          {event?.title || 'Campus Event'}
                        </h3>
                        <p className="text-xs text-indigo-400 font-medium">
                          {event?.clubName}
                        </p>
                      </div>

                      <div className="space-y-2 text-xs text-slate-300 py-3 border-y border-slate-800">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {event?.startTime ? new Date(event.startTime).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'Date TBA'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{event?.venue}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 space-y-0.5">
                        <div>Attendee: <strong className="text-white">{reg.studentName}</strong></div>
                        <div>PRN: <strong className="text-slate-300">{reg.studentRollNo}</strong></div>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">
                          Token: {reg.ticketToken}
                        </div>
                      </div>
                    </div>

                    {/* Right: Scannable Ticket QR Pass */}
                    <div className="sm:w-52 bg-slate-900/60 p-6 flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-slate-800 text-center">
                      <div className="p-2.5 bg-white rounded-2xl shadow-xl">
                        {qrUrl ? (
                          <img
                            src={qrUrl}
                            alt="Ticket QR"
                            className="w-32 h-32 object-contain"
                          />
                        ) : (
                          <div className="w-32 h-32 flex items-center justify-center text-slate-900">
                            <QrCode className="w-10 h-10 animate-spin" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mt-3">
                        Scan at door for entry
                      </p>
                      {reg.status === 'CHECKED_IN' && (
                        <p className="text-[10px] text-emerald-400 font-semibold mt-1">
                          Scanned at {new Date(reg.checkedInAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. ACHIEVEMENT WALLET TAB */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          
          {/* Wallet Header & Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Events Attended</div>
              <div className="text-2xl font-extrabold text-white mt-1">14</div>
              <div className="text-[10px] text-indigo-400 mt-1">Verified on-chain/DB</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Events Organized</div>
              <div className="text-2xl font-extrabold text-purple-400 mt-1">3</div>
              <div className="text-[10px] text-purple-400 mt-1">Network Team @ SARC</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Certificates Earned</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">{certificates.length}</div>
              <div className="text-[10px] text-amber-400 mt-1">Cryptographically Signed</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Volunteer Hours</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{student.volunteerHours} hrs</div>
              <div className="text-[10px] text-emerald-400 mt-1">Verified by Faculty</div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-white">Verified Digital Credentials</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Official certificates issued directly by college clubs and IQAC director upon confirmed event attendance.
            </p>
          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map(cert => (
              <div
                key={cert.id}
                className="relative rounded-3xl bg-slate-900 border border-amber-500/20 p-6 flex flex-col justify-between space-y-5 overflow-hidden shadow-xl"
              >
                {/* Decorative golden ribbon glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={cert.clubLogo}
                        alt={cert.clubName}
                        className="w-7 h-7 rounded-lg object-cover border border-amber-500/30"
                      />
                      <span className="text-xs font-bold text-slate-300">{cert.clubName}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {cert.certificateNumber}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white leading-snug">
                      {cert.eventTitle}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Awarded to <strong className="text-slate-200">{cert.studentName}</strong> • {cert.studentDepartment}
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <div>Issued Date: <strong className="text-slate-300">{cert.issueDate}</strong></div>
                    <div>Signatures: <strong className="text-slate-300">{cert.signerName}</strong></div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      SHA256: {cert.verificationHash}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={() => handleDownloadPdf(cert)}
                    disabled={downloadingCertId === cert.id}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-lg shadow-amber-600/20 flex items-center justify-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadingCertId === cert.id ? 'Generating PDF...' : 'Download Official PDF'}</span>
                  </button>

                  <button
                    onClick={() => onOpenVerifyModal(cert)}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center space-x-1.5"
                    title="Public Verification Portal"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verify</span>
                  </button>

                  <a
                    href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.eventTitle)}&organizationName=${encodeURIComponent('Unicorn OS - Sanjivani COE')}&issueDate=${cert.issueDate}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Add to LinkedIn Profile"
                  >
                    <Share2 className="w-4 h-4 text-blue-400" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PUBLIC PASSPORT TAB */}
      {activeTab === 'passport' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-300">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Public Vanity Link: <strong>unicorn.ac/@{student.username}</strong></span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400">● Live & Shareable</span>
          </div>

          {/* Passport Card */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl space-y-8">
            
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <img
                src={student.avatarUrl}
                alt={student.fullName}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-xl"
              />
              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <h2 className="text-2xl font-extrabold text-white">{student.fullName}</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Verified Student
                  </span>
                </div>
                <p className="text-sm text-slate-300">
                  {student.department} • Class of {student.graduationYear} (Div {student.division})
                </p>
                <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
                  {student.bio}
                </p>
              </div>
            </div>

            {/* Extracurricular Highlights Stats */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <div>
                <div className="text-xs text-slate-400">Events Attended</div>
                <div className="text-xl font-bold text-white mt-0.5">14</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Leadership Roles</div>
                <div className="text-xl font-bold text-indigo-400 mt-0.5">2</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Verified Certs</div>
                <div className="text-xl font-bold text-amber-400 mt-0.5">{certificates.length}</div>
              </div>
            </div>

            {/* Timeline of Extracurricular Activities */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Extracurricular Activity Timeline
              </h4>

              <div className="space-y-4 border-l-2 border-slate-800 pl-4 ml-2">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-slate-900" />
                  <div className="text-xs text-indigo-400 font-semibold">Sept 2026 • AI Workshop 2026</div>
                  <div className="text-sm font-bold text-white mt-0.5">Attendee — Generative Agents & LLMs</div>
                  <div className="text-xs text-slate-400">Organized by CSI & Coding Club Sanjivani</div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-slate-900" />
                  <div className="text-xs text-purple-400 font-semibold">Aug 2026 • SARC Core Team</div>
                  <div className="text-sm font-bold text-white mt-0.5">Appointed Network Coordinator (2026-27)</div>
                  <div className="text-xs text-slate-400">Student Alumni Relations Cell Sanjivani</div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-slate-900" />
                  <div className="text-xs text-amber-400 font-semibold">March 2026 • Technovation State Level Hackathon</div>
                  <div className="text-sm font-bold text-white mt-0.5">Innovation Award Winner & Finalist</div>
                  <div className="text-xs text-slate-400">Built rural smart agriculture monitoring system on IoT</div>
                </div>
              </div>
            </div>

            {/* Export Transcript Button */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  alert('Extracurricular Activity Transcript PDF generation ready. Attach this verified report to placement and MS applications.');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center space-x-2"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                <span>Export 1-Page Verified Extracurricular Transcript (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
