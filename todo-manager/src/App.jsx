import { useState, useMemo, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Dashboard from './components/Dashboard';
import CategoryTabs from './components/CategoryTabs';
import FolderSidebar from './components/FolderSidebar';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';
import { isToday, isThisWeek, isFuture } from './utils/dateUtils';
import './App.css';

// 기본 폴더
const defaultFolders = [
  { id: 'work', name: '업무', color: '#FFB5BA' },
  { id: 'personal', name: '개인', color: '#B5D8FF' },
  { id: 'study', name: '공부', color: '#C5E8B7' },
];

// 샘플 할일
const sampleTodos = [
  {
    id: '1',
    title: '프로젝트 기획서 작성',
    memo: '마케팅 팀과 협의 필요',
    dueDate: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    folderId: 'work',
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: '2',
    title: 'React 공부하기',
    memo: 'Hooks와 Context API 복습',
    dueDate: new Date(new Date().setHours(20, 0, 0, 0)).toISOString(),
    folderId: 'study',
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: '3',
    title: '장보기',
    memo: '우유, 계란, 빵',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    folderId: 'personal',
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
];

function App() {
  // 로컬 스토리지에서 데이터 불러오기
  const [todos, setTodos] = useLocalStorage('todos', sampleTodos);
  const [folders, setFolders] = useLocalStorage('folders', defaultFolders);
  
  // UI 상태
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFolder, setActiveFolder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 할일 개수 계산
  const todoCounts = useMemo(() => {
    const counts = {
      all: todos.filter(t => !t.completed).length,
      today: todos.filter(t => !t.completed && t.dueDate && isToday(t.dueDate)).length,
      week: todos.filter(t => !t.completed && t.dueDate && isThisWeek(t.dueDate) && !isToday(t.dueDate)).length,
      later: todos.filter(t => !t.completed && (!t.dueDate || isFuture(t.dueDate))).length,
      completed: todos.filter(t => t.completed).length,
    };
    return counts;
  }, [todos]);

  // 폴더별 할일 개수
  const folderCounts = useMemo(() => {
    const counts = {
      total: todos.filter(t => !t.completed).length,
    };
    folders.forEach(folder => {
      counts[folder.id] = todos.filter(t => !t.completed && t.folderId === folder.id).length;
    });
    return counts;
  }, [todos, folders]);

  // 할일 추가
  const handleAddTodo = useCallback((todoData) => {
    const newTodo = {
      id: Date.now().toString(),
      ...todoData,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    setTodos(prev => [newTodo, ...prev]);
  }, [setTodos]);

  // 할일 수정
  const handleEditTodo = useCallback((id, updates) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  }, [setTodos]);

  // 할일 삭제
  const handleDeleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, [setTodos]);

  // 할일 완료 토글
  const handleToggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
          completedAt: !todo.completed ? new Date().toISOString() : null,
        };
      }
      return todo;
    }));
  }, [setTodos]);

  // 폴더 추가
  const handleAddFolder = useCallback((folderData) => {
    const newFolder = {
      id: Date.now().toString(),
      ...folderData,
    };
    setFolders(prev => [...prev, newFolder]);
  }, [setFolders]);

  // 폴더 수정
  const handleEditFolder = useCallback((id, updates) => {
    setFolders(prev => prev.map(folder =>
      folder.id === id ? { ...folder, ...updates } : folder
    ));
  }, [setFolders]);

  // 폴더 삭제
  const handleDeleteFolder = useCallback((id) => {
    setFolders(prev => prev.filter(folder => folder.id !== id));
    // 해당 폴더의 할일들을 미분류로 변경
    setTodos(prev => prev.map(todo =>
      todo.folderId === id ? { ...todo, folderId: null } : todo
    ));
    if (activeFolder === id) {
      setActiveFolder(null);
    }
  }, [setFolders, setTodos, activeFolder]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">✓</span>
            할일 관리
          </h1>
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="main-content">
          <Dashboard todos={todos} folders={folders} />
          
          <CategoryTabs 
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            todoCounts={todoCounts}
          />

          <div className="content-layout">
            <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
              <FolderSidebar
                folders={folders}
                activeFolder={activeFolder}
                onFolderChange={(id) => {
                  setActiveFolder(id);
                  setIsSidebarOpen(false);
                }}
                onAddFolder={handleAddFolder}
                onEditFolder={handleEditFolder}
                onDeleteFolder={handleDeleteFolder}
                todoCounts={folderCounts}
              />
            </div>

            <div className="todo-section">
              <AddTodoForm 
                folders={folders}
                onAdd={handleAddTodo}
                activeFolder={activeFolder}
              />
              
              <TodoList
                todos={todos}
                folders={folders}
                activeCategory={activeCategory}
                activeFolder={activeFolder}
                onToggle={handleToggleTodo}
                onEdit={handleEditTodo}
                onDelete={handleDeleteTodo}
              />
            </div>
          </div>
        </div>
      </main>

      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
