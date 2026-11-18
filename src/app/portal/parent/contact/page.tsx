'use client';

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send
} from 'lucide-react';
import { useParent } from '@/components/portal/parent/ParentContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ParentContactHelpdeskPage() {
  const { selectedChild } = useParent();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setToastMessage(`Inquiry sent to administrative desk regarding ${selectedChild.name} (Demo simulation).`);
    setSubject('');
    setMessage('');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="dark" className="text-[10px] font-mono uppercase">
              Parent Helpdesk
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              Direct School Contact
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mt-1">
            School Contact & Parent Helpdesk
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Reach class mentors, administrative office, transport coordinators, and principal appointments.
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-zinc-950 text-white text-xs rounded-lg shadow-md flex items-center justify-between animate-fade-in">
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)} className="text-zinc-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Grid: Contact Cards + Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Direct Contacts (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Class Teacher Card */}
          <Card className="border-zinc-200/90 shadow-xs">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <Badge variant="dark" className="w-fit text-[10px]">
                {selectedChild.grade} Class Mentor
              </Badge>
              <CardTitle className="text-base font-bold text-zinc-950 mt-1">
                {selectedChild.classTeacher}
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Primary point of contact for academics and daily diary
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-3 space-y-2 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>{selectedChild.classTeacherContact}</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Please write a short note in the physical diary or submit an inquiry form below to schedule a meeting.
              </p>
            </CardContent>
          </Card>

          {/* School Office Card */}
          <Card className="border-zinc-200/90 shadow-xs">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-sm font-semibold text-zinc-950">
                School Administrative Office
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Open Mon–Sat: 8:00 AM – 3:30 PM
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-3 space-y-2.5 text-xs text-zinc-700">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Sainthia, Birbhum, West Bengal 731234</span>
              </div>
              <div className="flex items-center gap-2.5 font-mono">
                <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>+91 94340 12890 / 03462-262100</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>office@shishutirtha.org</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Inquiry Message Form (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="border-zinc-200/90 shadow-xs">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-base font-bold text-zinc-950">
                Send Communication to School Office
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Regarding scholar: <strong className="text-zinc-800">{selectedChild.name} ({selectedChild.scholarId})</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Inquiry Subject / Topic</label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Request for PTM Appointment / Transportation Route Change"
                    className="h-8 text-xs border-zinc-200"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Message Description</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Provide details of your request or question for the administration..."
                    className="w-full p-2.5 text-xs rounded-md border border-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-zinc-400">
                    Replies delivered to parent email and portal alerts
                  </span>
                  <Button type="submit" variant="dark" size="sm" className="text-xs gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
