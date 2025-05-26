import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  // Load from LocalStorage or API
  useEffect(() => {
    const localData = localStorage.getItem('users');
    if (localData) {
      setUsers(JSON.parse(localData));
    } else {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
      localStorage.setItem('users', JSON.stringify(res.data));
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId !== null) {
      const updated = users.map(user =>
        user.id === editingId ? { ...user, ...formData } : user
      );
      setUsers(updated);
      localStorage.setItem('users', JSON.stringify(updated));
      setEditingId(null);
    } else {
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email
      };
      const updated = [...users, newUser];
      setUsers(updated);
      localStorage.setItem('users', JSON.stringify(updated));
    }

    setFormData({ name: '', email: '' });
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email });
    setEditingId(user.id);
  };

  const handleDelete = (id) => {
    const filtered = users.filter(user => user.id !== id);
    setUsers(filtered);
    localStorage.setItem('users', JSON.stringify(filtered));
  };

  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>📝 User Management System</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '20px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '10px',
          backgroundColor: '#f9f9f9'
        }}
      >
        <input
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: editingId ? '#f39c12' : '#2ecc71',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {editingId ? 'Update User' : 'Add User'}
        </button>
      </form>

      <div>
        {users.map(user => (
          <div
            key={user.id}
            style={{
              marginBottom: '15px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '10px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ margin: '0 0 5px' }}>{user.name}</h3>
            <p style={{ margin: 0 }}>{user.email}</p>
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => handleEdit(user)}
                style={{
                  marginRight: '10px',
                  padding: '6px 12px',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: '#3498db',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
