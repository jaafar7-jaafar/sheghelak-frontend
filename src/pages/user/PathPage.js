import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/ui/Skeleton';
import progressService from '../../services/progressService';

function LevelCard({ level, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className={`overflow-hidden ${level.isLocked ? 'opacity-60' : ''}`}>
      <button
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-surface-container dark:hover:bg-white/3 transition-colors"
        onClick={() => !level.isLocked && setOpen(p => !p)}
        disabled={level.isLocked}
      >
        <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-sm font-bold
          ${level.isCompleted ? 'bg-tertiary/10 dark:bg-tertiary/20'
            : level.isLocked ? 'bg-surface-container dark:bg-white/10'
            : level.isCurrent ? 'bg-primary/10 dark:bg-primary/20'
            : 'bg-surface-container dark:bg-white/10'}`}>
          {level.isCompleted
            ? <CheckCircle size={20} className="text-tertiary" />
            : level.isLocked
            ? <Lock size={18} className="text-outline dark:text-slate-600" />
            : <span className={level.isCurrent ? 'text-primary' : 'text-on-surface-variant dark:text-slate-400'}>{level.order}</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className={`font-semibold text-sm ${level.isLocked ? 'text-outline dark:text-slate-600' : 'text-on-surface dark:text-white'}`}>
              {level.title}
            </span>
            {level.isCurrent && <Badge color="blue">Current</Badge>}
            {level.isCompleted && <Badge color="green">Completed</Badge>}
            {level.isLocked && <Badge color="gray">Locked</Badge>}
          </div>
          {!level.isLocked && (
            <div className="flex items-center gap-4">
              <ProgressBar value={level.completedTasks} max={level.totalTasks} className="flex-1 max-w-[120px]" size="sm" />
              <span className="text-xs text-outline dark:text-slate-500">{level.completedTasks}/{level.totalTasks} tasks</span>
            </div>
          )}
          {level.isLocked && <p className="text-xs text-outline dark:text-slate-600">Complete previous level to unlock</p>}
        </div>
        {!level.isLocked && (
          <div className="flex-shrink-0 text-outline dark:text-slate-500">
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        )}
      </button>

      <AnimatePresence>
        {open && !level.isLocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-outline-variant/30 dark:border-white/5 pt-4">
              <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-4">{level.description}</p>
              <div className="space-y-2">
                {(level.tasks || []).map(task => (
                  <div key={task.id} className="flex items-center gap-3 py-2">
                    <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center
                      ${task.isCompleted ? 'bg-primary border-primary' : 'border-outline-variant dark:border-white/20'}`}>
                      {task.isCompleted && (
                        <svg viewBox="0 0 16 16" className="w-3 h-3 text-white" fill="none">
                          <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm flex-1 ${task.isCompleted ? 'line-through text-outline dark:text-slate-500' : 'text-on-surface dark:text-white'}`}>
                      {task.title}
                    </span>
                    <Badge color={{ task: 'gray', project: 'blue', submission: 'purple' }[task.type] || 'gray'}>
                      {task.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function PathPage() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    progressService.getMyProgress()
      .then(res => setProgress(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load path.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-2">YOUR LEARNING PATH</p>

          {error && <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-4 text-sm text-error">{error}</div>}

          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>
          ) : !progress?.path ? (
            <Card className="p-10 text-center">
              <p className="text-on-surface dark:text-white font-medium">No path assigned yet.</p>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-1">Contact your admin to get started.</p>
            </Card>
          ) : (
            <>
              <h1 className="text-xl font-bold text-on-surface dark:text-white mb-1">{progress.path.title}</h1>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-6">{progress.path.description}</p>

              <Card className="p-5 mb-8">
                <div className="flex gap-6 mb-4">
                  <div><p className="text-xl font-bold text-on-surface dark:text-white">{progress.overallProgress}%</p><p className="text-xs text-outline dark:text-slate-500">Complete</p></div>
                  <div><p className="text-xl font-bold text-on-surface dark:text-white">{progress.completedLevels}/{progress.totalLevels}</p><p className="text-xs text-outline dark:text-slate-500">Levels</p></div>
                </div>
                <ProgressBar value={progress.completedLevels} max={progress.totalLevels} showLabel size="lg" />
              </Card>

              <div className="space-y-3">
                {(progress.levels || []).map((level, i) => (
                  <motion.div key={level.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                    <LevelCard level={level} defaultOpen={!!level.isCurrent} />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
