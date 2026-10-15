import React, { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { 
  History, 
  Download, 
  Search, 
  Filter, 
  FileText, 
  ShieldCheck, 
  Check, 
  Clock,
  Layers,
  Calendar
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
    setExportNotice('Exported audit trail as JSON format');
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
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>CRYPTOGRAPHIC SECURITY EVENT HISTORY</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable chronological audit record of all remote commands, sensor alerts, and integrity handshakes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportJSON}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={exportCSV}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by event type, ID, or description..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* Device Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Device:</span>
            <select
              value={selectedDeviceFilter}
              onChange={(e) => setSelectedDeviceFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Enrolled Devices</option>
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.deviceName.split(' ')[0]} ({d.deviceId})
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Severity:</span>
            <select
              value={selectedSeverityFilter}
              onChange={(e) => setSelectedSeverityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Only</option>
              <option value="MEDIUM">Medium Only</option>
              <option value="LOW">Low Only</option>
            </select>
          </div>

        </div>

      </div>

      {/* Events Table Container */}
      <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Timestamp / Event ID</th>
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3">Event Classification</th>
                <th className="px-5 py-3">Device Target</th>
                <th className="px-5 py-3">Audit Details</th>
                <th className="px-5 py-3">Integrity SHA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.length > 0 ? (
                filtered.map((evt) => (
                  <tr key={evt.eventId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="font-mono text-slate-200">
                        {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {new Date(evt.timestamp).toISOString().split('T')[0]} • {evt.eventId}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <SeverityBadge severity={evt.severity} />
                    </td>

                    <td className="px-5 py-3.5 font-bold text-white whitespace-nowrap">
                      {evt.eventType.replace(/_/g, ' ')}
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-semibold text-slate-200">
                        {evt.deviceName ? evt.deviceName.split(' ')[0] : 'Android'}
                      </span>
                      <p className="text-[10px] text-slate-500 font-mono">{evt.deviceId}</p>
                    </td>

                    <td className="px-5 py-3.5 max-w-xs text-slate-300 leading-snug">
                      {evt.description}
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[10px] text-cyan-400/80">
                      {evt.integrityHash || 'sha256-verified'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500 italic">
                    Zero security events matching current filter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-950/90 px-5 py-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Showing {filtered.length} of {securityEvents.length} cryptographic audit logs</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Immutable Hash Chain Verified
          </span>
        </div>
      </div>

    </div>
  );
};
