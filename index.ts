export type UserRole = 
  | 'STUDENT'
  | 'CLUB_VOLUNTEER'
  | 'CLUB_ADMIN'
  | 'FACULTY_ADVISOR'
  | 'COLLEGE_ADMIN';

export type EventStatus = 
  | 'DRAFT'
  | 'PUBLISHED'
  | 'ONGOING'
  | 'COMPLETED'
  | 'CANCELLED';

export type RegistrationStatus = 
  | 'REGISTERED'
  | 'CHECKED_IN'
  | 'CANCELLED'
  | 'WAITLISTED';

export type RecruitmentStatus = 
  | 'APPLIED'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'ACCEPTED'
  | 'REJECTED';

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  domain: string;
  logoUrl: string;
  location: string;
  naacCycle: string;
  iqacDirector: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  username: string; // e.g. "aditi.bhor"
  email: string;
  phone: string;
  prnRollNo: string;
  department: string;
  graduationYear: number;
  division: string;
  avatarUrl: string;
  bio: string;
  linkedinUrl?: string;
  githubUrl?: string;
  volunteerHours: number;
}

export interface Club {
  id: string;
  institutionId: string;
  name: string;
  slug: string;
  category: 'Technical' | 'Cultural' | 'Sports' | 'Social' | 'Departmental';
  logoUrl: string;
  bannerUrl: string;
  description: string;
  instagramHandle: string;
  facultyAdvisor: string;
  presidentName: string;
  membersCount: number;
  eventsCount: number;
  foundedYear: number;
  verified: boolean;
}

export interface ClubMember {
  id: string;
  clubId: string;
  userId: string;
  user: UserProfile;
  team: string; // "Network Team", "Technical", "Design"
  designation: string; // "Lead", "Coordinator", "Volunteer", "Member"
  role: UserRole;
  joinedDate: string;
  tenureYear: string;
  eventsOrganized: number;
  isActive: boolean;
}

export interface EventSpeaker {
  name: string;
  title: string;
  company: string;
  avatarUrl: string;
}

export interface EventItem {
  id: string;
  clubId: string;
  clubName: string;
  clubLogo: string;
  institutionId: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  bannerUrl: string;
  venue: string;
  isOnline: boolean;
  meetingLink?: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  registrationDeadline: string;
  maxCapacity: number;
  registeredCount: number;
  attendedCount: number;
  entryFee: number;
  eligibility: string;
  speakers: EventSpeaker[];
  status: EventStatus;
  category: 'Workshop' | 'Hackathon' | 'Webinar' | 'Competition' | 'Fest';
  facultyApproved: boolean;
  naacCategory: 'Technical Skills' | 'Cultural Activity' | 'Sports' | 'Capability Enhancement';
  certificateTemplateId?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  studentRollNo: string;
  studentDepartment: string;
  ticketToken: string; // Used for QR code verification
  registeredAt: string;
  status: RegistrationStatus;
  checkedInAt?: string;
  checkedInBy?: string;
}

export interface IssuedCertificate {
  id: string;
  certificateNumber: string; // "UNI-2026-AIW-0084"
  verificationHash: string;  // SHA256 hex
  eventId: string;
  eventTitle: string;
  clubId: string;
  clubName: string;
  clubLogo: string;
  userId: string;
  studentName: string;
  studentDepartment: string;
  issueDate: string;
  naacCategory: string;
  signerName: string;
  signerTitle: string;
}

export interface RecruitmentApplicant {
  id: string;
  cycleId: string;
  clubId: string;
  studentName: string;
  studentEmail: string;
  department: string;
  graduationYear: number;
  division: string;
  targetTeam: string;
  statementOfPurpose: string;
  portfolioUrl?: string;
  status: RecruitmentStatus;
  appliedDate: string;
  interviewNotes?: string;
}

export interface NAACReportSummary {
  cycleYear: string;
  totalClubs: number;
  totalEventsOrganized: number;
  totalStudentParticipations: number;
  uniqueStudentsParticipated: number;
  certificatesIssued: number;
  departmentBreakdown: { department: string; participants: number }[];
  categoryBreakdown: { category: string; events: number; participants: number }[];
}
