import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, CheckSquare, Bell, TrendingUp, ChevronRight, Lock, Clock } from 'lucide-react';
import { useAuth } from '../../modules/auth/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { SkeletonCard, SkeletonLine } from '../../components/ui/Skeleton';
import progressService from '../../services/progressService';
import announcementService from '../../services/announcementService';
import usePageTitle from '../../hooks/usePageTitle';

function StatCard({ icon: Icon, label, value, sub, color = 'blue', loading }) {
  const colors = {
    blue: 'bg-primary/8 dark:bg-primary/15 text-primary',
    green: 'bg-tertiary/8 dark:bg-tertiary/15 text-tertiary',
    purple: 'bg-secondary/8 dark:bg-secondary/15 text-secondary',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center`}>
          <Icon size={18} />
        </div>
      </div>
      {loading
        ? <><SkeletonLine height="h-7" width="w-16" className="mb-1" /><SkeletonLine height="h-3" width="w-24" /></>
        : <>
          <p className="text-2xl font-bold text-on-surface dark:text-white mb-0.5">{value}</p>
          <p className="text-sm font-medium text-on-surface dark:text-white/80">{label}</p>
          {sub && <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">{sub}</p>}
        </>
      }
    </Card>
  );
}

function fade(delay = 0) {
  return { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay } };
}

export default function UserDashboard() {
  usePageTitle('Dashboard');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [progRes, annRes] = await Promise.all([
          progressService.getMyProgress(),
          announcementService.listAnnouncements({ limit: 3 }),
        ]);
        setProgress(progRes.data);
        setAnnouncements(annRes.data?.announcements || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const currentLevel = progress?.levels?.find(l => l.isCurrent);
  const completedTasks = currentLevel?.completedTasks ?? 0;
  const totalTasks = currentLevel?.totalTasks ?? 0;
  const unreadAnnouncements = announcements.filter(a => !a.isRead).length;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <motion.div {...fade(0)} className="mb-8">
          <h1 className="text-2xl font-bold text-on-surface dark:text-white mb-1">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-on-surface-variant dark:text-slate-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {error && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6 text-sm text-error">{error}</div>
        )}

        <motion.div {...fade(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={TrendingUp} label="Path Progress" value={`${progress?.overallProgress ?? 0}%`} sub={progress?.path?.title} color="blue" loading={loading} />
          <StatCard icon={BookOpen} label="Levels Done" value={`${progress?.completedLevels ?? 0}/${progress?.totalLevels ?? 0}`} sub="Current path" color="green" loading={loading} />
          <StatCard icon={CheckSquare} label="Tasks Done" value={`${completedTasks}/${totalTasks}`} sub="Current level" color="purple" loading={loading} />
          <StatCard icon={Bell} label="Unread" value={unreadAnnouncements} sub="Announcements" color="amber" loading={loading} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div {...fade(0.1)} className="lg:col-span-2">
            {loading ? <SkeletonCard /> : (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-1">CURRENT LEVEL</p>
                    <h2 className="font-semibold text-on-surface dark:text-white text-base">
                      {currentLevel?.title || 'No active level'}
                    </h2>
                  </div>
                  {currentLevel && <Badge color="blue">Level {currentLevel.order}</Badge>}
                </div>

                {currentLevel && <ProgressBar value={completedTasks} max={totalTasks} showLabel className="mb-6" />}

                <div className="space-y-2">
                  {(currentLevel?.tasks || []).slice(0, 6).map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer
                        ${!task.isCompleted && (currentLevel?.tasks?.findIndex(t => !t.isCompleted) === currentLevel?.tasks?.indexOf(task))
                          ? 'border-primary/20 bg-primary/4 dark:bg-primary/8'
                          : 'border-transparent hover:bg-surface-container dark:hover:bg-white/5 hover:border-outline-variant/30'
                        }`}
                      onClick={() => navigate('/dashboard/tasks')}
                    >
                      <div className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center
                        ${task.isCompleted ? 'bg-primary border-primary' : 'border-outline-variant dark:border-white/20'}`}>
                        {task.isCompleted && (
                          <svg viewBox="0 0 16 16" className="w-3 h-3 text-white" fill="none">
                            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm flex-1 font-medium ${task.isCompleted ? 'line-through text-outline dark:text-slate-500' : 'text-on-surface dark:text-white'}`}>
                        {task.title}
                      </span>
                      <ChevronRight size={14} className="text-outline dark:text-slate-600 flex-shrink-0" />
                    </div>
                  ))}
                </div>
                {(currentLevel?.tasks?.length || 0) > 6 && (
                  <button onClick={() => navigate('/dashboard/tasks')} className="mt-4 text-sm text-primary hover:underline font-medium">
                    View all {currentLevel.tasks.length} tasks →
                  </button>
                )}
                {!currentLevel && !loading && (
                  <p className="text-sm text-on-surface-variant dark:text-slate-400">No path assigned yet. Contact your admin.</p>
                )}
              </Card>
            )}
          </motion.div>

          <div className="space-y-6">
            <motion.div {...fade(0.15)}>
              {loading ? <SkeletonCard /> : (
                <Card className="p-5">
                  <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-4">YOUR PATH</p>
                  {progress?.path ? (
                    <>
                      <h3 className="font-semibold text-on-surface dark:text-white text-sm mb-4 leading-snug">{progress.path.title}</h3>
                      <div className="space-y-2.5">
                        {(progress.levels || []).slice(0, 5).map((level) => (
                          <div key={level.id} className="flex items-center gap-2.5">
                            <div className={`w-6 h-6 rounded flex-shrink-0 flex items-center justify-center text-xs font-bold
                              ${level.isCompleted ? 'bg-primary text-white'
                                : level.isLocked ? 'bg-surface-container dark:bg-white/10 text-outline dark:text-slate-500'
                                : 'border-2 border-primary text-primary'}`}>
                              {level.isLocked ? <Lock size={10} /> : level.order}
                            </div>
                            <span className={`text-xs flex-1 truncate
                              ${level.isCompleted ? 'text-on-surface-variant dark:text-slate-400 line-through'
                                : level.isLocked ? 'text-outline dark:text-slate-600'
                                : 'text-on-surface dark:text-white font-medium'}`}>
                              {level.title}
                            </span>
                            {level.isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                          </div>
                        ))}
                        {(progress.levels?.length || 0) > 5 && (
                          <p className="text-xs text-outline dark:text-slate-500 pl-8">+{progress.levels.length - 5} more levels</p>
                        )}
                      </div>
                      <Button variant="secondary" size="sm" className="w-full mt-5" onClick={() => navigate('/dashboard/path')}>
                        View Full Path
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm text-on-surface-variant dark:text-slate-400">No path assigned.</p>
                  )}
                </Card>
              )}
            </motion.div>

            <motion.div {...fade(0.2)}>
              {loading ? <SkeletonCard /> : (
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-label-caps text-outline dark:text-slate-500 font-geist">ANNOUNCEMENTS</p>
                    {unreadAnnouncements > 0 && (
                      <span className="w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">{unreadAnnouncements}</span>
                    )}
                  </div>
                  <div className="space-y-3">
                    {announcements.slice(0, 2).map((a) => (
                      <div key={a.id} className={`p-3 rounded-lg ${!a.isRead ? 'bg-primary/5 dark:bg-primary/10' : 'bg-surface-container dark:bg-white/5'}`}>
                        <div className="flex items-start gap-2">
                          {!a.isRead && <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                          <div>
                            <p className="text-xs font-semibold text-on-surface dark:text-white leading-snug">{a.title}</p>
                            <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1 line-clamp-2">{a.body}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {announcements.length === 0 && <p className="text-xs text-outline dark:text-slate-500">No announcements yet.</p>}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-4" onClick={() => navigate('/dashboard/announcements')}>
                    <Clock size={13} /> View All
                  </Button>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
