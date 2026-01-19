import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Monitor, Trash2 } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, theme, setTheme, onClearData }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(5px)',
              zIndex: 40
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-45%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-45%' }}
            className="glass-panel"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              // transform is handled by motion
              width: '90%',
              maxWidth: '320px',
              padding: '24px',
              zIndex: 50,
              background: 'var(--glass-bg)',
              color: 'var(--text-primary-light)' // Inherits from body usually but force checks might be needed
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Settings</h2>
              <button onClick={onClose} className="icon-btn" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="var(--text-secondary-light)" />
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary-light)', marginBottom: '12px' }}>Appearance</h3>
              <div style={{ display: 'flex', background: 'rgba(127,127,127,0.1)', padding: '4px', borderRadius: '12px', gap: '4px' }}>
                {[
                  { id: 'system', icon: Monitor, label: 'System' },
                  { id: 'light', icon: Sun, label: 'Light' },
                  { id: 'dark', icon: Moon, label: 'Dark' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setTheme(item.id)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: theme === item.id ? 'var(--glass-bg)' : 'transparent',
                      boxShadow: theme === item.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                      color: theme === item.id ? 'var(--accent-color)' : 'var(--text-secondary-light)',
                      transition: 'all 0.2s',
                      fontSize: '13px',
                      fontWeight: 500
                    }}
                  >
                    <item.icon size={14} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary-light)', marginBottom: '12px' }}>Data</h3>
              <button
                onClick={() => {
                   if(confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
                       onClearData();
                       onClose();
                   }
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #fee2e2',
                  background: 'rgba(254, 226, 226, 0.3)',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                <Trash2 size={16} />
                Clear All Tasks
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
