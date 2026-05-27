import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, BookOpen, Trash2, X, Check,
  UserX, RefreshCw, AlertCircle, BookMarked
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import ProgressBar from '../../components/ui/ProgressBar';
import Button from '../../components/ui/Button';
import { SkeletonLine } from '../../components/ui/Skeleton';
import userService from '../../services/userService';
import pathService from '../../services/pathService';

// ─── Change Path Modal ────────────────────────────────────────────────────────
function ChangePathModal({ user, onClose, onSaved }) {
  const [paths, setPaths]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(user.pathId ? String(user.pathId) : '');
  const [saving, setSaving]         = useState(false);
  const [removing, setRemoving]     = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    pathService.listPaths({ limit: 50 })
      .then(res => setPaths(res.data?.paths || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!selected) { setError('Select a path.'); return; }
    setSaving(true); setError('');
    try {
      await userService.changeUserPath(user.id, parseInt(selected));
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change path.');
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm(`Remove ${user.name}'s current path and all progress?`)) return;
    setRemoving(true);
    try {
      await userService.removeUserPath(user.id);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove path.');
      setRemoving(false);
    }
  };

  const DIFF_COLOR = { Beginner: 'green', Intermediate: 'blue', Advanced: 'red' };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-glass border border-outline-variant/30 dark:border-white/5 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 dark:border-white/5">
          <div>
            <h2 className="font-bold text-on-surface dark:text-white">Manage Path</h2>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">
              Assign or change path for <span className="font-medium text-on-surface dark:text-white">{user.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-outline dark:text-slate-400 hover:text-on-surface p-1">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Current path indicator */}
          {user.pathTitle && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20">
              <BookOpen size={15} className="text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-outline dark:text-slate-400 mb-0.5">Current path</p>
                <p className="text-sm font-medium text-on-surface dark:text-white truncate">{user.pathTitle}</p>
                <div className="flex items-center gap-2 mt-1">
                  <ProgressBar value={user.pathProgress} max={100} className="flex-1 max-w-[100px]" size="sm" />
                  <span className="text-xs font-semibold text-primary">{user.pathProgress}%</span>
                </div>
              </div>
              <button
                onClick={handleRemove}
                disabled={removing}
                className="flex items-center gap-1 text-xs text-error hover:bg-error/10 px-2 py-1 rounded border border-error/30 transition-colors disabled:opacity-50"
              >
                {removing ? <RefreshCw size={11} className="animate-spin" /> : <X size={11} />}
                Remove
              </button>
            </div>
          )}

          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-sm text-error flex items-center gap-2">
              <AlertCircle size={14} />{error}
            </div>
          )}

          {/* Path list */}
          <div>
            <p className="text-sm font-medium text-on-surface dark:text-slate-200 mb-2">
              {user.pathTitle ? 'Switch to a different path:' : 'Assign a path:'}
            </p>
            {loading ? (
              <div className="space-y-2">{[1,2,3].map(i => <SkeletonLine key={i} height="h-14" />)}</div>
            ) : paths.length === 0 ? (
              <p className="text-sm text-outline dark:text-slate-500 text-center py-4">No paths available.</p>
            ) : (
              <div className="space-y-2">
                {paths.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelected(String(p.id))}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                      selected === String(p.id)
                        ? 'border-primary/30 bg-primary/5 dark:bg-primary/10'
                        : 'border-outline-variant/30 dark:border-white/5 hover:bg-surface-container dark:hover:bg-white/5'
                    } ${user.pathId === p.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={user.pathId === p.id}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/8 dark:bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={14} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface dark:text-white truncate">{p.title}</p>
                      <p className="text-xs text-outline dark:text-slate-500">
                        {p._count?.levels || 0} levels · {p.estimatedWeeks}w
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge color={DIFF_COLOR[p.difficulty] || 'blue'}>{p.difficulty}</Badge>
                      {selected === String(p.id) && <Check size={15} className="text-primary" />}
                      {user.pathId === p.id && <span className="text-xs text-outline dark:text-slate-500">current</span>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/20 dark:border-white/5">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary" size="sm" icon={Check} loading={saving}
            onClick={handleSave}
            disabled={!selected || selected === String(user.pathId)}
          >
            {saving ? 'Assigning...' : user.pathTitle ? 'Switch Path' : 'Assign Path'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteConfirmModal({ user, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState('');

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await userService.deleteUser(user.id);
      onDeleted(user.id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-glass border border-outline-variant/30 dark:border-white/5 p-6"
      >
        <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
          <UserX size={22} className="text-error" />
        </div>
        <h3 className="font-bold text-on-surface dark:text-white text-center mb-1">Delete User?</h3>
        <p className="text-sm text-on-surface-variant dark:text-slate-400 text-center mb-1">
          <span className="font-medium text-on-surface dark:text-white">{user.name}</span>
        </p>
        <p className="text-xs text-outline dark:text-slate-500 text-center mb-5">
          This will soft-delete the account. Their data is preserved but they cannot log in.
        </p>
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-sm text-error mb-4 text-center">{error}</div>
        )}
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="danger" size="sm" className="flex-1" loading={deleting} onClick={handleDelete}>
            {deleting ? 'Deleting...' : 'Delete User'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── User Row ─────────────────────────────────────────────────────────────────
function UserRow({ user, onStatusChange, onDelete, onPathChange, index }) {
  const [showChangePath, setShowChangePath] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [toggling, setToggling]     = useState(false);

  const handleStatusToggle = async () => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    setToggling(true);
    try {
      await userService.updateUserStatus(user.id, newStatus);
      onStatusChange(user.id, newStatus);
    } catch { /* silent */ } finally { setToggling(false); }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }}
        className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-surface-container-low dark:hover:bg-white/2 transition-colors"
      >
        {/* Avatar + name */}
        <div className="flex items-center gap-3 sm:w-52 flex-shrink-0">
          <Avatar name={user.name} src={user.avatarUrl} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-on-surface dark:text-white truncate">{user.name}</p>
            <p className="text-xs text-outline dark:text-slate-500 truncate">{user.email}</p>
          </div>
        </div>

        {/* Path + progress */}
        <div className="flex-1 min-w-0">
          {user.pathTitle ? (
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <BookOpen size={11} className="text-primary flex-shrink-0" />
                <p className="text-xs font-medium text-on-surface dark:text-white truncate">{user.pathTitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <ProgressBar value={user.pathProgress} max={100} className="flex-1 max-w-[140px]" size="sm" />
                <span className="text-xs font-semibold text-primary">{user.pathProgress}%</span>
                <span className="text-xs text-outline dark:text-slate-500">
                  {user.completedLevels}/{user.totalLevels} lvl
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowChangePath(true)}
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <BookOpen size={11} /> Assign path
            </button>
          )}
        </div>

        {/* Status + date + actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge color={user.status === 'active' ? 'green' : user.status === 'banned' ? 'red' : 'gray'}>
            {user.status}
          </Badge>
          <span className="text-xs text-outline dark:text-slate-500 hidden lg:block">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>

          {/* Action buttons */}
          <button
            onClick={() => setShowChangePath(true)}
            className="p-1.5 rounded text-outline dark:text-slate-500 hover:text-primary hover:bg-primary/8 dark:hover:bg-primary/15 transition-colors"
            title="Manage path"
          >
            <BookMarked size={15} />
          </button>

          <button
            onClick={handleStatusToggle}
            disabled={toggling}
            className={`p-1.5 rounded transition-colors ${
              user.status === 'active'
                ? 'text-outline dark:text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                : 'text-outline dark:text-slate-500 hover:text-tertiary hover:bg-tertiary/10'
            } ${toggling ? 'opacity-50' : ''}`}
            title={user.status === 'active' ? 'Deactivate' : 'Activate'}
          >
            {toggling
              ? <RefreshCw size={15} className="animate-spin" />
              : <UserX size={15} />
            }
          </button>

          <button
            onClick={() => setShowDelete(true)}
            className="p-1.5 rounded text-outline dark:text-slate-500 hover:text-error hover:bg-error/10 transition-colors"
            title="Delete user"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showChangePath && (
          <ChangePathModal
            user={user}
            onClose={() => setShowChangePath(false)}
            onSaved={() => onPathChange(user.id)}
          />
        )}
        {showDelete && (
          <DeleteConfirmModal
            user={user}
            onClose={() => setShowDelete(false)}
            onDeleted={onDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [users, setUsers]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { limit: 50, role: 'user' };
      if (search) params.search = search;
      if (filter !== 'all') params.status = filter;
      const res = await userService.listUsers(params);
      setUsers(res.data?.users || []);
      setTotal(res.data?.meta?.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleStatusChange = (userId, newStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

  const handleDelete = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setTotal(prev => prev - 1);
  };

  // Reload single user after path change to get fresh progress data
  const handlePathChange = () => load();

  return (
    <DashboardLayout isAdmin>
      <div className="p-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-on-surface dark:text-white">Users</h1>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-0.5">
                {total} registered learner{total !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-500" />
              <input
                type="text" placeholder="Search by name or email..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="input-field pl-9 w-full"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'inactive', 'banned'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-2 rounded text-sm font-medium capitalize transition-colors ${
                    filter === f
                      ? 'bg-primary text-white'
                      : 'bg-white dark:bg-slate-800 border border-outline-variant/40 dark:border-white/5 text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-white/5'
                  }`}>{f}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-4 text-sm text-error flex items-center gap-2">
              <AlertCircle size={14} />{error}
            </div>
          )}

          {/* Table */}
          <Card className="overflow-hidden">
            {/* Column headers */}
            <div className="hidden sm:grid grid-cols-[200px_1fr_auto] gap-4 px-5 py-3 border-b border-outline-variant/20 dark:border-white/5 bg-surface-container-low dark:bg-slate-900">
              <p className="text-label-caps text-outline dark:text-slate-500 font-geist">USER</p>
              <p className="text-label-caps text-outline dark:text-slate-500 font-geist">PATH & PROGRESS</p>
              <p className="text-label-caps text-outline dark:text-slate-500 font-geist">ACTIONS</p>
            </div>

            {loading ? (
              <div className="p-5 space-y-4">
                {[1,2,3,4,5].map(i => <SkeletonLine key={i} height="h-14" />)}
              </div>
            ) : users.length === 0 ? (
              <div className="py-16 text-center">
                <UserX size={32} className="text-outline mx-auto mb-3" />
                <p className="text-sm text-on-surface-variant dark:text-slate-400">No users match your search.</p>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/20 dark:divide-white/5">
                {users.map((u, i) => (
                  <UserRow
                    key={u.id}
                    user={u}
                    index={i}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    onPathChange={handlePathChange}
                  />
                ))}
              </div>
            )}
          </Card>

          {/* Legend */}
          <div className="flex items-center gap-5 mt-4 px-1">
            {[
              { icon: BookMarked, label: 'Manage path', color: 'text-primary' },
              { icon: UserX,      label: 'Activate / Deactivate', color: 'text-amber-600' },
              { icon: Trash2,     label: 'Delete user', color: 'text-error' },
            ].map(({ icon: Icon, label, color }) => (
              <span key={label} className="flex items-center gap-1.5 text-xs text-outline dark:text-slate-500">
                <Icon size={13} className={color} />{label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
