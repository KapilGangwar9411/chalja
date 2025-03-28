import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../firebase';
import '../assets/styles.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminType, setAdminType] = useState('admin'); // 'admin' or 'superadmin'
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();

  // Check if super admin exists
  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          const users = snapshot.val();
          const superAdminExists = Object.values(users).some(user => user.isSuperAdmin);
          
          if (!superAdminExists) {
            setError('No super admin exists. The first account created as super admin will be automatically approved.');
          }
        } else {
          setError('No super admin exists. The first account created as super admin will be automatically approved.');
        }
      } catch (error) {
        console.error('Error checking super admin:', error);
      }
    };

    checkSuperAdmin();
  }, []);

  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }
    if (isSignup && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      
      // First try to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      // Then check user data in database
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (adminType === 'superadmin' && userData.isSuperAdmin) {
          // Super admin login successful
          navigate('/admin/super-dashboard');
        } else if (adminType === 'admin' && userData.isAdmin) {
          // Regular admin login successful
          navigate('/admin/dashboard');
        } else {
          await auth.signOut();
          setError(`Access denied. ${adminType === 'superadmin' ? 'Super Admin' : 'Admin'} privileges required.`);
        }
      } else {
        // If user exists in auth but not in database, delete the auth user
        await deleteUser(userCredential.user);
        setError('Account not properly set up. Please sign up again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up first.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setShowForgotPassword(false);
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.message.includes('auth/user-not-found') 
        ? 'No account found with this email address' 
        : 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      
      // Create new user directly without checking first
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      // Check for existing super admin
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      const isFirstSuperAdmin = !snapshot.exists() || 
        !Object.values(snapshot.val() || {}).some(user => user.isSuperAdmin);
      
      // Prepare user data
      const userData = {
        email: email,
        isAdmin: adminType === 'admin',
        isSuperAdmin: adminType === 'superadmin',
        isApproved: adminType === 'superadmin' ? isFirstSuperAdmin : false,
        createdAt: new Date().toISOString()
      };

      // Save user data to database
      const userRef = ref(database, `users/${uid}`);
      await set(userRef, userData);

      setIsSignup(false);
      if (adminType === 'superadmin' && isFirstSuperAdmin) {
        setError('Super admin account created successfully. You can now log in.');
      } else {
        setError('Account created successfully. Please wait for approval from a super admin.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please try logging in instead.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else if (error.message.includes('PERMISSION_DENIED')) {
        setError('Permission denied. Please check your database rules.');
      } else {
        setError('An error occurred during signup. Please try again.');
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
        <h1>{isSignup ? 'Admin Sign Up' : 'Admin Login'}</h1>
        
        {error && <div className="error-message">{error}</div>}
        {resetEmailSent && (
          <div className="success-message">
            Password reset email sent! Please check your inbox.
          </div>
        )}

        <div className="admin-type-selector">
          <button
            className={`admin-type-button ${adminType === 'admin' ? 'active' : ''}`}
            onClick={() => setAdminType('admin')}
            type="button"
          >
            Admin
          </button>
          <button
            className={`admin-type-button ${adminType === 'superadmin' ? 'active' : ''}`}
            onClick={() => setAdminType('superadmin')}
            type="button"
          >
            Super Admin
          </button>
        </div>
        
        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword}>
            <div className="input-group">
              <input
                type="email"
                className="admin-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="admin-button"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
            <div className="auth-links">
              <span className="auth-link" onClick={() => {
                setShowForgotPassword(false);
                setResetEmailSent(false);
                setError('');
              }}>
                Back to Login
              </span>
            </div>
          </form>
        ) : (
          <form onSubmit={isSignup ? handleSignup : handleLogin}>
            <div className="input-group">
              <input
                type="email"
                className="admin-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <input
                type="password"
                className="admin-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {isSignup && (
              <div className="input-group">
                <input
                  type="password"
                  className="admin-input"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
            
            <button 
              type="submit" 
              className="admin-button"
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isSignup ? `Sign Up as ${adminType === 'superadmin' ? 'Super Admin' : 'Admin'}` : 'Login')}
            </button>
          </form>
        )}
        
        <div className="auth-links">
          {!showForgotPassword && (
            <>
              {isSignup ? (
                <>Already have an account?
                  <span className="auth-link" onClick={() => {
                    setIsSignup(false);
                    setError('');
                  }}>
                    Login
                  </span>
                </>
              ) : (
                <>
                  Don't have an account?
                  <span className="auth-link" onClick={() => {
                    setIsSignup(true);
                    setError('');
                  }}>
                    Sign Up
                  </span>
                </>
              )}
              <div className="forgot-password-link">
                <span className="auth-link" onClick={() => {
                  setShowForgotPassword(true);
                  setError('');
                }}>
                  Forgot Password?
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 