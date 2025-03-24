import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../firebase/config';
import '../assets/styles.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      console.log('Attempting to create user with email:', email);
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created successfully:', user.uid);

      // Store additional user data in Realtime Database
      console.log('Storing user data in database...');
      await set(ref(database, `users/${user.uid}`), {
        email: user.email,
        approved: false,
        createdAt: new Date().toISOString()
      });
      console.log('User data stored successfully');

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 3000);
      
    } catch (error) {
      console.error('Detailed signup error:', error);
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address format');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        default:
          setError(`Failed to create account: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <button className="back-button" onClick={() => navigate('/')}>
        Back to Home
      </button>
      <div className="admin-login-box">
        <h1>Sign Up</h1>
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            Account created successfully! Please wait for admin approval.
            Redirecting to login page...
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="login-button"
            disabled={loading || success}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
          <div className="auth-links">
            Already have an account?{' '}
            <span onClick={() => navigate('/admin')} className="auth-link">
              Login here
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup; 