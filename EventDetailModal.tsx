import React from 'react';
import { X, Calendar, MapPin, Users, Clock, Sparkles, CheckCircle2, ShieldCheck, Share2 } from 'lucide-react';
import { EventItem } from '../../types';

interface EventDetailModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  isRegistered: boolean;
  onRegister: (eventId: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  isRegistered,
  onRegister,
}) => {
  if (!isOpen || !event) return null;

  const capacityPercent = Math.min(100, Math.round((event.registeredCount / event.maxCapacity) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/60 hover:bg-slate-950 text-slate-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-800">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Club Header Badge */}
          <div className="absolute bottom-4 left-6 flex items-center space-x-3">
            <img
              src={event.clubLogo}
              alt={event.clubName}
              className="w-10 h-10 rounded-xl object-cover border-2 border-white/20 shadow-lg"
            />
            <div>
              <div className="text-xs font-semibold text-indigo-300">{event.clubName}</div>
              <div className="text-[11px] text-slate-400">Verified Campus Organization</div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {event.category}
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Faculty Approved</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {event.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {event.tagline}
            </p>
          </div>

          {/* Logistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
            <div className="flex items-center space-x-3 text-slate-300">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="font-semibold text-white">Date & Time</div>
                <div className="text-slate-400">
                  {new Date(event.startTime).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })} • {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-slate-300">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="font-semibold text-white">Venue</div>
                <div className="text-slate-400 truncate">{event.venue}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              About This Event
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Speakers Section */}
          {event.speakers && event.speakers.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Keynote Speakers
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.speakers.map((sp, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <img src={sp.avatarUrl} alt={sp.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <div className="text-xs font-bold text-white">{sp.name}</div>
                      <div className="text-[11px] text-slate-400">{sp.title}</div>
                      <div className="text-[10px] text-indigo-400 font-semibold">{sp.company}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Capacity Progress Bar */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Capacity</span>
              <span className="font-bold text-white">{event.registeredCount} / {event.maxCapacity} Registered</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${capacityPercent}%` }} />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center space-x-3">
            {isRegistered ? (
              <div className="flex-1 py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You are registered! Your QR pass is in My Tickets.</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  onRegister(event.id);
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Confirm Registration & Get QR Pass</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
