import React, { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { 
  History, 
  Download, 
  Search, 
  Check, 
  Clock, 
  FileText
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const EventHistoryPage: React.FC<Props> = ({ onNavigate }) => {
  const { securityEvents, devices } = useDevices();

  const [selectedDeviceFilter, setSelectedDeviceFilter] = useState<string>('ALL');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filtered = securityEvents.filter((evt) => {
    if (selectedDeviceFilter !== 'ALL' && evt.deviceId !== selectedDeviceFilter) return false;
    if (selectedSeverityFilter !== 'ALL' && evt.severity !== selectedSeverityFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        evt.description.toLowerCase().includes(q) ||
        evt.eventType.toLowerCase().includes(q) ||
        evt.eventId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filtered, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `securelock_audit_log_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchor.click();
    setExportNotice('Exported audit trail as JSON');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const exportCSV = () => {
    const headers = ['EventID', 'Timestamp', 'DeviceID', 'DeviceName', 'EventType', 'Severity', 'Status', 'Description'];
    const rows = filtered.map((e) => [
      e.eventId,
      e.timestamp,
      e.deviceId,
      `"${e.deviceName || ''}"`,
      e.eventType,
      e.severity,
      e.status,
      `"${e.description.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', encodeURI(csvContent));
    dlAnchor.setAttribute('download', `securelock_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    dlAnchor.click();
    setExportNotice('Exported audit trail as CSV spreadsheet');
    setTimeout(() => setExportNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-300">
              AUDIT TRAIL
            </span>
            <span className="text-xs font-mono text-slate-400">Total Entries: {filtered.length}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Security Event History
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable chronological audit record of all remote commands, sensor alerts, and integrity handshakes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {exportNotice && (
            <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>{exportNotice}</span>
            </div>
          )}

          <button
            onClick={exportJSON}
            className="cyber-btn-secondary text-xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={exportCSV}
            className="cyber-btn-secondary text-xs"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="cyber-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Device Filter */}
            <select
              value={selectedDeviceFilter}
              onChange={(e) => setSelectedDeviceFilter(e.target.value)}
              className="bg-[#0B1120] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Hardware Devices</option>
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.deviceName} ({d.deviceId})
                </option>
              ))}
            </select>

            {/* Severity Filter */}
            <select
              value={selectedSeverityFilter}
              onChange={(e) => setSelectedSeverityFilter(e.target.value)}
              className="bg-[#0B1120] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Threat Severities</option>
              <option value="CRITICAL">Critical Alerts Only</option>
              <option value="HIGH">High Severity</option>
              <option value="MEDIUM">Medium Severity</option>
              <option value="LOW">Low / Info</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search audit descriptions..."
              className="bg-[#0B1120] border border-white/[0.1] rounded-xl pl-8 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full md:w-64"
            />
          </div>

        </div>
      </div>

      {/* Events Table Container */}
      <div className="cyber-card overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A2537] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/[0.08]">
              <tr>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Event Type</th>
                <th className="px-4 py-3">Target Device</th>
                <th className="px-4 py-3">Description & Diagnostic Payload</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500 italic">
                    No security events match the active search and filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((evt) => (
                  <tr key={evt.eventId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <SeverityBadge severity={evt.severity} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{new Date(evt.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-white">
                      {evt.eventType.replace(/_/g, ' ')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-200">
                      {evt.deviceName || evt.deviceId}
                    </td>
                    <td className="px-4 py-3 text-slate-300 max-w-md leading-relaxed">
                      {evt.description}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                        {evt.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
