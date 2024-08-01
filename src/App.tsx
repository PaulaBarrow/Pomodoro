import React from 'react';
import Timer from './components/timer';
import TodoList from './components/todo';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="timer-container mb-8">
        <Timer />
      </div>
      <div className="todo-list-container">
        <TodoList />
      </div>
    </div>
  );
};

export default App;
