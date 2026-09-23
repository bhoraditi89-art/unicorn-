import { useState, useEffect } from 'react';
import { 
  UserRole, 
  UserProfile, 
  Club, 
  EventItem, 
  EventRegistration, 
  IssuedCertificate, 
  RecruitmentApplicant,
  NAACReportSummary
} from '../types';
import { 
  mockInstitution, 
  mockStudents, 
  mockClubs, 
  mockEvents, 
  mockRegistrations, 
  mockIssuedCertificates, 
  mockRecruitmentApplicants 
} from '../data/mockData';

const STORAGE_KEYS = {
  ROLE: 'unicorn_active_role',
  EVENTS: 'unicorn_events',
  REGISTRATIONS: 'unicorn_registrations',
  CERTIFICATES: 'unicorn_certificates',
  APPLICANTS: 'unicorn_applicants',
  CURRENT_USER_ID: 'unicorn_current_user_id',
  SELECTED_CLUB_ID: 'unicorn_selected_club_id',
};

// Safe LocalStorage helpers
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to persist ${key}:`, err);
  }
}

export function useUnicornStore() {
  const [activeRole, setActiveRoleState] = useState<UserRole>(() => 
    loadFromStorage<UserRole>(STORAGE_KEYS.ROLE, 'STUDENT')
  );
  
  const [currentStudent, setCurrentStudent] = useState<UserProfile>(mockStudents[0]); // Aditi Bhor
  const [selectedClubId, setSelectedClubIdState] = useState<string>(() => 
    loadFromStorage<string>(STORAGE_KEYS.SELECTED_CLUB_ID, mockClubs[0].id)
  );

  const [events, setEvents] = useState<EventItem[]>(() => 
    loadFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, mockEvents)
  );

  const [registrations, setRegistrations] = useState<EventRegistration[]>(() => 
    loadFromStorage<EventRegistration[]>(STORAGE_KEYS.REGISTRATIONS, mockRegistrations)
  );

  const [certificates, setCertificates] = useState<IssuedCertificate[]>(() => 
    loadFromStorage<IssuedCertificate[]>(STORAGE_KEYS.CERTIFICATES, mockIssuedCertificates)
  );

  const [applicants, setApplicants] = useState<RecruitmentApplicant[]>(() => 
    loadFromStorage<RecruitmentApplicant[]>(STORAGE_KEYS.APPLICANTS, mockRecruitmentApplicants)
  );

  // Sync to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ROLE, activeRole);
  }, [activeRole]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SELECTED_CLUB_ID, selectedClubId);
  }, [selectedClubId]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EVENTS, events);
  }, [events]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.REGISTRATIONS, registrations);
  }, [registrations]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CERTIFICATES, certificates);
  }, [certificates]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.APPLICANTS, applicants);
  }, [applicants]);

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
  };

  const setSelectedClubId = (clubId: string) => {
    setSelectedClubIdState(clubId);
  };

  const selectedClub = mockClubs.find(c => c.id === selectedClubId) || mockClubs[0];

  // Actions
  const registerForEvent = (eventId: string, user: UserProfile = currentStudent): { success: boolean; message: string; ticketToken?: string } => {
    const existing = registrations.find(r => r.eventId === eventId && r.userId === user.id);
    if (existing) {
      return { success: false, message: 'You are already registered for this event!' };
    }

    const event = events.find(e => e.id === eventId);
    if (!event) {
      return { success: false, message: 'Event not found.' };
    }

    if (event.registeredCount >= event.maxCapacity) {
      return { success: false, message: 'Event is already at full capacity!' };
    }

    const tokenNonce = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newTicketToken = `TKT-${event.slug.substring(0, 4).toUpperCase()}-${user.username.replace('.', '').toUpperCase()}-${tokenNonce}`;

    const newRegistration: EventRegistration = {
      id: `reg-${Date.now()}`,
      eventId,
      userId: user.id,
      studentName: user.fullName,
      studentEmail: user.email,
      studentRollNo: user.prnRollNo,
      studentDepartment: user.department,
      ticketToken: newTicketToken,
      registeredAt: new Date().toISOString(),
      status: 'REGISTERED',
    };

    setRegistrations(prev => [newRegistration, ...prev]);
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e));

    return { 
      success: true, 
      message: `Registration confirmed! Your QR ticket is ready.`,
      ticketToken: newTicketToken
    };
  };

  const checkInAttendee = (ticketToken: string, scannedByUserId: string = 'usr-rohan-2'): { 
    success: boolean; 
    message: string; 
    registration?: EventRegistration;
    event?: EventItem;
  } => {
    const reg = registrations.find(r => r.ticketToken.trim().toUpperCase() === ticketToken.trim().toUpperCase());
    if (!reg) {
      return { success: false, message: 'Invalid ticket token. No registration record found.' };
    }

    if (reg.status === 'CHECKED_IN') {
      return { 
        success: false, 
        message: `Already checked in at ${new Date(reg.checkedInAt || '').toLocaleTimeString()} by ${reg.checkedInBy || 'Organizer'}.`,
        registration: reg 
      };
    }

    const updatedReg: EventRegistration = {
      ...reg,
      status: 'CHECKED_IN',
      checkedInAt: new Date().toISOString(),
      checkedInBy: scannedByUserId,
    };

    setRegistrations(prev => prev.map(r => r.id === reg.id ? updatedReg : r));
    setEvents(prev => prev.map(e => e.id === reg.eventId ? { ...e, attendedCount: (e.attendedCount || 0) + 1 } : e));

    const event = events.find(e => e.id === reg.eventId);

    return { 
      success: true, 
      message: `Check-in successful! Welcome, ${reg.studentName}.`,
      registration: updatedReg,
      event
    };
  };

  const createEvent = (newEventData: Omit<EventItem, 'id' | 'registeredCount' | 'attendedCount' | 'clubLogo' | 'clubName'>) => {
    const club = mockClubs.find(c => c.id === newEventData.clubId) || selectedClub;
    const newEvent: EventItem = {
      ...newEventData,
      id: `evt-${Date.now()}`,
      clubName: club.name,
      clubLogo: club.logoUrl,
      registeredCount: 0,
      attendedCount: 0,
    };
    setEvents(prev => [newEvent, ...prev]);
    return newEvent;
  };

  const issueCertificatesForEvent = (eventId: string): { count: number; certificates: IssuedCertificate[] } => {
    const event = events.find(e => e.id === eventId);
    if (!event) return { count: 0, certificates: [] };

    // Find all checked-in attendees
    const attendees = registrations.filter(r => r.eventId === eventId && r.status === 'CHECKED_IN');
    const existingUserIds = new Set(certificates.filter(c => c.eventId === eventId).map(c => c.userId));

    const newlyIssued: IssuedCertificate[] = [];

    attendees.forEach((att, idx) => {
      if (!existingUserIds.has(att.userId)) {
        const hashSeed = `${eventId}-${att.userId}-${Date.now()}-${Math.random()}`;
        // Simple client-side pseudo-hash
        const hash = Array.from(hashSeed)
          .reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0)
          .toString(16)
          .replace('-', 'f')
          .padEnd(64, 'a1b2c3d4e5f67890');

        const cert: IssuedCertificate = {
          id: `cert-${Date.now()}-${idx}`,
          certificateNumber: `UNI-2026-${event.slug.substring(0, 3).toUpperCase()}-${String(100 + idx).padStart(4, '0')}`,
          verificationHash: hash,
          eventId: event.id,
          eventTitle: event.title,
          clubId: event.clubId,
          clubName: event.clubName,
          clubLogo: event.clubLogo,
          userId: att.userId,
          studentName: att.studentName,
          studentDepartment: att.studentDepartment,
          issueDate: new Date().toISOString().split('T')[0],
          naacCategory: event.naacCategory,
          signerName: `${mockInstitution.iqacDirector} & ${event.clubName} President`,
          signerTitle: `Director, IQAC & Club Lead`,
        };
        newlyIssued.push(cert);
      }
    });

    if (newlyIssued.length > 0) {
      setCertificates(prev => [...newlyIssued, ...prev]);
    }

    return { count: newlyIssued.length, certificates: newlyIssued };
  };

  const updateApplicantStatus = (applicantId: string, newStatus: RecruitmentApplicant['status']) => {
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: newStatus } : a));
  };

  const resetToFactoryDemo = () => {
    localStorage.clear();
    setActiveRoleState('STUDENT');
    setCurrentStudent(mockStudents[0]);
    setSelectedClubIdState(mockClubs[0].id);
    setEvents(mockEvents);
    setRegistrations(mockRegistrations);
    setCertificates(mockIssuedCertificates);
    setApplicants(mockRecruitmentApplicants);
  };

  const naacSummary: NAACReportSummary = {
    cycleYear: 'Academic Year 2025-26',
    totalClubs: mockClubs.length,
    totalEventsOrganized: events.length,
    totalStudentParticipations: registrations.length,
    uniqueStudentsParticipated: new Set(registrations.map(r => r.userId)).size,
    certificatesIssued: certificates.length,
    departmentBreakdown: [
      { department: 'Computer Engineering', participants: 420 },
      { department: 'Information Technology', participants: 310 },
      { department: 'Electronics & Telecom', participants: 245 },
      { department: 'Mechanical & Civil', participants: 180 },
    ],
    categoryBreakdown: [
      { category: 'Technical Skills (Workshops & Hackathons)', events: 14, participants: 740 },
      { category: 'Capability Enhancement & Guidance', events: 8, participants: 490 },
      { category: 'Cultural & Debating Activities', events: 5, participants: 215 },
    ]
  };

  return {
    institution: mockInstitution,
    activeRole,
    setActiveRole,
    currentStudent,
    setCurrentStudent,
    clubs: mockClubs,
    selectedClub,
    selectedClubId,
    setSelectedClubId,
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
  };
}
