import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Send, RefreshCw, ExternalLink, Download,
  FileText, Link2, BookOpen, ChevronDown, ChevronUp,
  CheckCircle, File, X
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import { SkeletonCard, SkeletonLine } from '../../components/ui/Skeleton';
import progressService from '../../services/progressService';
import taskService from '../../services/taskService';
import submissionService from '../../services/submissionService';
import cheatsheetService from '../../services/cheatsheetService';

const TYPE_COLOR = { project: 'blue', task: 'gray', submission: 'purple' };
const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');

// ─── Resource icon + label ────────────────────────────────────────────────────
function ResourceItem({ resource }) {
  const isFile = resource.type === 'file' || resource.filePath;
  const fileUrl = resource.filePath ? `${API_BASE}${resource.filePath}` : resource.url;

  const ext = resource.mimeType
    ? (resource.mimeType === 'application/pdf' ? 'PDF'
      : resource.mimeType.includes('word') ? 'DOCX'
      : resource.mimeType.includes('excel') || resource.mimeType.includes('spreadsheet') ? 'XLSX'
      : resource.mimeType.includes('powerpoint') || resource.mimeType.includes('presentation') ? 'PPTX'
      : resource.mimeType.startsWith('image') ? 'IMG'
      : 'FILE')
    : null;

  const sizeLabel = resource.fileSize
    ? resource.fileSize > 1024 * 1024
      ? `${(resource.fileSize / 1024 / 1024).toFixed(1)} MB`
      : `${Math.round(resource.fileSize / 1024)} KB`
    : null;

  if (isFile) {
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant/30 dark:border-white/5 bg-surface-container-low dark:bg-slate-900/50 hover:border-primary/30 hover:bg-primary/4 dark:hover:bg-primary/8 transition-all group"
      >
        <div className="w-9 h-9 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15">
          <FileText size={17} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-on-surface dark:text-white truncate">{resource.title}</p>
          <p className="text-xs text-outline dark:text-slate-500 flex items-center gap-1.5 mt-0.5">
            {ext && <span className="font-semibold text-primary/70">{ext}</span>}
            {sizeLabel && <span>{sizeLabel}</span>}
          </p>
        </div>
        <Download size={16} className="text-outline dark:text-slate-500 group-hover:text-primary flex-shrink-0 transition-colors" />
      </a>
    );
  }

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant/30 dark:border-white/5 bg-surface-container-low dark:bg-slate-900/50 hover:border-primary/30 hover:bg-primary/4 dark:hover:bg-primary/8 transition-all group"
    >
      <div className="w-9 h-9 rounded-lg bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center flex-shrink-0">
        <Link2 size={17} className="text-secondary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-on-surface dark:text-white truncate">{resource.title}</p>
        <p className="text-xs text-outline dark:text-slate-500 truncate mt-0.5">{resource.url}</p>
      </div>
      <ExternalLink size={16} className="text-outline dark:text-slate-500 group-hover:text-primary flex-shrink-0 transition-colors" />
    </a>
  );
}

// ─── Cheat Sheet item ─────────────────────────────────────────────────────────
function CheatSheetItem({ sheet }) {
  const isFile = sheet.type === 'file';
  const fileUrl = sheet.filePath ? `${API_BASE}${sheet.filePath}` : sheet.url;

  const ext = sheet.mimeType
    ? (sheet.mimeType === 'application/pdf' ? 'PDF'
      : sheet.mimeType.includes('word') ? 'DOCX'
      : sheet.mimeType.includes('excel') || sheet.mimeType.includes('spreadsheet') ? 'XLSX'
      : 'FILE')
    : null;

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      download={isFile}
      className="flex items-center gap-3 p-3 rounded-lg border border-amber-200/60 dark:border-amber-700/30 bg-amber-50/60 dark:bg-amber-900/10 hover:bg-amber-100/80 dark:hover:bg-amber-900/20 transition-all group"
    >
      <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
        <File size={17} className="text-amber-600 dark:text-amber-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-on-surface dark:text-white truncate">{sheet.title}</p>
        <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-0.5">
          {isFile ? (ext || 'File') : 'External Link'} · Cheat Sheet
        </p>
      </div>
      {isFile
        ? <Download size={16} className="text-amber-500 dark:text-amber-400 flex-shrink-0" />
        : <ExternalLink size={16} className="text-amber-500 dark:text-amber-400 flex-shrink-0" />
      }
    </a>
  );
}

// ─── Cheat Sheet Panel ────────────────────────────────────────────────────────
function CheatSheetPanel({ levelId }) {
  const [sheets, setSheets] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await cheatsheetService.getByLevel(levelId);
      setSheets(res.data || []);
    } catch {
      setSheets([]);
    } finally {
      setLoading(false);
    }
  }, [levelId]);

  const handleToggle = () => {
    if (!open && sheets === null) load();
    setOpen(p => !p);
  };

  return (
    <div className="rounded-xl border border-amber-200/60 dark:border-amber-700/30 overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 bg-amber-50/80 dark:bg-amber-900/10 hover:bg-amber-100/80 dark:hover:bg-amber-900/20 transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
          <BookOpen size={16} className="text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Level Cheat Sheets</p>
          <p className="text-xs text-amber-600/70 dark:text-amber-400/60">Quick reference materials for this level</p>
        </div>
        {loading
          ? <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-500 rounded-full animate-spin" />
          : open ? <ChevronUp size={16} className="text-amber-500" /> : <ChevronDown size={16} className="text-amber-500" />
        }
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-2 bg-white dark:bg-slate-800 border-t border-amber-200/40 dark:border-amber-700/20">
              {!sheets || sheets.length === 0 ? (
                <p className="text-sm text-outline dark:text-slate-500 text-center py-2">
                  No cheat sheets for this level yet.
                </p>
              ) : (
                sheets.map(sheet => <CheatSheetItem key={sheet.id} sheet={sheet} />)
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Task Modal ───────────────────────────────────────────────────────────────
function TaskModal({ task, onClose, onTaskComplete }) {
  const [githubUrl, setGithubUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const links = (task.resources || []).filter(r => r.type === 'link' || (!r.filePath && r.url));
  const files = (task.resources || []).filter(r => r.type === 'file' || r.filePath);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await submissionService.createSubmission({ taskId: task.id, githubUrl, notes });
      setSuccess('Submitted! Awaiting review.');
      setTimeout(() => { onClose(); onTaskComplete(); }, 1400);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await taskService.completeTask(task.id);
      setSuccess('Task marked complete!');
      setTimeout(() => { onClose(); onTaskComplete(); }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete task.');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="relative w-full max-w-xl bg-white dark:bg-slate-800 rounded-xl shadow-glass border border-outline-variant/30 dark:border-white/5 overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-6 pt-5 pb-4 border-b border-outline-variant/20 dark:border-white/5 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <Badge color={TYPE_COLOR[task.type]}>{task.type}</Badge>
              {task.isCompleted && (
                <div className="flex items-center gap-1 text-xs text-tertiary font-medium">
                  <CheckCircle size={13} /> Completed
                </div>
              )}
            </div>
            <h2 className="font-bold text-on-surface dark:text-white text-base leading-snug">{task.title}</h2>
          </div>
          <button onClick={onClose} className="text-outline dark:text-slate-400 hover:text-on-surface dark:hover:text-white p-1 flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Description */}
          <p className="text-sm text-on-surface-variant dark:text-slate-300 leading-relaxed">{task.description}</p>

          {/* ── Resources: Files ─────────────────────────────────────────── */}
          {files.length > 0 && (
            <div>
              <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-2.5 flex items-center gap-1.5">
                <FileText size={11} /> FILES & DOCUMENTS
              </p>
              <div className="space-y-2">
                {files.map(r => <ResourceItem key={r.id} resource={r} />)}
              </div>
            </div>
          )}

          {/* ── Resources: Links ─────────────────────────────────────────── */}
          {links.length > 0 && (
            <div>
              <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-2.5 flex items-center gap-1.5">
                <Link2 size={11} /> LINKS & REFERENCES
              </p>
              <div className="space-y-2">
                {links.map(r => <ResourceItem key={r.id} resource={r} />)}
              </div>
            </div>
          )}

          {/* ── Status / Actions ─────────────────────────────────────────── */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg px-3 py-2 text-sm text-error">{error}</div>
          )}
          {success && (
            <div className="bg-tertiary/10 border border-tertiary/20 rounded-lg px-3 py-2 text-sm text-tertiary flex items-center gap-2">
              <CheckCircle size={14} /> {success}
            </div>
          )}

          {/* Submission form */}
          {task.type === 'submission' && !task.isCompleted && !success && (
            <div className="border-t border-outline-variant/20 dark:border-white/5 pt-4">
              <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-3">SUBMIT YOUR WORK</p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="url"
                  placeholder="GitHub / project URL"
                  value={githubUrl}
                  onChange={e => setGithubUrl(e.target.value)}
                  className="input-field w-full"
                  required
                />
                <textarea
                  placeholder="Notes for the reviewer (optional)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  className="input-field w-full resize-none"
                />
                <Button type="submit" variant="primary" size="sm" icon={Send} loading={submitting} className="w-full">
                  {submitting ? 'Submitting...' : 'Submit for Review'}
                </Button>
              </form>
            </div>
          )}

          {/* Mark complete button (non-submission tasks) */}
          {task.type !== 'submission' && !task.isCompleted && !success && (
            <Button variant="primary" size="sm" loading={completing} onClick={handleComplete} className="w-full">
              <CheckCircle size={15} /> Mark as Complete
            </Button>
          )}

          {task.isCompleted && !success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-tertiary/8 dark:bg-tertiary/15">
              <CheckCircle size={16} className="text-tertiary" />
              <span className="text-sm font-medium text-tertiary">Completed ✓</span>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-outline-variant/20 dark:border-white/5 flex justify-end flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TasksPage() {
  const [progress, setProgress] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const progRes = await progressService.getMyProgress();
      const prog = progRes.data;
      setProgress(prog);
      const currentLevel = prog?.levels?.find(l => l.isCurrent);
      if (currentLevel) {
        const tasksRes = await taskService.getTasksByLevel(currentLevel.id);
        setTasks(tasksRes.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const currentLevel = progress?.levels?.find(l => l.isCurrent);
  const done = tasks.filter(t => t.isCompleted).length;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-2">CURRENT LEVEL</p>

          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-4 text-sm text-error flex items-center gap-2">
              {error}
              <Button variant="ghost" size="sm" icon={RefreshCw} onClick={loadData}>Retry</Button>
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              <SkeletonLine height="h-7" width="w-64" className="mb-2" />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : !currentLevel ? (
            <Card className="p-10 text-center">
              <p className="text-on-surface dark:text-white font-medium">No active level found.</p>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-1">Contact your admin.</p>
            </Card>
          ) : (
            <>
              <h1 className="text-xl font-bold text-on-surface dark:text-white mb-1">{currentLevel.title}</h1>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-5">{currentLevel.description}</p>

              {/* Progress bar */}
              <Card className="p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-on-surface dark:text-white">
                    {done} of {tasks.length} tasks completed
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {tasks.length ? Math.round((done / tasks.length) * 100) : 0}%
                  </span>
                </div>
                <ProgressBar value={done} max={tasks.length || 1} size="lg" />
              </Card>

              {/* ── Cheat Sheet Panel ───────────────────────────────────── */}
              <div className="mb-4">
                <CheatSheetPanel levelId={currentLevel.id} />
              </div>

              {/* ── Task list ────────────────────────────────────────────── */}
              <div className="space-y-2">
                {tasks.map((task, i) => {
                  const isNext = !task.isCompleted && tasks.findIndex(t => !t.isCompleted) === i;
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <button
                        className={`w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-all duration-150
                          ${isNext
                            ? 'border-primary/25 bg-primary/4 dark:bg-primary/8 hover:border-primary/40'
                            : task.isCompleted
                            ? 'border-outline-variant/20 dark:border-white/5 bg-surface-container-low dark:bg-slate-900/30'
                            : 'border-outline-variant/40 dark:border-white/5 bg-white dark:bg-slate-800 hover:bg-surface-container dark:hover:bg-white/5'
                          }`}
                        onClick={() => setSelectedTask(task)}
                      >
                        {/* Check circle */}
                        <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
                          ${task.isCompleted ? 'bg-primary border-primary' : isNext ? 'border-primary' : 'border-outline-variant dark:border-white/20'}`}>
                          {task.isCompleted
                            ? <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-white" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            : isNext ? <div className="w-2 h-2 rounded-full bg-primary" />
                            : null
                          }
                        </div>

                        {/* Title */}
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm font-medium block truncate ${
                            task.isCompleted ? 'line-through text-outline dark:text-slate-500' : 'text-on-surface dark:text-white'
                          }`}>
                            {task.title}
                          </span>
                          {/* Resource count hint */}
                          {task.resources?.length > 0 && (
                            <span className="text-xs text-outline dark:text-slate-500 flex items-center gap-1 mt-0.5">
                              <FileText size={10} />
                              {task.resources.length} resource{task.resources.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        {/* Badges + arrow */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge color={TYPE_COLOR[task.type]}>{task.type}</Badge>
                          {isNext && <Badge color="blue">Up Next</Badge>}
                          <ChevronRight size={15} className="text-outline dark:text-slate-600" />
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {selectedTask && (
          <TaskModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onTaskComplete={loadData}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
