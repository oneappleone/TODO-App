import { useMemo } from 'react';
import { isToday, formatKoreanDate, getTimeRemaining, isPast } from '../utils/dateUtils';
import './Dashboard.css';

const Dashboard = ({ todos, folders }) => {
  const today = new Date();
  
  const todayTodos = useMemo(() => {
    return todos
      .filter(todo => !todo.completed && todo.dueDate && isToday(todo.dueDate))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [todos]);

  const overdueTodos = useMemo(() => {
    return todos.filter(todo => 
      !todo.completed && 
      todo.dueDate && 
      isPast(todo.dueDate) && 
      !isToday(todo.dueDate)
    );
  }, [todos]);

  const completedToday = useMemo(() => {
    return todos.filter(todo => 
      todo.completed && 
      todo.completedAt && 
      isToday(todo.completedAt)
    ).length;
  }, [todos]);

  const totalPending = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const getFolderColor = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    return folder?.color || 'var(--color-other)';
  };

  const getFolderName = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    return folder?.name || '미분류';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="date-display">
          <span className="date-label">오늘</span>
          <h2 className="date-text">{formatKoreanDate(today)}</h2>
        </div>
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-value">{todayTodos.length}</span>
            <span className="stat-label">오늘 할 일</span>
          </div>
          <div className="stat-item">
            <span className="stat-value completed">{completedToday}</span>
            <span className="stat-label">완료</span>
          </div>
          <div className="stat-item">
            <span className="stat-value pending">{totalPending}</span>
            <span className="stat-label">남은 할 일</span>
          </div>
          {overdueTodos.length > 0 && (
            <div className="stat-item overdue">
              <span className="stat-value">{overdueTodos.length}</span>
              <span className="stat-label">기한 지남</span>
            </div>
          )}
        </div>
      </div>

      <div className="today-schedule">
        <h3 className="section-title">
          <span className="icon">📋</span>
          오늘의 일정
        </h3>
        
        {todayTodos.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🎉</span>
            <p>오늘 예정된 할 일이 없습니다!</p>
          </div>
        ) : (
          <div className="today-list">
            {todayTodos.map((todo, index) => (
              <div 
                key={todo.id} 
                className="today-item fade-in"
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  borderLeftColor: getFolderColor(todo.folderId)
                }}
              >
                <div className="today-item-content">
                  <span className="today-item-title">{todo.title}</span>
                  {todo.memo && (
                    <span className="today-item-memo">{todo.memo}</span>
                  )}
                </div>
                <div className="today-item-meta">
                  <span className="folder-badge" style={{ backgroundColor: getFolderColor(todo.folderId) }}>
                    {getFolderName(todo.folderId)}
                  </span>
                  <span className="time-remaining">
                    {getTimeRemaining(todo.dueDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {overdueTodos.length > 0 && (
        <div className="overdue-section">
          <h3 className="section-title warning">
            <span className="icon">⚠️</span>
            기한이 지난 할 일
          </h3>
          <div className="overdue-list">
            {overdueTodos.slice(0, 3).map((todo) => (
              <div 
                key={todo.id} 
                className="overdue-item"
                style={{ borderLeftColor: getFolderColor(todo.folderId) }}
              >
                <span className="overdue-item-title">{todo.title}</span>
                <span className="overdue-date">{formatKoreanDate(todo.dueDate)}</span>
              </div>
            ))}
            {overdueTodos.length > 3 && (
              <p className="more-items">+{overdueTodos.length - 3}개 더</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
