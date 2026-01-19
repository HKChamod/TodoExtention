import React, { useState } from 'react';
import { Settings, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header({ searchQuery, setSearchQuery, onSettingsClick }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="glass-panel" style={{ 
      padding: '16px', 
      marginBottom: '20px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      height: '60px',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <AnimatePresence mode="wait">
        {isSearchOpen ? (
          <motion.div 
            key="search"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '8px' }}
          >
            <Search size={18} color="var(--text-secondary-light)" />
            <input 
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '16px',
                color: 'var(--text-primary-light)',
                flex: 1,
                fontFamily: 'inherit'
              }}
            />
            <button 
              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
              style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: 'var(--text-secondary-light)' }}
            >
              <X size={18} />
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="title"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
          >
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Glass Todo</h1>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setIsSearchOpen(true)}
                style={{ background: 'none', border: 'none', color: 'inherit', padding: 4, cursor: 'pointer' }}
              >
                <Search size={20} />
              </button>
              <button 
                className="icon-btn" 
                onClick={onSettingsClick}
                style={{ background: 'none', border: 'none', color: 'inherit', padding: 4, cursor: 'pointer' }}
              >
                <Settings size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
