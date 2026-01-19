import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, CheckCircle, Circle } from 'lucide-react';
import clsx from 'clsx';

export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  };

  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(task.text);

  const handleSave = () => {
    if (onUpdate && editText.trim() !== task.text) {
        onUpdate(task.id, { text: editText.trim() });
    }
    setIsEditing(false);
  };

  return (
    <div
      className={clsx('glass-panel', 'task-item')}
      style={{
        padding: '12px 16px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'default',
        background: task.completed ? 'rgba(255,255,255,0.3)' : 'var(--glass-bg)',
        borderLeft: `4px solid ${priorityColors[task.priority] || priorityColors.medium}`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden', flex: 1 }}>
        <button 
          onClick={() => onToggle(task.id)}
          style={{ background: 'none', border: 'none', padding: 0, color: task.completed ? '#10b981' : 'var(--text-secondary-light)', cursor: 'pointer' }}
        >
          {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
        </button>
        
        {isEditing ? (
            <input 
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                style={{ 
                    border: 'none', 
                    background: 'transparent', 
                    fontSize: 'inherit', 
                    fontFamily: 'inherit',
                    color: 'inherit',
                    outline: 'none',
                    width: '100%'
                }}
            />
        ) : (
            <span 
                onDoubleClick={() => setIsEditing(true)}
                title="Double click to edit"
                style={{ 
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'var(--text-secondary-light)' : 'inherit',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    cursor: 'text',
                    flex: 1
                }}
            >
            {task.text}
            </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {task.tags && task.tags.map(tag => (
              <span key={tag} style={{ fontSize: '10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-color)', padding: '2px 6px', borderRadius: '8px' }}>
                  {tag}
              </span>
          ))}
          
          {task.dueDate && (
             <span style={{ fontSize: '11px', color: 'var(--text-secondary-light)', opacity: 0.8 }}>
                 {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
             </span>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#ef4444', 
              opacity: 0.6,
              padding: 4,
              cursor: 'pointer'
            }}
            className="delete-btn"
          >
            <Trash2 size={16} />
          </button>
      </div>
    </div>
  );
}
