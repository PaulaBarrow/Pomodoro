import React, { useState } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<string>('');


    // adding a new task to the task list.
    const handleAddTask = () => {
        if (newTask.trim() === '') return;
    
        setTasks((prevTasks) => [
            ...prevTasks,
            { id: Date.now(), text: newTask, completed: false },
        ]);
        setNewTask('');
    };

     // toggling the completion status of a task.
    const handleToggleTask = (id: number) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };


    // deleting a task from the task list.
    const handleDeleteTask = (id: number) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-7 max-w-md w-96">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">To-Do List</h2>
            <div className="flex items-center mb-4">
                <input
                    type="text"
                    className="flex-grow p-2 border rounded-lg mr-2"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task"
                />

                <button className="px-4 py-2 bg-green-500 text-white rounded-lg" onClick={handleAddTask}>
                    Add
                </button>
            </div>
        
            <ul>
                {tasks.map((task) => (
                    <li key={task.id} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleTask(task.id)}
                            className="mr-2"
                        />

                        <span className={`flex-grow ${task.completed ? 'line-through' : ''}`}>
                            {task.text}
                        </span>

                        <button
                            className="px-2 py-1 bg-red-500 text-white rounded-lg"
                            onClick={() => handleDeleteTask(task.id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
