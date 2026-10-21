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
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', encodeURI(csvContent));
    dlAnchor.setAttribute('download', `securelock_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    dlAnchor.click();
    setExportNotice('Exported audit trail as CSV');
    setTimeout(() => setExportNotice(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Activity Log
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographic audit trail of all security alerts, system commands, and state alterations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {exportNotice && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium mr-2">
              <Check className="w-3.5 h-3.5" /> {exportNotice}
            </span>
          )}
          <button
            onClick={exportCSV}
            className="cyber-btn-secondary text-xs flex items-center gap-1.5"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportJSON}
            className="cyber-btn-secondary text-xs flex items-center gap-1.5"
            title="Download Raw JSON"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="cyber-card p-6 space-y-4">
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by keyword or event..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-[#101827] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedDeviceFilter}
              onChange={(e) => setSelectedDeviceFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-[#101827] text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Devices</option>
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>{d.deviceName}</option>
              ))}
            </select>

            <select
              value={selectedSeverityFilter}
              onChange={(e) => setSelectedSeverityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-[#101827] text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/[0.06] text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Device</th>
                <th className="py-2.5 px-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                filtered.map((evt) => (
                  <tr key={evt.eventId} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-3">
                      <SeverityBadge severity={evt.severity} />
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {evt.eventType.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                      {evt.deviceName || 'Android'}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {evt.description}
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
