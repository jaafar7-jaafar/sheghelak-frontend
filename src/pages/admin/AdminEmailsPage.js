import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, Users, User, Search, CheckCircle, Clock, Mail, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { SkeletonLine } from '../../components/ui/Skeleton';
import adminEmailService from '../../services/adminEmailService';

// ─── Email Composer ───────────────────────────────────────────────────────────
function EmailComposer({ onSent }) {
  const [targetType, setTargetType] = useState('all'); // 'all' | 'user'
  const [subject, setSubject]       = useState('');
  const [body, setBody]             = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [users, setUsers]           = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [sending, setSending]       = useState(false);
  const [result, setResult]         = useState(null);
  const [error, setError]           = useState('');

  // Load users when switching to 'user' mode
  useEffect(() => {
    if (targetType !== 'user') return;
    const load = async () => {
      setLoadingUsers(true);
      try {
        const res = await adminEmailService.getUsers(userSearch);
        setUsers(res.data || []);
      } catch { setUsers([]); }
      finally { setLoadingUsers(false); }
    };
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [targetType, userSearch]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject.trim()) { setError('Subject is required.'); return; }
    if (!body.trim()) { setError('Body is required.'); return; }
    if (targetType === 'user' && !selectedUser) { setError('Select a recipient.'); return; }

    setSending(true); setError(''); setResult(null);
    try {
      const payload = { subject, body, targetType };
      if (targetType === 'user') payload.userId = selectedUser.id;
      const res = await adminEmailService.send(payload);
      setResult(res.data);
      onSent();
      if (res.data?.sent > 0) {
        setSubject(''); setBody('');
        if (targetType === 'user') { setSelectedUser(null); setUserSearch(''); }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-primary/8 dark:bg-primary/15 flex items-center justify-center">
          <Mail size={17} className="text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-on-surface dark:text-white">Compose Email</h2>
          <p className="text-xs text-on-surface-variant dark:text-slate-400">Send to all users or a specific person</p>
        </div>
      </div>

      {/* Target type toggle */}
      <div className="flex gap-2 mb-5 p-1 bg-surface-container dark:bg-white/5 rounded-xl">
        {[
          { val: 'all',  label: 'All Active Users', icon: Users },
          { val: 'user', label: 'Specific User',    icon: User  },
        ].map(({ val, label, icon: Icon }) => (
          <button key={val} type="button" onClick={() => { setTargetType(val); setSelectedUser(null); setResult(null); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              targetType === val
                ? 'bg-white dark:bg-slate-700 text-on-surface dark:text-white shadow-card'
                : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white'
            }`}>
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* User picker */}
      {targetType === 'user' && (
        <div className="mb-4">
          <label className="text-sm font-medium text-on-surface dark:text-slate-200 block mb-2">Select Recipient *</label>

          {/* Selected user display */}
          {selectedUser ? (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/4 dark:bg-primary/8 mb-2">
              <Avatar name={selectedUser.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface dark:text-white truncate">{selectedUser.name}</p>
                <p className="text-xs text-outline dark:text-slate-500 truncate">{selectedUser.email}</p>
              </div>
              <button onClick={() => { setSelectedUser(null); setShowUserList(true); }}
                className="text-xs text-primary hover:underline font-medium">Change</button>
            </div>
          ) : (
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-500" />
              <input type="text" placeholder="Search by name or email..." value={userSearch}
                onChange={e => { setUserSearch(e.target.value); setShowUserList(true); }}
                onFocus={() => setShowUserList(true)}
                className="input-field pl-9 w-full" />
            </div>
          )}

          {/* User dropdown */}
          {!selectedUser && showUserList && (
            <div className="mt-1 rounded-lg border border-outline-variant/30 dark:border-white/5 max-h-48 overflow-y-auto divide-y divide-outline-variant/20 dark:divide-white/5 bg-white dark:bg-slate-800 shadow-card">
              {loadingUsers ? (
                <div className="p-3 text-sm text-outline dark:text-slate-500 text-center">Searching...</div>
              ) : users.length === 0 ? (
                <div className="p-3 text-sm text-outline dark:text-slate-500 text-center">No users found</div>
              ) : users.map(u => (
                <button key={u.id} type="button"
                  onClick={() => { setSelectedUser(u); setShowUserList(false); setUserSearch(''); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-surface-container dark:hover:bg-white/5 transition-colors">
                  <Avatar name={u.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface dark:text-white truncate">{u.name}</p>
                    <p className="text-xs text-outline dark:text-slate-500 truncate">{u.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`rounded-lg px-4 py-3 mb-4 text-sm flex items-start gap-2 ${
          result.failed > 0 ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-700/20 text-amber-700 dark:text-amber-400'
            : 'bg-tertiary/10 border border-tertiary/20 text-tertiary'
        }`}>
          <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Email sent successfully!</p>
            <p className="text-xs mt-0.5 opacity-80">
              {result.sent} sent{result.failed > 0 ? `, ${result.failed} failed` : ''} out of {result.total} recipient{result.total !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-3 mb-4 text-sm text-error flex items-center gap-2">
          <AlertCircle size={14} />{error}
        </div>
      )}

      <form onSubmit={handleSend} className="space-y-4">
        {/* Email template hint */}
        <div className="bg-surface-container dark:bg-white/5 rounded-lg p-3">
          <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-relaxed">
            <span className="font-medium text-on-surface dark:text-white">Template:</span> Your email will be sent with the Sheghelak branded template. Write plain text — paragraphs are formatted automatically. Use blank lines to separate paragraphs.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-on-surface dark:text-slate-200 block mb-1.5">Subject *</label>
          <input type="text" className="input-field w-full" placeholder="e.g. Important Update from Sheghelak"
            value={subject} onChange={e => setSubject(e.target.value)} required />
        </div>

        <div>
          <label className="text-sm font-medium text-on-surface dark:text-slate-200 block mb-1.5">Body *</label>
          <textarea className="input-field w-full resize-none" rows={8}
            placeholder={`Write your email body here...

Each paragraph separated by a blank line will be formatted as its own paragraph.

You can write multiple lines and they will display cleanly in the email template.`}
            value={body} onChange={e => setBody(e.target.value)} required />
          <p className="text-xs text-outline dark:text-slate-500 mt-1">{body.length} characters</p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-sm text-on-surface-variant dark:text-slate-400">
            {targetType === 'all'
              ? <span className="flex items-center gap-1.5"><Users size={14} /> Sending to all active users</span>
              : selectedUser
              ? <span className="flex items-center gap-1.5"><User size={14} /> Sending to {selectedUser.name}</span>
              : <span className="text-outline dark:text-slate-500">No recipient selected</span>
            }
          </div>
          <Button type="submit" variant="primary" size="md" icon={Send} loading={sending}>
            {sending ? 'Sending...' : 'Send Email'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

// ─── Send Logs ────────────────────────────────────────────────────────────────
function SendLogs({ refreshTrigger }) {
  const [logs, setLogs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminEmailService.getLogs();
      setLogs(res.data || []);
    } catch { setLogs([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load, refreshTrigger]);

  const grouped = logs.reduce((acc, log) => {
    const key = log.subject;
    if (!acc[key]) acc[key] = { subject: log.subject, sentAt: log.sentAt, sent: 0, failed: 0 };
    if (log.status === 'sent') acc[key].sent++;
    else acc[key].failed++;
    return acc;
  }, {});
  const groupedList = Object.values(grouped).slice(0, 20);

  function timeAgo(d) {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 2) return 'Just now';
    if (hrs < 1)  return `${mins}m ago`;
    if (days < 1) return `${hrs}h ago`;
    return `${days}d ago`;
  }

  return (
    <Card className="overflow-hidden">
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-surface-container dark:hover:bg-white/3 transition-colors">
        <div className="w-9 h-9 rounded-lg bg-secondary/8 dark:bg-secondary/15 flex items-center justify-center flex-shrink-0">
          <Clock size={17} className="text-secondary" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-on-surface dark:text-white text-sm">Send History</p>
          <p className="text-xs text-on-surface-variant dark:text-slate-400">Recent emails sent from admin</p>
        </div>
        {open ? <ChevronUp size={18} className="text-outline dark:text-slate-500" /> : <ChevronDown size={18} className="text-outline dark:text-slate-500" />}
      </button>

      {open && (
        <div className="border-t border-outline-variant/20 dark:border-white/5">
          {loading ? (
            <div className="p-5 space-y-3">{[1,2,3].map(i => <SkeletonLine key={i} height="h-10" />)}</div>
          ) : groupedList.length === 0 ? (
            <p className="text-sm text-outline dark:text-slate-500 text-center py-8">No emails sent yet.</p>
          ) : (
            <div className="divide-y divide-outline-variant/15 dark:divide-white/5">
              {groupedList.map((log, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-3 hover:bg-surface-container-low dark:hover:bg-white/2 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${log.failed > 0 ? 'bg-amber-100 dark:bg-amber-900/20' : 'bg-tertiary/10 dark:bg-tertiary/20'}`}>
                    {log.failed > 0
                      ? <AlertCircle size={15} className="text-amber-600 dark:text-amber-400" />
                      : <CheckCircle size={15} className="text-tertiary" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface dark:text-white truncate">{log.subject}</p>
                    <p className="text-xs text-outline dark:text-slate-500">
                      {log.sent} sent{log.failed > 0 ? ` · ${log.failed} failed` : ''}
                    </p>
                  </div>
                  <span className="text-xs text-outline dark:text-slate-500 flex-shrink-0">{timeAgo(log.sentAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminEmailsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <DashboardLayout isAdmin>
      <div className="p-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <h1 className="text-xl font-bold text-on-surface dark:text-white">Send Emails</h1>
            <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-0.5">
              Send branded emails to all users or any specific user
            </p>
          </div>

          <div className="space-y-5">
            <EmailComposer onSent={() => setRefreshTrigger(p => p + 1)} />
            <SendLogs refreshTrigger={refreshTrigger} />
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
