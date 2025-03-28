import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { ref, set, get, query, orderByChild, equalTo } from 'firebase/database';
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
            setError('No super admin exists. Please contact system administrator.');
          }
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
        
        // Check if user is approved
        if (!userData.isApproved) {
          await auth.signOut();
          setError('Your account is pending approval from a super admin. Please wait for approval.');
          return;
        }

        // Check admin type and privileges
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
    setError('');
    setLoading(true);

    // Prevent super admin signup
    if (adminType === 'superadmin') {
      setError('Super admin accounts can only be created by existing super admins.');
      setLoading(false);
      return;
    }

    try {
      // Check if email already exists
      const usersRef = ref(database, 'users');
      const usersSnapshot = await get(usersRef);
      let emailExists = false;

      if (usersSnapshot.exists()) {
        usersSnapshot.forEach((userSnapshot) => {
          if (userSnapshot.val().email === email) {
            emailExists = true;
          }
        });
      }

      if (emailExists) {
        setError('Email already in use');
        setLoading(false);
        return;
      }

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user data object
      const userData = {
        email: email,
        isAdmin: true,
        isSuperAdmin: false,
        isApproved: false, // Always set to false for new admin signups
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser?.uid || null
      };

      // Save user data to database
      await set(ref(database, `users/${userCredential.user.uid}`), userData);

      // Show pending approval message
      setError('Admin account created successfully! Please wait for super admin approval.');
      setTimeout(() => {
        navigate('/admin-login');
      }, 2000);
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Email already in use');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else if (error.code === 'auth/operation-not-allowed') {
        setError('Operation not allowed. Please contact support.');
      } else {
        setError('Failed to create account. Please try again.');
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
            disabled={isSignup} // Disable super admin selection during signup
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
              {loading ? 'Please wait...' : (isSignup ? 'Sign Up as Admin' : 'Login')}
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