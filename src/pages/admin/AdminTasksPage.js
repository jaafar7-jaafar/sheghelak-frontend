import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Plus, ChevronDown, ChevronUp, CheckSquare,
  X, Check, Layers, Link2, FileText, Upload, Trash2,
  File, ExternalLink, Download, BookMarked, AlertCircle,
  Search, Pencil, Lock, Unlock, Save
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { SkeletonCard } from '../../components/ui/Skeleton';
import pathService from '../../services/pathService';
import taskService from '../../services/taskService';
import cheatsheetService from '../../services/cheatsheetService';

const TYPE_COLOR = { task: 'gray', project: 'blue', submission: 'purple' };
const API_BASE   = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');
const ALLOWED    = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.jpg,.jpeg,.png,.webp,.gif,.zip';

const sizeLabel = (b) => b > 1048576 ? `${(b/1048576).toFixed(1)} MB` : `${Math.round(b/1024)} KB`;

// ─── Resource row ─────────────────────────────────────────────────────────────
function ResourceRow({ resource, onDelete }) {
  const isFile = resource.type === 'file' || resource.filePath;
  const href   = resource.filePath ? `${API_BASE}${resource.filePath}` : resource.url;
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-container dark:bg-white/5 border border-outline-variant/20 dark:border-white/5">
      <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${isFile ? 'bg-primary/10 dark:bg-primary/20' : 'bg-secondary/10 dark:bg-secondary/20'}`}>
        {isFile ? <FileText size={14} className="text-primary" /> : <Link2 size={14} className="text-secondary" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-on-surface dark:text-white truncate">{resource.title}</p>
        {isFile && resource.fileSize && <p className="text-xs text-outline dark:text-slate-500">{sizeLabel(resource.fileSize)}</p>}
        {!isFile && resource.url && <p className="text-xs text-outline dark:text-slate-500 truncate">{resource.url}</p>}
      </div>
      <a href={href} target="_blank" rel="noopener noreferrer" download={isFile}
        className="text-outline dark:text-slate-500 hover:text-primary p-0.5 transition-colors">
        {isFile ? <Download size={14} /> : <ExternalLink size={14} />}
      </a>
      <button onClick={() => onDelete(resource.id)} className="text-outline dark:text-slate-500 hover:text-error p-0.5 transition-colors">
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ─── Add Resource Panel ───────────────────────────────────────────────────────
function AddResourcePanel({ taskId, onAdded }) {
  const [mode, setMode] = useState('link');
  const [title, setTitle] = useState('');
  const [url, setUrl]   = useState('');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');
  const fileRef = useRef(null);

  const reset = () => { setTitle(''); setUrl(''); setFile(null); setError(''); if (fileRef.current) fileRef.current.value = ''; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title required.'); return; }
    if (mode === 'link' && !url.trim()) { setError('URL required.'); return; }
    if (mode === 'file' && !file)       { setError('Choose a file.'); return; }
    setSaving(true); setError('');
    try {
      if (mode === 'link') await taskService.addResource(taskId, { title: title.trim(), type: 'link', url: url.trim() });
      else await taskService.uploadResourceFile(taskId, file, title.trim());
      reset(); onAdded();
    } catch (err) { setError(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="mt-3 p-3 rounded-lg border border-outline-variant/30 dark:border-white/5 bg-surface-container-low dark:bg-slate-900/50">
      <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-3">ADD RESOURCE</p>
      <div className="flex gap-1.5 mb-3 p-1 bg-surface-container dark:bg-white/5 rounded-lg">
        {[['link','Link / URL',Link2],['file','Upload File',Upload]].map(([val,label,Icon]) => (
          <button key={val} type="button" onClick={() => { setMode(val); reset(); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium transition-all ${mode === val ? 'bg-white dark:bg-slate-700 text-on-surface dark:text-white shadow-card' : 'text-outline dark:text-slate-400'}`}>
            <Icon size={12} />{label}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-error mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input className="input-field w-full text-sm" placeholder="Display title *" value={title} onChange={e => setTitle(e.target.value)} />
        {mode === 'link'
          ? <input type="url" className="input-field w-full text-sm" placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} />
          : <div>
              <input ref={fileRef} type="file" accept={ALLOWED} className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
              <button type="button" onClick={() => fileRef.current?.click()}
                className="w-full flex items-center gap-2 px-3 py-2 rounded border border-dashed border-outline-variant/50 dark:border-white/15 text-sm text-on-surface-variant dark:text-slate-400 hover:border-primary/40 hover:text-primary transition-colors">
                <Upload size={15} />
                {file ? <span className="truncate text-primary font-medium">{file.name} ({sizeLabel(file.size)})</span> : <span>Choose file (PDF, DOCX, image…)</span>}
              </button>
            </div>
        }
        <Button type="submit" variant="primary" size="sm" loading={saving} icon={Check}>
          {saving ? 'Adding...' : 'Add Resource'}
        </Button>
      </form>
    </div>
  );
}

// ─── Edit Task Modal ──────────────────────────────────────────────────────────
function EditTaskModal({ task, onClose, onSaved }) {
  const [form, setForm] = useState({ title: task.title, description: task.description, type: task.type });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) { setError('Title and description required.'); return; }
    setSaving(true); setError('');
    try {
      await taskService.updateTask(task.id, { title: form.title.trim(), description: form.description.trim(), type: form.type });
      onSaved(); onClose();
    } catch (err) { setError(err.response?.data?.message || 'Failed to update task.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl shadow-glass border border-outline-variant/30 dark:border-white/5 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 dark:border-white/5">
          <h2 className="font-bold text-on-surface dark:text-white">Edit Task</h2>
          <button onClick={onClose} className="text-outline dark:text-slate-400 hover:text-on-surface dark:hover:text-white p-1"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-3">
          {error && <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-sm text-error">{error}</div>}
          <form id="edit-task-form" onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-medium text-on-surface dark:text-slate-200 block mb-1">Title *</label>
              <input className="input-field w-full" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface dark:text-slate-200 block mb-1">Description *</label>
              <textarea className="input-field w-full resize-none" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required />
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface dark:text-slate-200 block mb-2">Type</label>
              <div className="flex gap-2">
                {[['task','Task'],['project','Project'],['submission','Submission']].map(([val, label]) => (
                  <button key={val} type="button" onClick={() => setForm(p => ({ ...p, type: val }))}
                    className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${form.type === val ? 'border-primary/30 bg-primary/5 dark:bg-primary/10 text-primary' : 'border-outline-variant/30 dark:border-white/5 text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-white/5'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/20 dark:border-white/5">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="edit-task-form" variant="primary" size="sm" loading={saving} icon={Save}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Cheat Sheet Admin Panel ──────────────────────────────────────────────────
function AdminCheatSheetPanel({ levelId }) {
  const [sheets, setSheets]   = useState(null);
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addMode, setAddMode] = useState('url');
  const [addTitle, setAddTitle] = useState('');
  const [addUrl, setAddUrl]   = useState('');
  const [addFile, setAddFile] = useState(null);
  const [saving, setSaving]   = useState(false);
  const [addError, setAddError] = useState('');
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await cheatsheetService.getByLevel(levelId); setSheets(res.data || []); }
    catch { setSheets([]); } finally { setLoading(false); }
  }, [levelId]);

  const handleToggle = () => { if (!open && sheets === null) load(); setOpen(p => !p); };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!addTitle.trim()) { setAddError('Title required.'); return; }
    if (addMode === 'url' && !addUrl.trim()) { setAddError('URL required.'); return; }
    if (addMode === 'file' && !addFile) { setAddError('Choose a file.'); return; }
    setSaving(true); setAddError('');
    try {
      if (addMode === 'url') await cheatsheetService.createUrl(levelId, addTitle.trim(), addUrl.trim());
      else await cheatsheetService.uploadFile(levelId, addFile, addTitle.trim());
      setAddTitle(''); setAddUrl(''); setAddFile(null); setShowAdd(false);
      if (fileRef.current) fileRef.current.value = '';
      load();
    } catch (err) { setAddError(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await cheatsheetService.delete(id); setSheets(p => p.filter(s => s.id !== id)); }
    catch { /* silent */ }
  };

  return (
    <div className="rounded-lg border border-amber-200/60 dark:border-amber-700/30 overflow-hidden">
      <button onClick={handleToggle}
        className="w-full flex items-center gap-3 px-4 py-3 bg-amber-50/80 dark:bg-amber-900/10 hover:bg-amber-100/80 dark:hover:bg-amber-900/20 transition-colors text-left">
        <BookMarked size={15} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Cheat Sheets</p>
          <p className="text-xs text-amber-600/60 dark:text-amber-400/50">{sheets ? `${sheets.length} sheet${sheets.length !== 1 ? 's' : ''}` : 'Level reference materials'}</p>
        </div>
        {loading ? <div className="w-4 h-4 border-2 border-amber-300/40 border-t-amber-500 rounded-full animate-spin" />
          : open ? <ChevronUp size={15} className="text-amber-500" /> : <ChevronDown size={15} className="text-amber-500" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="p-4 space-y-2 bg-white dark:bg-slate-800 border-t border-amber-200/30 dark:border-amber-700/20">
              {sheets?.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-amber-200/50 dark:border-amber-700/20 bg-amber-50/50 dark:bg-amber-900/10">
                  <File size={14} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface dark:text-white truncate">{s.title}</p>
                    <p className="text-xs text-outline dark:text-slate-500">{s.type === 'file' ? 'File' : 'Link'}</p>
                  </div>
                  <a href={s.filePath ? `${API_BASE}${s.filePath}` : s.url} target="_blank" rel="noopener noreferrer" download={s.type === 'file'}
                    className="text-amber-500 hover:text-amber-600 p-0.5">
                    {s.type === 'file' ? <Download size={14} /> : <ExternalLink size={14} />}
                  </a>
                  <button onClick={() => handleDelete(s.id)} className="text-outline dark:text-slate-500 hover:text-error p-0.5"><Trash2 size={14} /></button>
                </div>
              ))}
              {sheets?.length === 0 && !showAdd && <p className="text-xs text-outline dark:text-slate-500 text-center py-2">No cheat sheets yet.</p>}
              {showAdd ? (
                <form onSubmit={handleAdd} className="space-y-2 pt-2 border-t border-amber-200/30 dark:border-amber-700/20">
                  <div className="flex gap-1.5 p-1 bg-surface-container dark:bg-white/5 rounded-lg">
                    {[['url','URL Link',Link2],['file','Upload File',Upload]].map(([val,label,Icon]) => (
                      <button key={val} type="button" onClick={() => setAddMode(val)}
                        className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs font-medium transition-all ${addMode === val ? 'bg-white dark:bg-slate-700 text-on-surface dark:text-white shadow-card' : 'text-outline dark:text-slate-400'}`}>
                        <Icon size={11} />{label}
                      </button>
                    ))}
                  </div>
                  {addError && <p className="text-xs text-error">{addError}</p>}
                  <input className="input-field w-full text-sm" placeholder="Title *" value={addTitle} onChange={e => setAddTitle(e.target.value)} />
                  {addMode === 'url'
                    ? <input type="url" className="input-field w-full text-sm" placeholder="https://..." value={addUrl} onChange={e => setAddUrl(e.target.value)} />
                    : <div>
                        <input ref={fileRef} type="file" accept={ALLOWED} className="hidden" onChange={e => setAddFile(e.target.files?.[0] || null)} />
                        <button type="button" onClick={() => fileRef.current?.click()}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded border border-dashed border-amber-300/60 dark:border-amber-700/30 text-sm text-amber-600/70 hover:border-amber-400 transition-colors">
                          <Upload size={13} />
                          {addFile ? <span className="truncate font-medium text-amber-700 dark:text-amber-400">{addFile.name}</span> : <span>Choose file</span>}
                        </button>
                      </div>
                  }
                  <div className="flex gap-2">
                    <Button type="submit" variant="primary" size="sm" loading={saving} icon={Check}>{saving ? 'Saving...' : 'Save'}</Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => { setShowAdd(false); setAddError(''); }}>Cancel</Button>
                  </div>
                </form>
              ) : (
                <button onClick={() => setShowAdd(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded border border-dashed border-amber-300/50 dark:border-amber-700/30 text-xs text-amber-600/80 dark:text-amber-400/70 hover:border-amber-400 hover:text-amber-600 transition-colors">
                  <Plus size={13} /> Add Cheat Sheet
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Task Row ─────────────────────────────────────────────────────────────────
function TaskRow({ task, onTaskUpdate, onDelete }) {
  const [open, setOpen]           = useState(false);
  const [resources, setResources] = useState(task.resources || []);
  const [showAddResource, setShowAddResource] = useState(false);
  const [showEdit, setShowEdit]   = useState(false);
  const [deleting, setDeleting]   = useState(false);

  const handleDeleteResource = async (resourceId) => {
    try { await taskService.deleteResource(resourceId); setResources(p => p.filter(r => r.id !== resourceId)); }
    catch (err) { alert(err.response?.data?.message || 'Failed.'); }
  };

  const handleResourceAdded = async () => {
    try {
      const res = await taskService.getTasksByLevel(task.levelId);
      const updated = (res.data || []).find(t => t.id === task.id);
      if (updated) setResources(updated.resources || []);
    } catch { /* silent */ }
    setShowAddResource(false);
    onTaskUpdate?.();
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    setDeleting(true);
    try { await taskService.deleteTask(task.id); onDelete(task.id); }
    catch (err) { alert(err.response?.data?.message || 'Failed to delete.'); setDeleting(false); }
  };

  return (
    <>
      <div className="rounded-lg border border-outline-variant/20 dark:border-white/5 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => setOpen(p => !p)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
            <div className={`w-6 h-6 rounded flex-shrink-0 flex items-center justify-center text-xs font-bold ${
              { task: 'bg-surface-container-high dark:bg-white/10 text-outline', project: 'bg-primary/10 dark:bg-primary/20 text-primary', submission: 'bg-secondary/10 dark:bg-secondary/20 text-secondary' }[task.type]
            }`}>{task.order}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface dark:text-white truncate">{task.title}</p>
              <p className="text-xs text-outline dark:text-slate-500">{resources.length} resource{resources.length !== 1 ? 's' : ''}</p>
            </div>
            <Badge color={TYPE_COLOR[task.type]}>{task.type}</Badge>
            <div className="text-outline dark:text-slate-500 ml-1">{open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</div>
          </button>
          {/* Edit + Delete buttons */}
          <button onClick={() => setShowEdit(true)} className="text-outline dark:text-slate-500 hover:text-primary p-1 transition-colors" title="Edit task"><Pencil size={14} /></button>
          <button onClick={handleDelete} disabled={deleting} className={`text-outline dark:text-slate-500 hover:text-error p-1 transition-colors ${deleting ? 'opacity-50' : ''}`} title="Delete task">
            {deleting ? <div className="w-3.5 h-3.5 border-2 border-error/30 border-t-error rounded-full animate-spin" /> : <Trash2 size={14} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="px-4 pb-4 border-t border-outline-variant/15 dark:border-white/5 pt-3 space-y-2">
                <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-relaxed">{task.description}</p>
                {resources.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-label-caps text-outline dark:text-slate-500 font-geist">RESOURCES</p>
                    {resources.map(r => <ResourceRow key={r.id} resource={r} onDelete={handleDeleteResource} />)}
                  </div>
                )}
                {showAddResource
                  ? <AddResourcePanel taskId={task.id} onAdded={handleResourceAdded} />
                  : <button onClick={() => setShowAddResource(true)}
                      className="w-full flex items-center gap-2 justify-center py-2 rounded border border-dashed border-outline-variant/40 dark:border-white/10 text-xs text-outline dark:text-slate-500 hover:border-primary/40 hover:text-primary transition-colors mt-2">
                      <Plus size={13} /> Add Resource
                    </button>
                }
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showEdit && <EditTaskModal task={task} onClose={() => setShowEdit(false)} onSaved={onTaskUpdate} />}
      </AnimatePresence>
    </>
  );
}

// ─── Level Panel ──────────────────────────────────────────────────────────────
function LevelPanel({ level, pathUsers }) {
  const [open, setOpen]           = useState(false);
  const [tasks, setTasks]         = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showAddTask, setShowAddTask]   = useState(false);
  const [locking, setLocking]     = useState(false);
  const [lockState, setLockState] = useState(null); // null = unknown

  const loadTasks = useCallback(async () => {
    setLoadingTasks(true);
    try { const res = await taskService.getTasksByLevel(level.id); setTasks(res.data || []); }
    catch { setTasks([]); } finally { setLoadingTasks(false); }
  }, [level.id]);

  const handleToggle = () => { if (!open && tasks === null) loadTasks(); setOpen(p => !p); };

  const handleTaskAdded = () => loadTasks();
  const handleDeleteTask = (taskId) => setTasks(p => (p || []).filter(t => t.id !== taskId));

  const handleToggleLock = async (lock) => {
    const msg = lock
      ? `Lock level "${level.title}" for ALL users? (Removes completion progress)`
      : `Unlock level "${level.title}" for ALL assigned users?`;
    if (!window.confirm(msg)) return;
    setLocking(true);
    try {
      await pathService.toggleLevelLock(level.id, lock);
      setLockState(lock ? 'locked' : 'unlocked');
    } catch (err) { alert(err.response?.data?.message || 'Failed.'); }
    finally { setLocking(false); }
  };

  const stateLabel = lockState === 'locked' ? '🔒 Locked' : lockState === 'unlocked' ? '🔓 Unlocked' : null;

  return (
    <div className="rounded-lg border border-outline-variant/30 dark:border-white/5 overflow-hidden bg-white dark:bg-slate-800">
      <div className="flex items-center gap-3 px-5 py-4">
        <button onClick={handleToggle} className="flex items-center gap-3 flex-1 min-w-0 text-left hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-primary/8 dark:bg-primary/15 text-primary text-sm font-bold flex items-center justify-center flex-shrink-0">{level.order}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-on-surface dark:text-white text-sm truncate">{level.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-outline dark:text-slate-500">{level._count?.tasks ?? 0} tasks</p>
              {stateLabel && <span className="text-xs font-medium text-on-surface-variant dark:text-slate-400">{stateLabel}</span>}
            </div>
          </div>
          <div className="text-outline dark:text-slate-500">
            {loadingTasks ? <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> : open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>
        {/* Lock / Unlock buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => handleToggleLock(false)} disabled={locking}
            title="Force unlock for all users"
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-tertiary hover:bg-tertiary/10 transition-colors border border-tertiary/30 disabled:opacity-50">
            <Unlock size={12} /> Unlock
          </button>
          <button onClick={() => handleToggleLock(true)} disabled={locking}
            title="Force lock for all users"
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-error hover:bg-error/10 transition-colors border border-error/30 disabled:opacity-50">
            <Lock size={12} /> Lock
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-5 pb-5 border-t border-outline-variant/20 dark:border-white/5 pt-4 space-y-3">
              <AdminCheatSheetPanel levelId={level.id} />
              {tasks && tasks.length > 0 && (
                <div className="space-y-2">
                  <p className="text-label-caps text-outline dark:text-slate-500 font-geist">TASKS</p>
                  {tasks.map(task => (
                    <TaskRow key={task.id} task={task} onTaskUpdate={loadTasks} onDelete={handleDeleteTask} />
                  ))}
                </div>
              )}
              {tasks && tasks.length === 0 && <p className="text-xs text-outline dark:text-slate-500 text-center py-2">No tasks yet.</p>}
              <Button variant="secondary" size="sm" icon={Plus} onClick={() => setShowAddTask(true)} className="w-full">Add Task</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddTask && (
          <CreateTaskModal levelId={level.id} nextOrder={(tasks?.length || 0) + 1}
            onClose={() => setShowAddTask(false)} onCreated={handleTaskAdded} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Create Task Modal ────────────────────────────────────────────────────────
function CreateTaskModal({ levelId, nextOrder, onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', type: 'task' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) { setError('Title and description required.'); return; }
    setSaving(true); setError('');
    try {
      await taskService.createTask({ levelId, order: nextOrder, title: form.title.trim(), description: form.description.trim(), type: form.type });
      onCreated(); onClose();
    } catch (err) { setError(err.response?.data?.message || 'Failed to create task.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl shadow-glass border border-outline-variant/30 dark:border-white/5 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 dark:border-white/5">
          <div><h2 className="font-bold text-on-surface dark:text-white">Add Task</h2><p className="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">Task #{nextOrder}</p></div>
          <button onClick={onClose} className="text-outline dark:text-slate-400 hover:text-on-surface dark:hover:text-white p-1"><X size={18} /></button>
        </div>
        <div className="p-6">
          {error && <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-sm text-error mb-3 flex items-center gap-2"><AlertCircle size={14} />{error}</div>}
          <form id="task-form" onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-medium text-on-surface dark:text-slate-200 block mb-1">Title *</label>
              <input className="input-field w-full" placeholder="Task title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface dark:text-slate-200 block mb-1">Description *</label>
              <textarea className="input-field w-full resize-none" rows={3} placeholder="What should the learner do?" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required />
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface dark:text-slate-200 block mb-2">Type</label>
              <div className="flex gap-2">
                {[['task','Task','Mark complete'],['project','Project','Build something'],['submission','Submission','Submit for review']].map(([val, label, desc]) => (
                  <button key={val} type="button" onClick={() => setForm(p => ({ ...p, type: val }))}
                    className={`flex-1 px-3 py-2 rounded-lg border text-left transition-all ${form.type === val ? 'border-primary/30 bg-primary/5 dark:bg-primary/10' : 'border-outline-variant/30 dark:border-white/5 hover:bg-surface-container dark:hover:bg-white/5'}`}>
                    <p className="text-xs font-semibold text-on-surface dark:text-white">{label}</p>
                    <p className="text-xs text-outline dark:text-slate-500">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/20 dark:border-white/5">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="task-form" variant="primary" size="sm" loading={saving} icon={Check}>{saving ? 'Creating...' : 'Create Task'}</Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Path Panel ───────────────────────────────────────────────────────────────
function PathPanel({ path }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="overflow-hidden">
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-surface-container dark:hover:bg-white/3 transition-colors">
        <div className="w-10 h-10 rounded-lg bg-primary/8 dark:bg-primary/15 flex items-center justify-center flex-shrink-0">
          <BookOpen size={18} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-on-surface dark:text-white truncate">{path.title}</p>
          <span className="text-xs text-outline dark:text-slate-500 flex items-center gap-1"><Layers size={11} />{path._count?.levels || 0} levels</span>
        </div>
        <div className="text-outline dark:text-slate-500">{open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <div className="px-6 pb-6 border-t border-outline-variant/20 dark:border-white/5 pt-5 space-y-2">
              {(path.levels || []).length === 0
                ? <p className="text-sm text-outline dark:text-slate-500 text-center py-4">No levels yet.</p>
                : (path.levels || []).map(level => <LevelPanel key={level.id} level={level} />)
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminTasksPage() {
  const [allPaths, setAllPaths] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    pathService.listPaths({ limit: 50 })
      .then(res => setAllPaths(res.data?.paths || []))
      .catch(err => setError(err.response?.data?.message || 'Failed to load paths.'))
      .finally(() => setLoading(false));
  }, []);

  const paths = search
    ? allPaths.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    : allPaths;

  return (
    <DashboardLayout isAdmin>
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-xl font-bold text-on-surface dark:text-white">Tasks & Resources</h1>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-0.5">Manage tasks, resources, cheat sheets, and level locks</p>
            </div>
            <div className="relative sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-500" />
              <input type="text" placeholder="Search paths..." value={search}
                onChange={e => setSearch(e.target.value)} className="input-field pl-9 w-full" />
            </div>
          </div>

          {error && <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-4 text-sm text-error flex items-center gap-2"><AlertCircle size={14} />{error}</div>}

          {loading ? (
            <div className="space-y-4">{[1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>
          ) : paths.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/8 dark:bg-primary/15 flex items-center justify-center mx-auto mb-4">
                <CheckSquare size={22} className="text-primary" />
              </div>
              <p className="font-semibold text-on-surface dark:text-white mb-1">{search ? 'No paths match your search.' : 'No paths yet.'}</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {paths.map((path, i) => (
                <motion.div key={path.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <PathPanel path={path} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
