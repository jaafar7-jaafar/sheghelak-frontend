import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Send, Users, User, Search, CheckCircle, Clock, Mail,
  ChevronDown, ChevronUp, AlertCircle, Zap, Eye, FileText,
} from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { SkeletonLine } from '../../components/ui/Skeleton';
import adminEmailService from '../../services/adminEmailService';

// ─── Quick templates ───────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    label: 'Welcome',
    icon: '👋',
    subject: 'Welcome to Sheghelak!',
    body: `Hi {{name}},

Welcome to Sheghelak! We're excited to have you on board.

Your account is now active and ready. Your instructor will assign you to a learning path soon.

In the meantime, feel free to explore the platform and join our Telegram community for support from fellow learners.

If you have any questions, don't hesitate to reach out.

See you inside,
The Sheghelak Team`,
  },
  {
    label: 'Announcement',
    icon: '📢',
    subject: 'Important Update from Sheghelak',
    body: `Hi {{name}},

We have an important update to share with you.

[Write your announcement here]

Thank you for being part of the Sheghelak community.

Best regards,
The Sheghelak Team`,
  },
  {
    label: 'Reminder',
    icon: '⏰',
    subject: 'Don\'t forget — your learning path is waiting',
    body: `Hi {{name}},

We noticed you haven't been active recently on your learning path.

Consistency is the key to growth. Even 30 minutes a day makes a huge difference.

Log in today and pick up where you left off. Your progress is saved and your path is waiting for you.

Keep going — you're doing great!

The Sheghelak Team`,
  },
  {
    label: 'Congrats',
    icon: '🏆',
    subject: 'Congratulations on your progress!',
    body: `Hi {{name}},

We wanted to take a moment to celebrate your progress on Sheghelak!

You've been putting in the work and it shows. Keep this momentum going — the next level is within reach.

We're proud to have learners like you on the platform.

Keep building,
The Sheghelak Team`,
  },
];

// ─── Live Email Preview ────────────────────────────────────────────────────────
function EmailPreview({ subject, body, recipientName }) {
  const displayName = recipientName || 'Learner';
  const previewBody = body
    ? body.replace(/\{\{name\}\}/g, displayName).replace(/\{\{path\}\}/g, 'Your Learning Path').replace(/\{\{level\}\}/g, 'Current Level')
    : '';

  const paragraphs = previewBody
    ? previewBody.split(/\n{2,}/).map(p => p.replace(/\n/g, '<br/>'))
    : [];

  return (
    <div className="rounded-xl border border-outline-variant/30 dark:border-white/5 overflow-hidden bg-slate-100 dark:bg-slate-900">
      {/* Preview label */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-low dark:bg-slate-800 border-b border-outline-variant/20 dark:border-white/5">
        <Eye size={13} className="text-outline dark:text-slate-500" />
        <span className="text-xs font-medium text-outline dark:text-slate-500">Email Preview</span>
        <span className="ml-auto text-xs text-outline dark:text-slate-600 bg-primary/8 dark:bg-primary/15 text-primary px-2 py-0.5 rounded-full">Live</span>
      </div>

      {/* Inbox header simulation */}
      <div className="bg-white dark:bg-slate-950 px-4 py-3 border-b border-outline-variant/20 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-on-surface dark:text-white">Sheghelak <span className="font-normal text-outline dark:text-slate-500">&lt;no-reply@sheghelak.com&gt;</span></p>
            <p className="text-xs text-outline dark:text-slate-500 truncate">
              To: {recipientName || 'All Active Users'}
            </p>
          </div>
          <span className="text-xs text-outline dark:text-slate-600 flex-shrink-0">Just now</span>
        </div>
        <p className="text-sm font-bold text-on-surface dark:text-white mt-2 leading-snug">
          {subject || <span className="text-outline dark:text-slate-600 font-normal italic">No subject yet…</span>}
        </p>
      </div>

      {/* Email body — branded template */}
      <div className="overflow-y-auto max-h-[500px]" style={{ background: '#f4f4f5' }}>
        {/* Brand header */}
        <div style={{ background: '#0050cb', padding: '28px 32px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <img src="/logo.png" alt="Sheghelak" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
            <span style={{ color: '#fff', fontWeight: '800', fontSize: '20px', letterSpacing: '-0.5px' }}>Sheghelak</span>
          </div>
        </div>

        {/* Body card */}
        <div style={{ maxWidth: '540px', margin: '24px auto', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '32px 36px' }}>
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => (
                <p key={i} style={{ fontSize: '15px', lineHeight: '1.7', color: '#1e293b', marginBottom: '16px', marginTop: 0 }}
                  dangerouslySetInnerHTML={{ __html: p }} />
              ))
            ) : (
              <p style={{ fontSize: '15px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '24px 0' }}>
                Your email body will appear here…
              </p>
            )}
          </div>

          {/* CTA button */}
          <div style={{ padding: '0 36px 32px', textAlign: 'center' }}>
            <a href="#" style={{ display: 'inline-block', background: '#0050cb', color: '#fff', fontWeight: '700', fontSize: '14px', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', letterSpacing: '0.01em' }}>
              Open Sheghelak →
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 32px 28px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 6px' }}>© 2026 Sheghelak · All rights reserved</p>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>You received this email because you have an account on Sheghelak.com</p>
        </div>
      </div>
    </div>
  );
}

// ─── Email Composer ────────────────────────────────────────────────────────────
function EmailComposer({ onSent }) {
  const bodyRef = useRef(null);

  const [targetType, setTargetType]   = useState('all');
  const [subject, setSubject]         = useState('');
  const [body, setBody]               = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearch, setUserSearch]   = useState('');
  const [users, setUsers]             = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [sending, setSending]         = useState(false);
  const [result, setResult]           = useState(null);
  const [error, setError]             = useState('');
  const [activeTemplate, setActiveTemplate] = useState(null);

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

  const applyTemplate = (tpl, index) => {
    setSubject(tpl.subject);
    setBody(tpl.body);
    setActiveTemplate(index);
    setResult(null);
    setError('');
  };

  const insertVariable = (variable) => {
    const el = bodyRef.current;
    if (!el) { setBody(prev => prev + variable); return; }
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const next  = body.slice(0, start) + variable + body.slice(end);
    setBody(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + variable.length, start + variable.length);
    }, 0);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject.trim()) { setError('Subject is required.'); return; }
    if (!body.trim())    { setError('Body is required.'); return; }
    if (targetType === 'user' && !selectedUser) { setError('Select a recipient.'); return; }

    setSending(true); setError(''); setResult(null);
    try {
      const payload = { subject, body, targetType };
      if (targetType === 'user') payload.userId = selectedUser.id;
      const res = await adminEmailService.send(payload);
      setResult(res.data);
      onSent();
      if (res.data?.sent > 0) {
        setSubject(''); setBody(''); setActiveTemplate(null);
        if (targetType === 'user') { setSelectedUser(null); setUserSearch(''); }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* ── Left: Composer ──────────────────────────────────────── */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-primary/8 dark:bg-primary/15 flex items-center justify-center">
            <Mail size={17} className="text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-on-surface dark:text-white">Compose Email</h2>
            <p className="text-xs text-on-surface-variant dark:text-slate-400">Sent with the Sheghelak branded template</p>
          </div>
        </div>

        {/* Target toggle */}
        <div className="flex gap-2 mb-5 p-1 bg-surface-container dark:bg-white/5 rounded-xl">
          {[
            { val: 'all',  label: 'All Active Users', icon: Users },
            { val: 'user', label: 'Specific User',    icon: User  },
          ].map(({ val, label, icon: Icon }) => (
            <button key={val} type="button"
              onClick={() => { setTargetType(val); setSelectedUser(null); setResult(null); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                targetType === val
                  ? 'bg-white dark:bg-slate-700 text-on-surface dark:text-white shadow-card'
                  : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white'
              }`}>
              <Icon size={15} />{label}
            </button>
          ))}
        </div>

        {/* User picker */}
        {targetType === 'user' && (
          <div className="mb-4">
            <label className="text-sm font-medium text-on-surface dark:text-slate-200 block mb-2">Select Recipient *</label>
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
                <input type="text" placeholder="Search by name or email…" value={userSearch}
                  onChange={e => { setUserSearch(e.target.value); setShowUserList(true); }}
                  onFocus={() => setShowUserList(true)}
                  className="input-field pl-9 w-full" />
              </div>
            )}
            {!selectedUser && showUserList && (
              <div className="mt-1 rounded-lg border border-outline-variant/30 dark:border-white/5 max-h-44 overflow-y-auto divide-y divide-outline-variant/20 dark:divide-white/5 bg-white dark:bg-slate-800 shadow-card">
                {loadingUsers ? (
                  <div className="p-3 text-sm text-outline dark:text-slate-500 text-center">Searching…</div>
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

        {/* Quick templates */}
        <div className="mb-4">
          <p className="text-xs font-medium text-on-surface-variant dark:text-slate-400 mb-2 flex items-center gap-1.5">
            <Zap size={12} className="text-primary" /> Quick Templates
          </p>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map((tpl, i) => (
              <button key={i} type="button" onClick={() => applyTemplate(tpl, i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all text-sm ${
                  activeTemplate === i
                    ? 'border-primary/30 bg-primary/5 dark:bg-primary/10 text-primary font-medium'
                    : 'border-outline-variant/30 dark:border-white/5 text-on-surface-variant dark:text-slate-400 hover:border-primary/20 hover:bg-surface-container dark:hover:bg-white/5'
                }`}>
                <span>{tpl.icon}</span>
                <span className="truncate">{tpl.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Result / Error */}
        {result && (
          <div className={`rounded-lg px-4 py-3 mb-4 text-sm flex items-start gap-2 ${
            result.failed > 0
              ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-700/20 text-amber-700 dark:text-amber-400'
              : 'bg-tertiary/10 border border-tertiary/20 text-tertiary'
          }`}>
            <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Email sent!</p>
              <p className="text-xs mt-0.5 opacity-80">
                {result.sent} delivered{result.failed > 0 ? `, ${result.failed} failed` : ''} · {result.total} recipient{result.total !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-3 mb-4 text-sm text-error flex items-center gap-2">
            <AlertCircle size={14} />{error}
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-3">
          {/* Subject */}
          <div>
            <label className="text-sm font-medium text-on-surface dark:text-slate-200 block mb-1.5">Subject *</label>
            <input type="text" className="input-field w-full"
              placeholder="e.g. Important Update from Sheghelak"
              value={subject} onChange={e => { setSubject(e.target.value); setActiveTemplate(null); }} required />
          </div>

          {/* Body */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-on-surface dark:text-slate-200">Body *</label>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-outline dark:text-slate-600">Insert:</span>
                {['{{name}}', '{{path}}', '{{level}}'].map(v => (
                  <button key={v} type="button" onClick={() => insertVariable(v)}
                    className="text-xs px-1.5 py-0.5 rounded bg-primary/8 dark:bg-primary/15 text-primary hover:bg-primary/15 dark:hover:bg-primary/25 transition-colors font-mono">
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              ref={bodyRef}
              className="input-field w-full resize-none font-mono text-sm"
              rows={10}
              placeholder={`Hi {{name}},\n\nWrite your message here...\n\nBest regards,\nThe Sheghelak Team`}
              value={body}
              onChange={e => { setBody(e.target.value); setActiveTemplate(null); }}
              required
            />
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-3 text-xs text-outline dark:text-slate-500">
                <span><span className="font-mono text-primary">{'{{name}}'}</span> → recipient's name</span>
              </div>
              <span className={`text-xs ${body.length > 4000 ? 'text-error' : 'text-outline dark:text-slate-500'}`}>
                {body.length.toLocaleString()} chars
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-sm text-on-surface-variant dark:text-slate-400 flex items-center gap-1.5">
              {targetType === 'all'
                ? <><Users size={14} /> All active users</>
                : selectedUser
                ? <><User size={14} /> {selectedUser.name}</>
                : <span className="text-outline dark:text-slate-500">No recipient selected</span>
              }
            </p>
            <Button type="submit" variant="primary" size="md" icon={Send} loading={sending}>
              {sending ? 'Sending…' : 'Send Email'}
            </Button>
          </div>
        </form>
      </Card>

      {/* ── Right: Live Preview ──────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <EmailPreview
          subject={subject}
          body={body}
          recipientName={selectedUser?.name || (targetType === 'all' ? null : null)}
        />
      </div>
    </div>
  );
}

// ─── Send Logs ────────────────────────────────────────────────────────────────
function SendLogs({ refreshTrigger }) {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen]       = useState(false);

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
          <p className="text-xs text-on-surface-variant dark:text-slate-400">
            {groupedList.length > 0 ? `${groupedList.length} campaigns sent` : 'Recent emails sent from admin'}
          </p>
        </div>
        {open ? <ChevronUp size={18} className="text-outline dark:text-slate-500" /> : <ChevronDown size={18} className="text-outline dark:text-slate-500" />}
      </button>

      {open && (
        <div className="border-t border-outline-variant/20 dark:border-white/5">
          {loading ? (
            <div className="p-5 space-y-3">{[1,2,3].map(i => <SkeletonLine key={i} height="h-10" />)}</div>
          ) : groupedList.length === 0 ? (
            <div className="py-10 text-center">
              <FileText size={28} className="text-outline dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-outline dark:text-slate-500">No emails sent yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/15 dark:divide-white/5">
              {groupedList.map((log, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-surface-container-low dark:hover:bg-white/2 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    log.failed > 0 ? 'bg-amber-100 dark:bg-amber-900/20' : 'bg-tertiary/10 dark:bg-tertiary/20'
                  }`}>
                    {log.failed > 0
                      ? <AlertCircle size={15} className="text-amber-600 dark:text-amber-400" />
                      : <CheckCircle size={15} className="text-tertiary" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface dark:text-white truncate">{log.subject}</p>
                    <p className="text-xs text-outline dark:text-slate-500">
                      {log.sent} delivered{log.failed > 0 ? ` · ${log.failed} failed` : ''}
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
  usePageTitle('Email Blast');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <DashboardLayout isAdmin>
      <div className="p-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <h1 className="text-xl font-bold text-on-surface dark:text-white">Send Emails</h1>
            <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-0.5">
              Compose and preview branded emails before sending to users
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
