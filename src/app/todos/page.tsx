"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { getServerSideProps } from 'next';
import { connect } from '@/app/dbConfig/db'; 
import Todo from '@/app/models/todo';
interface Todo {
  id: string;
  task: string;
  completed: boolean;
}

interface User {
  _id: string;
  username: string;
}
export async function getServerSideProps(context) {
  const { userId } = context.query; // Extract userId from query params

  if (!userId) {
    return { notFound: true }; // Handle missing userId
  }

  try {
    await connect(); // Ensure database connection

    const todos = await Todo.find({ user: userId }).populate('user', 'username'); // Fetch todos and populate user information

    return { props: { todos } };
  } catch (error) {
    console.error('Error fetching todos:', error);
    return { props: { error: 'Error fetching todos' } };
  }
}

function Todos({ userId }: { userId: string }  ) {
  const [inputText, setInputText] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParam = useSearchParams()
  console.log(searchParam);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Error fetching user');
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`/api/todos?userId=${userId}`); // New URL and query parameter
        setTodos(response.data.todos);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
  
    if (userId) { // Fetch todos only if userId is available
      fetchTodos();
    }
  }, [userId]);

  const addTodo = async () => {
    if (inputText.trim() !== '') {
      const data = {
        task: inputText,
        userId: userId,
      };

      try {
        const resp = await axios.post('/api/todos', data);
        setTodos([...todos, resp.data.savedTodo]);
        setInputText('');
      } catch (error) {
        console.error('Error adding todo:', error);
        setError('Error adding todo');
      }
    }
  };

  const toggleTodoCompletion = async (todoId: string, completed: boolean) => {
    try {
      const resp = await axios.put(`/api/todos/${todoId}`, { completed });
      const updatedTodos = todos.map(todo =>
        todo.id === todoId ? { ...todo, completed } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error toggling todo completion:', error);
      setError('Error toggling todo completion');
    }
  };

  const deleteTodo = async (todoId: string) => {
    try {
      await axios.delete(`/api/todos/${todoId}`);
      const updatedTodos = todos.filter(todo => todo.id !== todoId);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Error deleting todo');
    }
  };

  return (
    <div className='flex flex-col items-center gap-8 pt-8 pb-32 bg-violet-200'>
      <div className='text-2xl'>
        {user ? `Todos for ${user.username}` : 'Todos'}
      </div>
      <div className='flex gap-2'>
        <input
          className='text-md rounded-md shadow-md'
          type='text'
          placeholder='Add a Todo'
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          onClick={addTodo}
          className='text-md shadow-md bg-green-800 text-white hover:bg-green-400 px-3 py-1 rounded-md'>
          Add
        </button>
        <button
          onClick={() => setTodos([])}
          className='text-md shadow-md bg-gray-800 text-white hover:bg-gray-400 px-3 py-1 rounded-md'>
          Clear
        </button>
      </div>
      <div className='w-5/6 flex flex-col gap-2'>
        {todos.map((todo, index) => (
          <div key={todo.id} className='flex justify-between items-center p-2 rounded-lg bg-gray-700 shadow-lg'>
            <div className='flex gap-2 mt-3'>
              <input
                type='checkbox'
                checked={todo.completed}
                onChange={() => toggleTodoCompletion(todo.id, !todo.completed)}
              />
              <div className='text-lg'>{todo.task}</div>
              <div className='flex gap-3'>
                <button
                  className='text-md shadow-md bg-violet-800 text-white hover:bg-violet-400 px-2 rounded-md'
                  onClick={() => editTodo(todo.id)}>
                  Edit (optional)
                </button>
                <button
                  className='text-md shadow-md bg-red-600 text-white hover:bg-red-300 px-2 rounded-md'
                  onClick={() => deleteTodo(todo.id)}>
                  Delete (optional)
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {error && <div className='text-red-500'>{error}</div>}
    </div>
  );
}

export default Todos;
