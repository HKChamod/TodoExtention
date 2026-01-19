import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FAB({ onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        border: 'none',
        background: 'var(--accent-color)',
        color: 'white',
        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 10
      }}
    >
      <Plus size={24} />
    </motion.button>
  );
}
