import { useState } from 'react';
import { formatRelativeDate, formatTime, getTimeRemaining, isPast, isToday } from '../utils/dateUtils';
import './TodoItem.css';

const TodoItem = ({ todo, folders, onToggle, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    memo: todo.memo,
    dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
    dueTime: todo.dueDate ? formatTime(todo.dueDate) : '',
    folderId: todo.folderId,
  });

  const folder = folders.find(f => f.id === todo.folderId);
  const isOverdue = todo.dueDate && isPast(todo.dueDate) && !todo.completed;
  const isDueToday = todo.dueDate && isToday(todo.dueDate);

  const handleEditSubmit = () => {
    const dueDate = editData.dueDate && editData.dueTime
      ? `${editData.dueDate}T${editData.dueTime}`
      : editData.dueDate
        ? `${editData.dueDate}T23:59`
        : null;

    onEdit(todo.id, {
      title: editData.title,
      memo: editData.memo,
      dueDate,
      folderId: editData.folderId,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: todo.title,
      memo: todo.memo,
      dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
      dueTime: todo.dueDate ? formatTime(todo.dueDate) : '',
      folderId: todo.folderId,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="todo-item editing scale-in">
        <div className="edit-form">
          <input
            type="text"
            className="edit-title"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            placeholder="할 일 제목"
            autoFocus
          />
          <textarea
            className="edit-memo"
            value={editData.memo}
            onChange={(e) => setEditData({ ...editData, memo: e.target.value })}
            placeholder="메모 (선택사항)"
            rows={2}
          />
          <div className="edit-row">
            <div className="edit-field">
              <label>날짜</label>
              <input
                type="date"
                value={editData.dueDate}
                onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
              />
            </div>
            <div className="edit-field">
              <label>시간</label>
              <input
                type="time"
                value={editData.dueTime}
                onChange={(e) => setEditData({ ...editData, dueTime: e.target.value })}
              />
            </div>
            <div className="edit-field">
              <label>폴더</label>
              <select
                value={editData.folderId || ''}
                onChange={(e) => setEditData({ ...editData, folderId: e.target.value || null })}
              >
                <option value="">미분류</option>
                {folders.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="edit-actions">
            <button className="cancel-btn" onClick={handleCancel}>취소</button>
            <button className="save-btn" onClick={handleEditSubmit}>저장</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${isDueToday && !todo.completed ? 'due-today' : ''}`}
      style={{ '--folder-color': folder?.color || 'var(--color-other)' }}
    >
      <div className="todo-main" onClick={() => setIsExpanded(!isExpanded)}>
        <button 
          className={`checkbox ${todo.completed ? 'checked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(todo.id);
          }}
        >
          {todo.completed && <span className="checkmark">✓</span>}
        </button>
        
        <div className="todo-content">
          <div className="todo-header">
            <span className="todo-title">{todo.title}</span>
            {folder && (
              <span 
                className="todo-folder-badge"
                style={{ backgroundColor: folder.color }}
              >
                {folder.name}
              </span>
            )}
          </div>
          
          {todo.dueDate && (
            <div className="todo-meta">
              <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                {formatRelativeDate(todo.dueDate)}
                {todo.dueDate.includes('T') && ` ${formatTime(todo.dueDate)}`}
              </span>
              {!todo.completed && (
                <span className={`time-remaining ${isOverdue ? 'overdue' : ''}`}>
                  {getTimeRemaining(todo.dueDate)}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="todo-actions">
          <button 
            className="action-btn edit"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            title="수정"
          >
            ✎
          </button>
          <button 
            className="action-btn delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(todo.id);
            }}
            title="삭제"
          >
            🗑
          </button>
        </div>
      </div>

      {isExpanded && todo.memo && (
        <div className="todo-expanded fade-in">
          <p className="todo-memo">{todo.memo}</p>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
