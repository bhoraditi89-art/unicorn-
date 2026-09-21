import { useState } from 'react';
import { useUnicornStore } from './services/store';
import { Navbar } from './components/Navbar';
import { StudentPortal } from './components/views/StudentPortal';
import { ClubCommandCenter } from './components/views/ClubCommandCenter';
import { CollegeAdminPortal } from './components/views/CollegeAdminPortal';
import { EventDetailModal } from './components/modals/EventDetailModal';
import { CertificateVerifyModal } from './components/modals/CertificateVerifyModal';
import { CreateEventModal } from './components/modals/CreateEventModal';
import type { EventItem, IssuedCertificate } from './types';

export function App() {
  const {
    institution,
    activeRole,
    setActiveRole,
    currentStudent,
    clubs,
    selectedClub,
    events,
    registrations,
    certificates,
    applicants,
    naacSummary,
    registerForEvent,
    checkInAttendee,
    createEvent,
    issueCertificatesForEvent,
    updateApplicantStatus,
    resetToFactoryDemo,
  } = useUnicornStore();

  const [activeTab, setActiveTab] = useState<string>('events');
  const [selectedEventModal, setSelectedEventModal] = useState<EventItem | null>(null);
  const [selectedCertModal, setSelectedCertModal] = useState<IssuedCertificate | null>(null);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState<boolean>(false);

  const handleRegister = (eventId: string) => {
    const res = registerForEvent(eventId);
    if (res.success) {
      // Auto open ticket view or give feedback
      alert(res.message);
      setActiveTab('tickets');
    } else {
      alert(res.message);
    }
  };

  const userEventIds = new Set(registrations.map(r => r.eventId));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Navigation */}
      <Navbar
        institution={institution}
        activeRole={activeRole}
        onRoleChange={(role) => setActiveRole(role)}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onResetDemo={resetToFactoryDemo}
        onOpenPublicEvent={() => setSelectedEventModal(events[0])}
      />

      {/* Interactive Startup Demo Guide Strip */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950 border-b border-indigo-500/20 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-indigo-200">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="font-semibold text-white">Live Prototype Demo:</span>
            <span className="text-slate-300">
              {activeRole === 'STUDENT' && 'You are viewing as Student Aditi Bhor. RSVP for AI Workshop 2026, view your QR ticket pass, or inspect your verified certificates.'}
              {activeRole === 'CLUB_ADMIN' && 'You are viewing as Club Lead Rohan Sharma. Open "Door QR Scanner" to scan Aditi’s pass, then open "Certificates Studio" to issue certificates!'}
              {activeRole === 'COLLEGE_ADMIN' && 'You are viewing as College Dean / IQAC Director. Notice the 1-Click NAAC Criterion 5.3 Exporter — the killer enterprise SaaS hook!'}
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-slate-400 text-[11px]">Switch persona anytime via top right selector.</span>
          </div>
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeRole === 'STUDENT' && (
          <StudentPortal
            activeTab={activeTab}
            student={currentStudent}
            events={events}
            registrations={registrations}
            certificates={certificates}
            onRegister={handleRegister}
            onOpenEventModal={(e) => setSelectedEventModal(e)}
            onOpenVerifyModal={(c) => setSelectedCertModal(c)}
          />
        )}

        {activeRole === 'CLUB_ADMIN' && (
          <ClubCommandCenter
            activeTab={activeTab}
            club={selectedClub}
            events={events}
            registrations={registrations}
            certificates={certificates}
            applicants={applicants}
            onCheckIn={(token) => checkInAttendee(token)}
            onIssueCertificates={(eventId) => issueCertificatesForEvent(eventId)}
            onUpdateApplicantStatus={(id, status) => updateApplicantStatus(id, status)}
            onCreateEventClick={() => setIsCreateEventOpen(true)}
            onOpenEventModal={(e) => setSelectedEventModal(e)}
          />
        )}

        {activeRole === 'COLLEGE_ADMIN' && (
          <CollegeAdminPortal
            activeTab={activeTab}
            institution={institution}
            clubs={clubs}
            events={events}
            naacSummary={naacSummary}
          />
        )}
      </main>

      {/* Modals & Overlays */}
      <EventDetailModal
        event={selectedEventModal}
        isOpen={!!selectedEventModal}
        onClose={() => setSelectedEventModal(null)}
        isRegistered={selectedEventModal ? userEventIds.has(selectedEventModal.id) : false}
        onRegister={(eventId) => handleRegister(eventId)}
      />

      <CertificateVerifyModal
        cert={selectedCertModal}
        isOpen={!!selectedCertModal}
        onClose={() => setSelectedCertModal(null)}
      />

      <CreateEventModal
        club={selectedClub}
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onCreateEvent={(data) => {
          const newEv = createEvent(data);
          alert(`Event "${newEv.title}" successfully published!`);
          setActiveTab('club-overview');
        }}
      />

      {/* Modern Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center space-x-2 font-bold text-slate-400">
            <span>🦄 UNICORN OS</span>
            <span>•</span>
            <span>The Operating System for Campus Life & Student Extracurricular Identity</span>
          </div>
          <p>
            Designed for University Clubs, Student Extracurricular Portfolios, and NAAC/NIRF Institutional Accreditation.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
