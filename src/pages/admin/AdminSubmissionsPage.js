import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle, XCircle, Clock, AlertCircle, Search } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { SkeletonCard } from '../../components/ui/Skeleton';
import submissionService from '../../services/submissionService';

const STATUS = {
  approved: { icon: CheckCircle, color: 'green', label: 'Approved' },
  pending:  { icon: Clock,        color: 'yellow', label: 'Pending' },
  rejected: { icon: XCircle,      color: 'red',    label: 'Rejected' },
};

function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`;
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');
  const [reviewing, setReviewing] = useState(null);
  const [feedbacks, setFeedbacks] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (filter !== 'all') params.status = filter;
      const res = await submissionService.listSubmissions(params);
      setSubmissions(res.data?.submissions || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const filtered = submissions.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.task?.title?.toLowerCase().includes(q) ||
      s.user?.name?.toLowerCase().includes(q) ||
      s.user?.email?.toLowerCase().includes(q)
    );
  });

  const handleReview = async (id, status) => {
    setReviewing(id + status);
    try {
      await submissionService.reviewSubmission(id, status, feedbacks[id] || '');
      setSubmissions(prev => prev.map(s => s.id === id
        ? { ...s, status, feedback: feedbacks[id] || '', reviewedAt: new Date().toISOString() }
        : s));
    } catch (err) {
      alert(err.response?.data?.message || 'Review failed.');
    } finally {
      setReviewing(null);
    }
  };

  return (
    <DashboardLayout isAdmin>
      <div className="p-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <h1 className="text-xl font-bold text-on-surface dark:text-white">Submissions</h1>
            <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-0.5">Review student project submissions</p>
          </div>

          {/* Filters + Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-500" />
              <input type="text" placeholder="Search by task, name or email..." value={search}
                onChange={e => setSearch(e.target.value)} className="input-field pl-9 w-full" />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded text-sm font-medium capitalize transition-colors ${
                    filter === f ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-outline-variant/40 dark:border-white/5 text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-white/5'
                  }`}>{f}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-4 text-sm text-error">{error}</div>}

          {loading ? (
            <div className="space-y-4">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>
          ) : filtered.length === 0 ? (
            <Card className="p-10 text-center">
              <AlertCircle size={36} className="text-outline mx-auto mb-3" />
              <p className="text-sm text-on-surface-variant dark:text-slate-400">No submissions found.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filtered.map((sub, i) => {
                const s = STATUS[sub.status] || STATUS.pending;
                return (
                  <motion.div key={sub.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="text-sm font-semibold text-on-surface dark:text-white">{sub.task?.title}</h3>
                          <p className="text-xs text-outline dark:text-slate-500 mt-0.5">
                            By <span className="font-medium text-on-surface-variant dark:text-slate-300">{sub.user?.name}</span>
                            {' · '}{sub.user?.email}{' · '}{timeAgo(sub.submittedAt)}
                          </p>
                        </div>
                        <Badge color={s.color}><s.icon size={11} />{s.label}</Badge>
                      </div>

                      {sub.githubUrl && (
                        <a href={sub.githubUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-primary hover:underline mb-3">
                          <ExternalLink size={12} />{sub.githubUrl.replace('https://', '')}
                        </a>
                      )}
                      {sub.notes && (
                        <p className="text-xs text-on-surface-variant dark:text-slate-400 bg-surface-container dark:bg-white/5 rounded px-3 py-2 mb-3">{sub.notes}</p>
                      )}
                      {sub.feedback && (
                        <div className={`rounded-lg px-3 py-2 mb-3 ${sub.status === 'approved' ? 'bg-tertiary/5 border border-tertiary/20' : 'bg-error/5 border border-error/20'}`}>
                          <p className="text-xs font-semibold mb-0.5 text-on-surface dark:text-white">Feedback</p>
                          <p className="text-xs text-on-surface-variant dark:text-slate-300">{sub.feedback}</p>
                        </div>
                      )}

                      {sub.status === 'pending' && (
                        <div className="space-y-2 border-t border-outline-variant/30 dark:border-white/5 pt-3 mt-1">
                          <textarea
                            placeholder="Feedback for the student (optional)..."
                            rows={2}
                            value={feedbacks[sub.id] || ''}
                            onChange={e => setFeedbacks(p => ({ ...p, [sub.id]: e.target.value }))}
                            className="input-field resize-none text-xs w-full"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button variant="secondary" size="sm"
                              loading={reviewing === sub.id + 'rejected'}
                              onClick={() => handleReview(sub.id, 'rejected')}>
                              <XCircle size={14} /> Reject
                            </Button>
                            <Button variant="primary" size="sm"
                              loading={reviewing === sub.id + 'approved'}
                              onClick={() => handleReview(sub.id, 'approved')}>
                              <CheckCircle size={14} /> Approve
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
