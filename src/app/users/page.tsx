"use client"
import { useState } from 'react';
import axios from 'axios';
import  router  from 'next/router';
import { useSearchParams } from 'next/navigation';

function Users() {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);
const searchParam = useSearchParams()
console.log(searchParam);

  const addUser = async () => {
    const data = {
      username: inputText,
    };
    try {
      const response = await axios.post('/api/users', data);
  
      if (response.data.success) {
        const userId = response.data.user?._id;
        router.push(`/todos/${userId}`); // Redirect to todos with userId
      } else {
        setError(response.data.message || 'Error creating user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Error creating user');
    } finally {
      setInputText('');
    }
  };
  

  return (
    <div className="flex flex-col items-center gap-8 pt-8 pb-32 bg-violet-200">
      <div className="text-2xl">Users</div>
      <div className="flex gap-2">
        <input
          className="text-md rounded-md shadow-md"
          type="text"
          placeholder="Add your name"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          onClick={addUser}
          className="text-md shadow-md bg-green-600 text-white hover:bg-green-400 px-3 py-1 rounded-md"
        >
          Add
        </button>
        {error && <div className="text-red-500">{error}</div>}
      </div>
    </div>
  );
}

export default Users;
