import { useState } from 'react';
import './AddTodoForm.css';

const AddTodoForm = ({ folders, onAdd, activeFolder }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    memo: '',
    dueDate: '',
    dueTime: '',
    folderId: activeFolder || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    const dueDate = formData.dueDate && formData.dueTime
      ? `${formData.dueDate}T${formData.dueTime}`
      : formData.dueDate
        ? `${formData.dueDate}T23:59`
        : null;

    onAdd({
      title: formData.title.trim(),
      memo: formData.memo.trim(),
      dueDate,
      folderId: formData.folderId || null,
    });

    setFormData({
      title: '',
      memo: '',
      dueDate: '',
      dueTime: '',
      folderId: activeFolder || '',
    });
    setIsExpanded(false);
  };

  const handleQuickAdd = (e) => {
    if (e.key === 'Enter' && !isExpanded && formData.title.trim()) {
      e.preventDefault();
      onAdd({
        title: formData.title.trim(),
        memo: '',
        dueDate: null,
        folderId: activeFolder || null,
      });
      setFormData({ ...formData, title: '' });
    }
  };

  return (
    <div className={`add-todo-form ${isExpanded ? 'expanded' : ''}`}>
      <form onSubmit={handleSubmit}>
        <div className="quick-input-row">
          <span className="add-icon">+</span>
          <input
            type="text"
            className="quick-input"
            placeholder="새로운 할 일 추가하기..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onKeyPress={handleQuickAdd}
            onFocus={() => setIsExpanded(true)}
          />
          {!isExpanded && formData.title && (
            <button type="submit" className="quick-add-btn">
              추가
            </button>
          )}
        </div>

        {isExpanded && (
          <div className="expanded-form fade-in">
            <textarea
              className="memo-input"
              placeholder="메모 (선택사항)"
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              rows={2}
            />

            <div className="form-row">
              <div className="form-field">
                <label>
                  <span className="field-icon">📅</span>
                  날짜
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>
                  <span className="field-icon">🕐</span>
                  시간
                </label>
                <input
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>
                  <span className="field-icon">📁</span>
                  폴더
                </label>
                <select
                  value={formData.folderId}
                  onChange={(e) => setFormData({ ...formData, folderId: e.target.value })}
                >
                  <option value="">미분류</option>
                  {folders.map(folder => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setIsExpanded(false);
                  setFormData({
                    title: '',
                    memo: '',
                    dueDate: '',
                    dueTime: '',
                    folderId: activeFolder || '',
                  });
                }}
              >
                취소
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={!formData.title.trim()}
              >
                할 일 추가
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddTodoForm;
