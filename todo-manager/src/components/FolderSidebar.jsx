import { useState } from 'react';
import './FolderSidebar.css';

const FolderSidebar = ({ 
  folders, 
  activeFolder, 
  onFolderChange, 
  onAddFolder, 
  onEditFolder, 
  onDeleteFolder,
  todoCounts 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#FFB5BA');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const colorOptions = [
    { value: '#FFB5BA', label: '핑크' },
    { value: '#B5D8FF', label: '블루' },
    { value: '#C5E8B7', label: '그린' },
    { value: '#E8D5B7', label: '베이지' },
    { value: '#D5B8E8', label: '퍼플' },
    { value: '#FFE4B5', label: '오렌지' },
  ];

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      onAddFolder({
        name: newFolderName.trim(),
        color: newFolderColor,
      });
      setNewFolderName('');
      setNewFolderColor('#FFB5BA');
      setIsAdding(false);
    }
  };

  const handleEditSubmit = (id) => {
    if (editName.trim()) {
      onEditFolder(id, { name: editName.trim() });
      setEditingId(null);
      setEditName('');
    }
  };

  const startEditing = (folder) => {
    setEditingId(folder.id);
    setEditName(folder.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <aside className="folder-sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">
          <span className="folder-icon">📁</span>
          폴더
        </h3>
        <button 
          className="add-folder-btn"
          onClick={() => setIsAdding(!isAdding)}
          title="폴더 추가"
        >
          {isAdding ? '✕' : '+'}
        </button>
      </div>

      {isAdding && (
        <div className="add-folder-form fade-in">
          <input
            type="text"
            placeholder="폴더 이름"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddFolder()}
            autoFocus
          />
          <div className="color-picker">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                className={`color-option ${newFolderColor === color.value ? 'active' : ''}`}
                style={{ backgroundColor: color.value }}
                onClick={() => setNewFolderColor(color.value)}
                title={color.label}
              />
            ))}
          </div>
          <button className="submit-btn" onClick={handleAddFolder}>
            추가
          </button>
        </div>
      )}

      <div className="folder-list">
        <button
          className={`folder-item ${activeFolder === null ? 'active' : ''}`}
          onClick={() => onFolderChange(null)}
        >
          <span className="folder-color-dot" style={{ backgroundColor: 'var(--color-text-muted)' }} />
          <span className="folder-name">전체</span>
          <span className="folder-count">{todoCounts.total || 0}</span>
        </button>

        {folders.map((folder) => (
          <div key={folder.id} className="folder-item-wrapper">
            {editingId === folder.id ? (
              <div className="folder-edit-form fade-in">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEditSubmit(folder.id)}
                  autoFocus
                />
                <div className="edit-actions">
                  <button className="save-btn" onClick={() => handleEditSubmit(folder.id)}>✓</button>
                  <button className="cancel-btn" onClick={cancelEdit}>✕</button>
                </div>
              </div>
            ) : (
              <button
                className={`folder-item ${activeFolder === folder.id ? 'active' : ''}`}
                onClick={() => onFolderChange(folder.id)}
              >
                <span className="folder-color-dot" style={{ backgroundColor: folder.color }} />
                <span className="folder-name">{folder.name}</span>
                <span className="folder-count">{todoCounts[folder.id] || 0}</span>
                <div className="folder-actions" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="action-btn edit"
                    onClick={() => startEditing(folder)}
                    title="수정"
                  >
                    ✎
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => onDeleteFolder(folder.id)}
                    title="삭제"
                  >
                    🗑
                  </button>
                </div>
              </button>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default FolderSidebar;
