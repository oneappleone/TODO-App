import { useMemo } from 'react';
import TodoItem from './TodoItem';
import { isToday, isThisWeek, isFuture } from '../utils/dateUtils';
import './TodoList.css';

const TodoList = ({ 
  todos, 
  folders, 
  activeCategory, 
  activeFolder,
  onToggle, 
  onEdit, 
  onDelete 
}) => {
  const filteredTodos = useMemo(() => {
    let filtered = [...todos];

    // 폴더 필터링
    if (activeFolder !== null) {
      filtered = filtered.filter(todo => todo.folderId === activeFolder);
    }

    // 카테고리 필터링
    switch (activeCategory) {
      case 'today':
        filtered = filtered.filter(todo => 
          !todo.completed && todo.dueDate && isToday(todo.dueDate)
        );
        break;
      case 'week':
        filtered = filtered.filter(todo => 
          !todo.completed && todo.dueDate && isThisWeek(todo.dueDate) && !isToday(todo.dueDate)
        );
        break;
      case 'later':
        filtered = filtered.filter(todo => 
          !todo.completed && (!todo.dueDate || isFuture(todo.dueDate))
        );
        break;
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
      case 'all':
      default:
        filtered = filtered.filter(todo => !todo.completed);
        break;
    }

    // 정렬: 기한 있는 것 먼저, 그 다음 생성일 기준
    return filtered.sort((a, b) => {
      if (activeCategory === 'completed') {
        return new Date(b.completedAt) - new Date(a.completedAt);
      }
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [todos, activeCategory, activeFolder]);

  const getCategoryMessage = () => {
    switch (activeCategory) {
      case 'today':
        return { icon: '☀️', text: '오늘 할 일이 없습니다', subtext: '새로운 할 일을 추가해보세요!' };
      case 'week':
        return { icon: '📅', text: '이번 주 할 일이 없습니다', subtext: '여유로운 한 주네요!' };
      case 'later':
        return { icon: '🕐', text: '나중에 할 일이 없습니다', subtext: '모든 일정이 정해져 있네요!' };
      case 'completed':
        return { icon: '✨', text: '완료된 할 일이 없습니다', subtext: '할 일을 완료하면 여기에 표시됩니다' };
      default:
        return { icon: '📝', text: '할 일이 없습니다', subtext: '새로운 할 일을 추가해보세요!' };
    }
  };

  const message = getCategoryMessage();

  return (
    <div className="todo-list">
      {filteredTodos.length === 0 ? (
        <div className="empty-list fade-in">
          <span className="empty-icon">{message.icon}</span>
          <h4 className="empty-text">{message.text}</h4>
          <p className="empty-subtext">{message.subtext}</p>
        </div>
      ) : (
        <div className="todo-items">
          {filteredTodos.map((todo, index) => (
            <div 
              key={todo.id} 
              className="todo-item-wrapper fade-in"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <TodoItem
                todo={todo}
                folders={folders}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
