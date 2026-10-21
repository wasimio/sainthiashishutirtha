'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import {
  Search,
  Filter,
  Download,
  PlusCircle,
  Eye,
  X
} from 'lucide-react';
import { SAMPLE_ADMISSIONS } from '@/data/schoolData';

export default function AdmissionsTablePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [applications, setApplications] = useState(SAMPLE_ADMISSIONS);
  const [activeModalApp, setActiveModalApp] = useState<typeof SAMPLE_ADMISSIONS[0] | null>(null);

  // Filter logic
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = selectedClass === 'All' || app.appliedClass.toLowerCase() === selectedClass.toLowerCase();
    const matchesStatus = selectedStatus === 'All' || app.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setApplications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (activeModalApp && activeModalApp.id === id) {
      setActiveModalApp((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#243B43]">
      <DashboardHeader
        role="admin"
        title="Admission Applications Table"
        subtitle="Manage student admissions for Session 2025–2026 (KG – Class IV)"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/admin" className="hover:text-[#308599]">Admin Dashboard</Link>
              <span>/</span>
              <span className="font-semibold text-[#243B43]">Admissions Pipeline</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#243B43]">
              Student Enrolment Applications
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert('Simulated Action: Exporting applications CSV')}
              className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#243B43] hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#308599]" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Simulated Action: Open offline physical form registration modal')}
              className="px-4 py-2 bg-[#308599] hover:bg-[#266b7b] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Application</span>
            </button>
          </div>
        </div>

        {/* Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Filtered</span>
            <div className="text-xl sm:text-2xl font-black text-[#243B43]">{filteredApps.length}</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-amber-700">Under Review</span>
            <div className="text-xl sm:text-2xl font-black text-amber-900">
              {applications.filter((a) => a.status === 'Under Review').length}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-blue-700">Interview Scheduled</span>
            <div className="text-xl sm:text-2xl font-black text-blue-900">
              {applications.filter((a) => a.status === 'Interview Scheduled').length}
            </div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-emerald-700">Approved / Enrolled</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-900">
              {applications.filter((a) => a.status === 'Approved' || a.status === 'Enrolled').length}
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student, parent or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#308599]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5" />
              <span>Grade:</span>
            </div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:ring-[#308599]"
            >
              <option value="All">All Grades</option>
              <option value="KG">KG</option>
              <option value="Class I">Class I</option>
              <option value="Class II">Class II</option>
              <option value="Class III">Class III</option>
              <option value="Class IV">Class IV</option>
            </select>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium ml-2">
              <span>Status:</span>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:ring-[#308599]"
            >
              <option value="All">All Statuses</option>
              <option value="Under Review">Under Review</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Approved">Approved</option>
              <option value="Enrolled">Enrolled</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#243B43]">
              <thead className="bg-[#EAF5F7] text-[#243B43] uppercase text-[10px] tracking-wider font-extrabold border-b border-[#A5D1DC]/60">
                <tr>
                  <th className="py-3.5 px-4">Application ID</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Applied Class</th>
                  <th className="py-3.5 px-4">Parent / Guardian</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      No matching admission records found.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#308599]">
                        {app.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#243B43]">{app.applicantName}</div>
                        <div className="text-[10px] text-slate-400">DOB: {app.dob}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                          {app.appliedClass}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {app.parentName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono">
                        {app.phone}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {app.submissionDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                            app.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : app.status === 'Enrolled'
                              ? 'bg-teal-100 text-teal-800 border border-teal-200'
                              : app.status === 'Interview Scheduled'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setActiveModalApp(app)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#EAF5F7] hover:bg-[#308599] hover:text-white text-[#308599] rounded-lg transition-colors font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Application Details Drawer / Modal */}
        {activeModalApp && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setActiveModalApp(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200 space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveModalApp(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="font-mono text-xs font-bold text-[#308599]">
                    {activeModalApp.id}
                  </span>
                  <h3 className="text-xl font-bold text-[#243B43]">
                    {activeModalApp.applicantName}
                  </h3>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    activeModalApp.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeModalApp.status === 'Interview Scheduled'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {activeModalApp.status}
                </span>
              </div>

              {/* Detail fields */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Applied Class</span>
                  <strong className="text-slate-800">{activeModalApp.appliedClass}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Date of Birth</span>
                  <strong className="text-slate-800">{activeModalApp.dob}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Parent / Guardian</span>
                  <strong className="text-slate-800">{activeModalApp.parentName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Contact Mobile</span>
                  <strong className="text-slate-800 font-mono">{activeModalApp.phone}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">Residential Address</span>
                  <strong className="text-slate-800">{activeModalApp.address}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">Previous Education</span>
                  <strong className="text-slate-800">{activeModalApp.previousSchool}</strong>
                </div>
              </div>

              {/* Status Change Buttons */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Update Application Workflow:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(activeModalApp.id, 'Interview Scheduled')}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold"
                  >
                    Schedule Interview
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(activeModalApp.id, 'Approved')}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold"
                  >
                    Approve Admission
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(activeModalApp.id, 'Enrolled')}
                    className="px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 rounded-lg text-xs font-semibold"
                  >
                    Confirm Enrolled
                  </button>
                </div>
              </div>

              {/* Print Slip */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => alert(`Simulated Action: Printing admission voucher for ${activeModalApp.applicantName}`)}
                  className="text-xs font-semibold text-[#308599] hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Admission Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalApp(null)}
                  className="px-4 py-2 bg-[#243B43] text-white text-xs font-bold rounded-xl"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
