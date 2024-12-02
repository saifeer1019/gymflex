"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
    
export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
    });

    const handleRegister = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior 
        axios.post('/api/auth/register', form)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('/api/auth/login', form)
            .then(res => {
               console.log(res);
            })
    }

    const handleChange = (e) => {
        e.preventDefault();
        console.log('changed');
        console.log(e.target.name, e.target.value);
        console.log(form);
        setForm({ ...form, [e.target.name]: e.target.value });
    }
  return (<div>
{!isLogin && <form onSubmit={handleRegister}>
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
      <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <button type="submit">Register</button>
    </form>}
<button onClick={() => setIsLogin(!isLogin)}>Switch to {isLogin ? 'Login' : 'Register'}</button>
 {isLogin ? <form onSubmit={handleLogin}>
    <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
    <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
    <button type="submit">Login</button>
  </form> : null}

  </div>)

}
