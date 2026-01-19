import { useState, useEffect } from "react";

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load todos
  useEffect(() => {
    const loadTodos = async () => {
      try {
        if (
          typeof chrome !== "undefined" &&
          chrome.storage &&
          chrome.storage.local
        ) {
          const result = await chrome.storage.local.get(["todos"]);
          if (result.todos) {
            setTodos(result.todos);
          }
        } else {
          // Fallback for development
          const saved = localStorage.getItem("todos");
          if (saved) setTodos(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Failed to load todos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTodos();
  }, []);

  // Save todos whenever they change (debounce could be added, but simple effect is fine for now)
  useEffect(() => {
    if (loading) return;

    const saveTodos = async () => {
      try {
        if (
          typeof chrome !== "undefined" &&
          chrome.storage &&
          chrome.storage.local
        ) {
          await chrome.storage.local.set({ todos });
        } else {
          localStorage.setItem("todos", JSON.stringify(todos));
        }
      } catch (error) {
        console.error("Failed to save todos:", error);
      }
    };
    saveTodos();
  }, [todos, loading]);

  const addTodo = (text, priority = "medium", dueDate = null) => {
    // Extract tags (words starting with #)
    const tags = text.match(/#\w+/g) || [];
    const cleanText = text.replace(/#\w+/g, "").trim();

    const newTodo = {
      id: Date.now().toString(),
      text: cleanText || text,
      completed: false,
      priority,
      tags,
      dueDate,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id, updates) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)),
    );
  };

  const reorderTodos = (newOrder) => {
    setTodos(newOrder);
  };

  return {
    todos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    reorderTodos,
  };
}
