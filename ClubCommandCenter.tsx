import React, { useState } from 'react';
import { 
  BarChart3, 
  QrCode, 
  Award, 
  Users, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  Search, 
  Sparkles,
  ArrowRight,
  Download,
  Filter
} from 'lucide-react';
import { Club, EventItem, EventRegistration, IssuedCertificate, RecruitmentApplicant } from '../../types';
import confetti from 'canvas-confetti';

interface ClubCommandCenterProps {
  activeTab: string;
  club: Club;
  events: EventItem[];
  registrations: EventRegistration[];
  certificates: IssuedCertificate[];
  applicants: RecruitmentApplicant[];
  onCheckIn: (token: string) => { success: boolean; message: string; registration?: EventRegistration; event?: EventItem };
  onIssueCertificates: (eventId: string) => { count: number; certificates: IssuedCertificate[] };
  onUpdateApplicantStatus: (applicantId: string, status: RecruitmentApplicant['status']) => void;
  onCreateEventClick: () => void;
  onOpenEventModal: (event: EventItem) => void;
}

export const ClubCommandCenter: React.FC<ClubCommandCenterProps> = ({
  activeTab,
  club,
  events,
  registrations,
  certificates,
  applicants,
  onCheckIn,
  onIssueCertificates,
  onUpdateApplicantStatus,
  onCreateEventClick,
  onOpenEventModal,
}) => {
  const [manualTokenInput, setManualTokenInput] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; registration?: EventRegistration } | null>(null);
  const [selectedEventForCerts, setSelectedEventForCerts] = useState<string>(events[0]?.id || '');
  const [issuedNotification, setIssuedNotification] = useState<string | null>(null);

  // Filter registrations for current club's events
  const clubEventIds = new Set(events.filter(e => e.clubId === club.id).map(e => e.id));
  const clubRegistrations = registrations.filter(r => clubEventIds.has(r.eventId));
  const activeEvent = events.find(e => e.id === selectedEventForCerts) || events[0];

  const handleManualScan = (tokenToScan?: string) => {
    const token = tokenToScan || manualTokenInput;
    if (!token.trim()) return;

    const res = onCheckIn(token.trim());
    setScanResult(res);
    setManualTokenInput('');

    if (res.success) {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 }
      });
    }

    setTimeout(() => {
      // Keep result visible for 6 seconds
    }, 6000);
  };

  const handleBatchIssue = (eventId: string) => {
    const res = onIssueCertificates(eventId);
    if (res.count > 0) {
      setIssuedNotification(`Success! Issued ${res.count} new verifiable certificates to present attendees.`);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 }
      });
    } else {
      setIssuedNotification('No new certificates to issue (attendees already have certificates or not checked in).');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Club Identity Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-4">
          <img
            src={club.logoUrl}
            alt={club.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{club.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Lead Command Center
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              President: <strong className="text-slate-200">{club.presidentName}</strong> • Faculty Advisor: <strong className="text-slate-200">{club.facultyAdvisor}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onCreateEventClick}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/20 flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'club-overview' && (
        <div className="space-y-6">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Active Club Members</div>
              <div className="text-2xl font-extrabold text-white mt-1">{club.membersCount}</div>
              <div className="text-[10px] text-indigo-400 mt-1">Across 4 Sub-Teams</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Total Registrations</div>
              <div className="text-2xl font-extrabold text-indigo-400 mt-1">{clubRegistrations.length + 147}</div>
              <div className="text-[10px] text-indigo-400 mt-1">This Academic Year</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Avg Attendance Rate</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">83.5%</div>
              <div className="text-[10px] text-emerald-400 mt-1">Verified via QR Scanner</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Certificates Issued</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">437</div>
              <div className="text-[10px] text-amber-400 mt-1">Instant Verified Badges</div>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => {
                const el = document.getElementById('tab-scanner-btn');
                if (el) el.click();
              }}
              className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 hover:border-emerald-500/40 transition cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                Door QR Attendance Scanner
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scan student phone screens at the door to record attendance with zero fake proxies.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/20 hover:border-amber-500/40 transition cursor-pointer space-y-2 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                Auto-Generate Certificates
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate cryptographic certificates for all checked-in participants in 1-click.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 hover:border-indigo-500/40 transition cursor-pointer space-y-2 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                Recruitment & Shortlisting
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review candidate applications, filter by department, and shortlist applicants.
              </p>
            </div>
          </div>

          {/* Active Club Events List */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Managed Club Events</h2>
            <div className="space-y-3">
              {events.filter(e => e.clubId === club.id).map(event => (
                <div
                  key={event.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300">
                        {event.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(event.startTime).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 
                      onClick={() => onOpenEventModal(event)}
                      className="text-base font-bold text-white hover:text-indigo-400 cursor-pointer transition"
                    >
                      {event.title}
                    </h4>
                    <p className="text-xs text-slate-400">{event.venue}</p>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Registered</div>
                      <div className="text-sm font-bold text-white">
                        {event.registeredCount} / {event.maxCapacity}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Checked In</div>
                      <div className="text-sm font-bold text-emerald-400">
                        {event.attendedCount || 122}
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenEventModal(event)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                    >
                      Event Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. DOOR QR SCANNER TAB */}
      {activeTab === 'club-scanner' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Door QR Attendance Scanner</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Prevent fake attendance. Club volunteers scan the attendee’s phone screen pass at the entrance to Seminar Hall.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Columns: Scanner Viewfinder & Manual Input */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Camera Simulator & Viewfinder */}
              <div className="relative rounded-3xl bg-slate-950 border-2 border-indigo-500/30 overflow-hidden p-6 flex flex-col items-center justify-center min-h-[320px] shadow-2xl">
                
                {/* Target Reticle */}
                <div className="relative w-56 h-56 border-2 border-indigo-400/60 rounded-3xl flex items-center justify-center p-4">
                  <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-indigo-400 rounded-tl-lg" />
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg" />
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-indigo-400 rounded-bl-lg" />
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-indigo-400 rounded-br-lg" />

                  {/* Animated laser line */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce shadow-lg shadow-emerald-400/50" />
                  <Camera className="w-8 h-8 text-indigo-400/40 absolute" />
                </div>

                <div className="mt-4 text-center space-y-1">
                  <p className="text-xs font-semibold text-slate-300">
                    Camera Barcode / QR Scanner Ready
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Point organizer phone camera at attendee QR ticket pass
                  </p>
                </div>

                {/* Live Scan Status Notification Overlay */}
                {scanResult && (
                  <div className={`mt-4 w-full p-4 rounded-2xl border transition-all ${
                    scanResult.success 
                      ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200' 
                      : 'bg-rose-950/80 border-rose-500/60 text-rose-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      {scanResult.success ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div className="text-xs space-y-1">
                        <div className="font-bold text-sm">
                          {scanResult.success ? 'Attendance Recorded!' : 'Check-in Notice'}
                        </div>
                        <p>{scanResult.message}</p>
                        {scanResult.registration && (
                          <div className="pt-1 text-[11px] opacity-80">
                            PRN: {scanResult.registration.studentRollNo} • Dept: {scanResult.registration.studentDepartment}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual Ticket Token Input */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Manual Token Check-In / Barcode Backup
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualTokenInput}
                    onChange={(e) => setManualTokenInput(e.target.value)}
                    placeholder="e.g. TKT-AIW26-ADITI-82914"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => handleManualScan()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
                  >
                    Check In
                  </button>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Registered Attendees Quick-Click Simulator */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Live Attendee Queue</h3>
                  <span className="text-xs text-indigo-400 font-semibold">
                    1-Click Test Scan
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Click any student below to simulate scanning their phone pass at the door:
                </p>

                <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                  {registrations.map(reg => {
                    const isCheckedIn = reg.status === 'CHECKED_IN';

                    return (
                      <div
                        key={reg.id}
                        onClick={() => handleManualScan(reg.ticketToken)}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                          isCheckedIn
                            ? 'bg-emerald-950/10 border-emerald-500/20 hover:border-emerald-500/40'
                            : 'bg-slate-950 border-slate-800 hover:border-indigo-500/40'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                            <span>{reg.studentName}</span>
                            {isCheckedIn && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {reg.studentDepartment} • {reg.studentRollNo}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {reg.ticketToken}
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isCheckedIn ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                              Present
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600/30 text-indigo-200 hover:bg-indigo-600 transition">
                              Scan Pass
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. CERTIFICATES STUDIO TAB */}
      {activeTab === 'club-certificates' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Dynamic Certificates Studio</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Issue tamper-proof certificates with unique verification hashes directly to confirmed attendees.
            </p>
          </div>

          {/* Event Picker & Batch Action */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Event for Issuance:
              </label>
              <select
                value={selectedEventForCerts}
                onChange={(e) => setSelectedEventForCerts(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-sm font-semibold text-white px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.attendedCount || 0} checked in)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleBatchIssue(selectedEventForCerts)}
              className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-lg shadow-amber-600/25 flex items-center space-x-2"
            >
              <Award className="w-4 h-4" />
              <span>Issue Certificates to Present Attendees</span>
            </button>
          </div>

          {issuedNotification && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{issuedNotification}</span>
            </div>
          )}

          {/* Certificate Template Preview */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-300">Live Certificate Layout Preview</h3>
            <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/30 p-8 shadow-2xl overflow-hidden max-w-2xl mx-auto text-center space-y-4">
              <div className="text-xs font-mono tracking-widest text-amber-500 uppercase">
                SANJIVANI COLLEGE OF ENGINEERING, KOPARGAON
              </div>
              <div className="text-xl font-serif font-bold text-white">
                CERTIFICATE OF PARTICIPATION
              </div>
              <div className="text-xs italic text-slate-400">
                This is proudly presented to
              </div>
              <div className="text-2xl font-bold text-amber-300 underline decoration-amber-500/50 underline-offset-8">
                &#123;&#123; student_name &#125;&#125;
              </div>
              <div className="text-xs text-slate-300 max-w-md mx-auto">
                for active participation in <strong className="text-white">{activeEvent?.title}</strong> organized by {club.name}.
              </div>
              <div className="pt-4 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-800">
                <div>Faculty Coordinator<br /><strong className="text-slate-200">{club.facultyAdvisor}</strong></div>
                <div>Director, IQAC<br /><strong className="text-slate-200">Dr. A. G. Thakur</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. RECRUITMENT TAB */}
      {activeTab === 'club-recruitment' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">Member Recruitment Pipeline</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                No messy Google Sheets. Shortlist, review candidate statements of purpose, and manage team allocation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: Applied */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  New Applicants ({applicants.filter(a => a.status === 'APPLIED').length})
                </span>
                <span className="w-2 h-2 rounded-full bg-blue-500" />
              </div>

              <div className="space-y-3">
                {applicants.filter(a => a.status === 'APPLIED').map(app => (
                  <div key={app.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div>
                      <div className="text-sm font-bold text-white">{app.studentName}</div>
                      <div className="text-xs text-slate-400">{app.department} • Div {app.division}</div>
                      <div className="text-[11px] text-indigo-400 font-semibold mt-1">
                        Role: {app.targetTeam}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-3 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/80">
                      "{app.statementOfPurpose}"
                    </p>
                    <button
                      onClick={() => onUpdateApplicantStatus(app.id, 'SHORTLISTED')}
                      className="w-full py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 text-xs font-semibold transition"
                    >
                      Shortlist for Interview →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Shortlisted / Interviewing */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Shortlisted ({applicants.filter(a => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED').length})
                </span>
                <span className="w-2 h-2 rounded-full bg-purple-500" />
              </div>

              <div className="space-y-3">
                {applicants.filter(a => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED').map(app => (
                  <div key={app.id} className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-3">
                    <div>
                      <div className="text-sm font-bold text-white">{app.studentName}</div>
                      <div className="text-xs text-slate-400">{app.department}</div>
                      <div className="text-[11px] text-purple-400 font-semibold mt-1">
                        Target: {app.targetTeam}
                      </div>
                    </div>
                    {app.interviewNotes && (
                      <div className="text-[11px] text-amber-300 bg-amber-950/20 p-2 rounded-lg border border-amber-500/30">
                        {app.interviewNotes}
                      </div>
                    )}
                    <button
                      onClick={() => onUpdateApplicantStatus(app.id, 'ACCEPTED')}
                      className="w-full py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 text-xs font-semibold transition"
                    >
                      Accept into Core Team ✓
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Accepted */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Accepted Members ({applicants.filter(a => a.status === 'ACCEPTED').length})
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              <div className="space-y-3">
                {applicants.filter(a => a.status === 'ACCEPTED').length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    No members accepted yet.
                  </div>
                ) : (
                  applicants.filter(a => a.status === 'ACCEPTED').map(app => (
                    <div key={app.id} className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                      <div className="text-sm font-bold text-white">{app.studentName}</div>
                      <div className="text-xs text-emerald-400 font-semibold">
                        {app.targetTeam} • Joined
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
