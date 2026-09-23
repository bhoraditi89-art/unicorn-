import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, Sparkles, Plus } from 'lucide-react';
import { Club, EventItem } from '../../types';

interface CreateEventModalProps {
  club: Club;
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (eventData: Omit<EventItem, 'id' | 'registeredCount' | 'attendedCount' | 'clubLogo' | 'clubName'>) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  club,
  isOpen,
  onClose,
  onCreateEvent,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventItem['category']>('Workshop');
  const [naacCategory, setNaacCategory] = useState<EventItem['naacCategory']>('Technical Skills');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('Seminar Hall 1');
  const [startTime, setStartTime] = useState('2026-10-20T14:00');
  const [maxCapacity, setMaxCapacity] = useState(150);
  const [entryFee, setEntryFee] = useState(0);
  const [speakerName, setSpeakerName] = useState('Industry Specialist');
  const [speakerCompany, setSpeakerCompany] = useState('Google Cloud');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateEvent({
      clubId: club.id,
      institutionId: club.institutionId,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      tagline: tagline || 'Exclusive technical workshop organized by student leaders.',
      description: description || 'Hands-on practical session covering cutting-edge industry tools and architectural best practices.',
      bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      venue,
      isOnline: false,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(new Date(startTime).getTime() + 4 * 3600 * 1000).toISOString(),
      registrationDeadline: new Date(new Date(startTime).getTime() - 24 * 3600 * 1000).toISOString(),
      maxCapacity,
      entryFee,
      eligibility: 'Open to all engineering students',
      speakers: [
        {
          name: speakerName,
          title: 'Senior Engineer',
          company: speakerCompany,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
        }
      ],
      status: 'PUBLISHED',
      category,
      facultyApproved: true,
      naacCategory,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
            {club.name}
          </span>
          <h2 className="text-xl font-extrabold text-white mt-1">Publish New Campus Event</h2>
          <p className="text-xs text-slate-400 mt-1">
            Instantly creates a Luma-style registration page with QR ticketing and automated certificate generation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. NextGen Robotics & Drone Tech 2026"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Activity Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Webinar">Webinar</option>
                <option value="Competition">Competition</option>
                <option value="Fest">Fest</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">NAAC Metric Category</label>
              <select
                value={naacCategory}
                onChange={(e) => setNaacCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Technical Skills">Technical Skills (5.1.3)</option>
                <option value="Cultural Activity">Cultural Activity (5.3.2)</option>
                <option value="Sports">Sports (5.3.2)</option>
                <option value="Capability Enhancement">Capability Enhancement (5.1.3)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tagline / Hook</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="One line description that appears on cards"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Venue</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Seminar Hall 2"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Date & Time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Max Capacity (Seats)</label>
              <input
                type="number"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Entry Fee (₹ 0 for Free)</label>
              <input
                type="number"
                value={entryFee}
                onChange={(e) => setEntryFee(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish Event & Enable QR Ticketing</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
