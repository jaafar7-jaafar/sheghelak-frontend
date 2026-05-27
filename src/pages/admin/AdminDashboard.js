import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Send, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { SkeletonLine } from '../../components/ui/Skeleton';
import analyticsService from '../../services/analyticsService';
import submissionService from '../../services/submissionService';
import userService from '../../services/userService';

function StatCard({ icon: Icon, label, value, sub, trend, color = 'blue', loading }) {
  const colors = {
    blue: 'bg-primary/8 dark:bg-primary/15 text-primary',
    green: 'bg-tertiary/8 dark:bg-tertiary/15 text-tertiary',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    purple: 'bg-secondary/8 dark:bg-secondary/15 text-secondary',
  };
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[color]}`}><Icon size={17} /></div>
        {trend && <div className="flex items-center gap-1 text-xs text-tertiary font-medium"><TrendingUp size={12} /> {trend}</div>}
      </div>
      {loading
        ? <><SkeletonLine height="h-7" width="w-16" className="mb-1" /><SkeletonLine height="h-3" width="w-24" /></>
        : <>
          <p className="text-2xl font-bold text-on-surface dark:text-white mb-0.5">{value}</p>
          <p className="text-sm text-on-surface dark:text-white/80 font-medium">{label}</p>
          {sub && <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-0.5">{sub}</p>}
        </>
      }
    </Card>
  );
}

function fade(d = 0) { return { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: d } }; }

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-outline-variant/30 dark:border-white/5 rounded-lg p-2.5 shadow-card">
        <p className="text-xs text-outline dark:text-slate-400">{label}</p>
        <p className="text-sm font-bold text-on-surface dark:text-white">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [pending, setPending] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [analyticsRes, subsRes, usersRes] = await Promise.all([
          analyticsService.getOverview(),
          submissionService.listSubmissions({ status: 'pending', limit: 5 }),
          userService.listUsers({ limit: 5 }),
        ]);
        setData(analyticsRes.data);
        setPending(subsRes.data?.submissions || []);
        setRecentUsers(usersRes.data?.users?.filter(u => u.role === 'user') || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardLayout isAdmin>
      <div className="p-6 max-w-6xl mx-auto">
        <motion.div {...fade(0)} className="mb-7">
          <h1 className="text-xl font-bold text-on-surface dark:text-white">Admin Overview</h1>
          <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-0.5">Platform at a glance</p>
        </motion.div>

        {error && <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6 text-sm text-error">{error}</div>}

        <motion.div {...fade(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Total Users" value={data?.totalUsers?.toLocaleString()} sub={`${data?.activeUsers || 0} active`} trend="+12%" color="blue" loading={loading} />
          <StatCard icon={BookOpen} label="Active Paths" value={data?.totalPaths} sub={`${data?.totalLevels || 0} levels`} color="green" loading={loading} />
          <StatCard icon={Send} label="Pending Reviews" value={data?.submissionsPending} sub="Awaiting review" color="amber" loading={loading} />
          <StatCard icon={Clock} label="This Week" value={data?.submissionsThisWeek} sub="Submissions" color="purple" loading={loading} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div {...fade(0.1)}>
            <Card className="p-5">
              <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-4">USER GROWTH</p>
              {loading ? <SkeletonLine height="h-44" /> : (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={data?.userGrowth || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#727687' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#727687' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="count" stroke="#0050cb" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card>
          </motion.div>
          <motion.div {...fade(0.12)}>
            <Card className="p-5">
              <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-4">SUBMISSIONS PER WEEK</p>
              {loading ? <SkeletonLine height="h-44" /> : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={data?.submissionsPerWeek || []}>
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#727687' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#727687' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#0050cb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div {...fade(0.15)}>
            <Card className="p-5">
              <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-4">RECENT USERS</p>
              {loading ? <div className="space-y-3">{[1,2,3].map(i => <SkeletonLine key={i} height="h-8" />)}</div> : (
                <div className="space-y-3">
                  {recentUsers.length === 0 && <p className="text-sm text-outline dark:text-slate-500">No users yet.</p>}
                  {recentUsers.map(u => (
                    <div key={u.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-semibold text-xs flex items-center justify-center flex-shrink-0">
                        {u.name.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-on-surface dark:text-white truncate">{u.name}</p>
                        <p className="text-xs text-outline dark:text-slate-500 truncate">{u.email}</p>
                      </div>
                      <Badge color={u.status === 'active' ? 'green' : 'gray'}>{u.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
          <motion.div {...fade(0.18)}>
            <Card className="p-5">
              <p className="text-label-caps text-outline dark:text-slate-500 font-geist mb-4">PENDING SUBMISSIONS</p>
              {loading ? <div className="space-y-3">{[1,2].map(i => <SkeletonLine key={i} height="h-12" />)}</div> : (
                <div className="space-y-3">
                  {pending.length === 0 && <p className="text-sm text-on-surface-variant dark:text-slate-400">No pending submissions.</p>}
                  {pending.map(s => (
                    <div key={s.id} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-700/20">
                      <Clock size={15} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-on-surface dark:text-white truncate">{s.task?.title}</p>
                        <p className="text-xs text-outline dark:text-slate-500 mt-0.5">{s.user?.name} · {new Date(s.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <Badge color="yellow">Pending</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
