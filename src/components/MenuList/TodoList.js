import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredTodos, setFilteredTodos] = useState([])
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://3.35.22.206:8080/todo', {
      params: {
        date: selectedDate.toISOString().slice(0, 10)
      },
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    })
      .then(response => {
        setTodos(response.data);
        console.log(response);
      })
      .catch(error => {
        console.error(error);
      });
  }, [selectedDate]);
  
  useEffect(() => {
    setFilteredTodos(todos.filter(todo => {
      const todoDate = new Date(todo.dueDate);
      return (
        todoDate.getFullYear() === selectedDate.getFullYear() &&
        todoDate.getMonth() === selectedDate.getMonth() &&
        todoDate.getDate() === selectedDate.getDate()
      );
    }));
  }, [selectedDate, todos]);

  const handleDateChange = (amount) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + amount);
    setSelectedDate(newDate);
  };

  const createTodo = () => {
    console.log(selectedDate.toISOString().slice(0, 10));
    axios.post('http://3.35.22.206:8080/todo', {
      title: newTodo,
      completed: false,
      dueDate: selectedDate.toISOString().slice(0, 10)
    }, {
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    })
      .then(response => {
        setTodos(prevTodos => [...prevTodos, response.data]);
        setNewTodo('');
        console.log(response);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const toggleTodoCompletion = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed
        };
      }
      return todo;
    });

    axios.patch(`http://3.35.22.206:8080/todo/${id}`, {
      completed: !todos.find(todo => todo.id === id).completed
    }, {
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    })
      .then(() => {
        setTodos(updatedTodos);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const deleteTodo = (id) => {
    axios.delete(`http://3.35.22.206:8080/todo/${id}`, {
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    })
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        console.error(error);
      });
  };

  // 필터링된 할 일 목록
  

  return (
    <div className="todo-list">
      <h1>Todo List</h1>
      <div className="date-navigation">
        <button onClick={() => handleDateChange(-1)}>◀</button>
        <span>{selectedDate.toISOString().slice(0, 10)}</span>
        <button onClick={() => handleDateChange(1)}>▶</button>
      </div>
      <div className="add-todo">
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="할 일을 입력하세요"
        />
        <button onClick={createTodo}>추가</button>
      </div>
      <ul className="todos">
        {filteredTodos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodoCompletion(todo.id)}
            />
            <span className="todo-title">{todo.title}</span>
            {/* <span className="due-date">{todo.dueDate[0]}.{todo.dueDate[1]}.{todo.dueDate[2]}</span> */}
            <button onClick={() => deleteTodo(todo.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
