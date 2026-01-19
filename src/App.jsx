import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import FAB from './components/FAB';
import TaskItem from './components/TaskItem';
import { useTodos } from './hooks/useTodos';
import SettingsModal from './components/SettingsModal';
import { AnimatePresence, motion, Reorder } from 'framer-motion';

function App() {
  const { todos, loading, addTodo, toggleTodo, deleteTodo, updateTodo, reorderTodos } = useTodos();
  const [isAdding, setIsAdding] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [customColor, setCustomColor] = useState('#6366f1'); // Default accent
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('system'); // system, light, dark
  const inputRef = useRef(null);

  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    // Apply theme
    const root = document.body;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      // Clean up classes, let media query take over
      localStorage.removeItem('theme'); // Optional: keep clean
    } else {
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleClearData = () => {
    // We need a way to clear data. 
    // Since useTodos manages state, we can iterate and delete or expose a clear function.
    // For now, let's just use deleteTodo on all IDs since we don't have clearTodos in hook.
    // Or better, we can manually clear storage if we want to be aggressive, 
    // but updating state via hook is safer for UI consistency.
    // Let's iterate backwards or copy the array.
    [...todos].forEach(t => deleteTodo(t.id));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      addTodo(inputText.trim(), selectedPriority, dueDate || null, customColor);
      setInputText('');
      setSelectedPriority('medium');
      setDueDate('');
      setCustomColor('#6366f1');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsAdding(false);
      setInputText('');
      setSelectedPriority('medium');
    }
  };

  // Priority definitions
  const priorities = [
    { id: 'low', color: '#10b981', label: 'Low' },
    { id: 'medium', color: '#f59e0b', label: 'Medium' },
    { id: 'high', color: '#ef4444', label: 'High' }
  ];

  const filteredTodos = todos.filter(todo => 
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
      return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
  }

  return (
    <div className="app-container" style={{ padding: '20px', paddingBottom: '80px', minHeight: '100vh', boxSizing: 'border-box', position: 'relative' }}>
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onSettingsClick={() => setIsSettingsOpen(true)}
      />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        onClearData={handleClearData}
      />
      
      <main>
        <AnimatePresence mode="wait">
            {todos.length === 0 && !isAdding ? (
            <motion.div 
                key="empty"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="glass-panel" 
                style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary-light)' }}
            >
                <p>No tasks yet. Tap + to add one.</p>
            </motion.div>
            ) : (
            <div style={{ paddingBottom: '20px' }}>
                <AnimatePresence>
                <Reorder.Group axis="y" values={todos} onReorder={reorderTodos} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {filteredTodos.map(task => (
                        <Reorder.Item key={task.id} value={task} style={{ position: 'relative' }}>
                            <TaskItem 
                                task={task} 
                                onToggle={toggleTodo} 
                                onDelete={deleteTodo} 
                                onUpdate={updateTodo} 
                            />
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
                </AnimatePresence>
                {filteredTodos.length === 0 && todos.length > 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary-light)' }}>No matches found</p>
                )}
            </div>
            )}
        </AnimatePresence>

        {/* Input Overlay */}
        <AnimatePresence>
            {isAdding && (
                <motion.form
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    onSubmit={handleAddSubmit}
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '20px',
                        paddingBottom: '30px',
                        background: 'var(--glass-bg)',
                        backdropFilter: 'blur(20px)',
                        borderTop: '1px solid var(--glass-border)',
                        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
                        zIndex: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}
                >
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {priorities.map(p => (
                            <button
                                type="button"
                                key={p.id}
                                onClick={() => setSelectedPriority(p.id)}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: p.color,
                                    border: selectedPriority === p.id ? '2px solid white' : 'none',
                                    boxShadow: selectedPriority === p.id ? '0 0 0 2px var(--accent-color)' : 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    opacity: selectedPriority === p.id ? 1 : 0.4
                                }}
                                title={p.label}
                            />
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="What needs to be done?"
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255,255,255,0.5)',
                                fontSize: '16px',
                                color: 'var(--text-primary-light)',
                                outline: 'none'
                            }}
                        />
                        <button 
                            type="submit"
                            style={{
                                padding: '0 20px',
                                borderRadius: 'var(--radius-md)',
                                border: 'none',
                                background: 'var(--accent-color)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '14px'
                            }}
                        >
                            Add
                        </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary-light)' }}>Due:</span>
                        <input 
                            type="date" 
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            style={{
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255,255,255,0.5)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '4px',
                                fontFamily: 'inherit',
                                color: 'var(--text-primary-light)'
                            }}
                        />
                        <div style={{ width: '1px', height: '20px', background: 'var(--glass-border)', margin: '0 4px' }} />
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary-light)' }}>Color:</span>
                        <input
                            type="color"
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                            style={{
                                border: 'none',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                background: 'transparent'
                            }}
                        />
                    </div>
                </motion.form>
            )}
        </AnimatePresence>
      </main>

      {!isAdding && <FAB onClick={() => setIsAdding(true)} />}
      
      {/* Overlay to close input when clicking outside */}
      {isAdding && (
          <div 
            onClick={() => setIsAdding(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 15 }} 
          />
      )}
    </div>
  );
}

export default App;
