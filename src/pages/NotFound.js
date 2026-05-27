import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div className="text-7xl font-black text-primary/20 dark:text-primary/30 font-geist mb-4">404</div>
        <h1 className="text-2xl font-bold text-on-surface dark:text-white mb-2">Page not found</h1>
        <p className="text-on-surface-variant dark:text-slate-400 mb-8 text-sm">The page you're looking for doesn't exist or has been moved.</p>
        <Button variant="primary" onClick={() => navigate('/')}>Back to Home</Button>
      </motion.div>
    </div>
  );
}
