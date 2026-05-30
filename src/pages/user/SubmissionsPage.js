import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, CheckCircle, XCircle, AlertCircle, Copy, Check } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/ui/Skeleton';
import submissionService from '../../services/submissionService';
import usePageTitle from '../../hooks/usePageTitle';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy URL'}
      className="p-1 rounded text-outline dark:text-slate-500 hover:text-primary transition-colors flex-shrink-0"
    >
      {copied ? <Check size={13} className="text-tertiary" /> : <Copy size={13} />}
    </button>
  );
}

const STATUS = {
  approved: { icon: CheckCircle, color: 'green', label: 'Approved' },
  pending: { icon: Clock, color: 'yellow', label: 'Under Review' },
  rejected: { icon: XCircle, color: 'red', label: 'Rejected' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export default function SubmissionsPage() {
  usePageTitle('My Submissions');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    submissionService.listSubmissions({ limit: 50 })
      .then(res => setSubmissions(res.data?.submissions || []))
      .catch(err => setError(err.response?.data?.message || 'Failed to load submissions.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <h1 className="text-xl font-bold text-on-surface dark:text-white">My Submissions</h1>
            <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-0.5">Track your project submissions and review status.</p>
          </div>

          {error && <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-4 text-sm text-error">{error}</div>}

          {loading ? (
            <div className="space-y-4">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>
          ) : submissions.length === 0 ? (
            <Card className="p-10 text-center">
              <AlertCircle size={36} className="text-outline mx-auto mb-3" />
              <p className="text-on-surface dark:text-white font-medium">No submissions yet</p>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-1">Complete tasks and submit your projects.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub, i) => {
                const s = STATUS[sub.status] || STATUS.pending;
                return (
                  <motion.div key={sub.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                    <Card className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-sm font-semibold text-on-surface dark:text-white flex-1">{sub.task?.title}</h3>
                        <Badge color={s.color}><s.icon size={11} />{s.label}</Badge>
                      </div>
                      {sub.githubUrl && (
                        <div className="flex items-center gap-1.5 mb-3">
                          <a href={sub.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-primary hover:underline flex-1 min-w-0">
                            <ExternalLink size={12} className="flex-shrink-0" />
                            <span className="truncate">{sub.githubUrl.replace('https://', '')}</span>
                          </a>
                          <CopyButton text={sub.githubUrl} />
                        </div>
                      )}
                      {sub.notes && <p className="text-xs text-on-surface-variant dark:text-slate-400 bg-surface-container dark:bg-white/5 rounded px-3 py-2 mb-3">{sub.notes}</p>}
                      {sub.feedback && (
                        <div className={`rounded-lg px-3 py-2 mb-3 ${sub.status === 'approved' ? 'bg-tertiary/5 dark:bg-tertiary/10 border border-tertiary/20' : 'bg-error/5 dark:bg-error/10 border border-error/20'}`}>
                          <p className="text-label-caps text-on-surface dark:text-white font-geist mb-1">INSTRUCTOR FEEDBACK</p>
                          <p className="text-xs text-on-surface-variant dark:text-slate-300">{sub.feedback}</p>
                        </div>
                      )}
                      <p className="text-xs text-outline dark:text-slate-500">Submitted {timeAgo(sub.submittedAt)}</p>
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
