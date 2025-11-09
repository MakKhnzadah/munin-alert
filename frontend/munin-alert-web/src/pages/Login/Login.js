import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';
import LogoShield from '../../assets/images/LogoShield.svg';

/**
 * Login Component
 * 
 * Handles user authentication and login
 */
const Login = () => {
  const [identifier, setIdentifier] = useState(''); // Username or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showForgotUsername, setShowForgotUsername] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotResult, setForgotResult] = useState(null);
  const [forgotError, setForgotError] = useState(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  /**
   * Handles form submission and user authentication
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Simple validation
    if (!identifier || !password) {
      setError('Please enter both identifier and password');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const success = await login(identifier, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Login failed. Please check your credentials.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid username/email or password');
      setIsSubmitting(false);
    }
  };

  const handleForgotUsername = async (e) => {
    e.preventDefault();
    setForgotError(null);
    setForgotResult(null);
    if (!forgotEmail) {
      setForgotError('Please enter your email.');
      return;
    }
    try {
      setForgotLoading(true);
      const res = await fetch('/api/auth/forgot-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Unable to retrieve username.');
      }
      const data = await res.json();
      setForgotResult(`Your username is: ${data.username}`);
    } catch (err) {
      setForgotError(err.message || 'Unable to retrieve username.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-topBrand">
        <img src={LogoShield} alt="Munin Alert" />
        <div className="brand-text">MUNIN ALERT</div>
      </div>

      <div className="login-card">
        <h2 className="card-title">Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="identifier">Username or Email</label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Your username or email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Value"
              required
            />
          </div>

          <div className="forgot-wrap" style={{display:'flex', justifyContent:'space-between'}}>
            <a href="#" className="forgot-link">Forgot password?</a>
            <button type="button" className="forgot-link" onClick={() => setShowForgotUsername(v => !v)} style={{background:'none', border:'none', padding:0, cursor:'pointer'}}>
              {showForgotUsername ? 'Hide forgot username' : 'Forgot username?'}
            </button>
          </div>

          {showForgotUsername && (
            <div className="forgot-username-card" style={{marginTop:'10px', padding:'12px', border:'1px solid #eee', borderRadius:'10px'}}>
              <form onSubmit={handleForgotUsername}>
                <label htmlFor="forgotEmail" style={{display:'block', marginBottom:'6px'}}>Enter your email</label>
                <input
                  type="email"
                  id="forgotEmail"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
                <button type="submit" className="btn-login" style={{marginTop:'10px'}} disabled={forgotLoading}>
                  {forgotLoading ? 'Checking…' : 'Retrieve username'}
                </button>
              </form>
              {forgotResult && <div className="alert alert-success" style={{marginTop:'8px'}}>{forgotResult}</div>}
              {forgotError && <div className="alert alert-danger" style={{marginTop:'8px'}}>{forgotError}</div>}
            </div>
          )}

          <button
            type="submit"
            className="btn-login"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        

    {/* <div className="alt-sep">-or-</div>

        <div className="social-row" aria-label="Social login options">
         <button className="social-btn" title="Login with Google" aria-label="Google">G</button>
         <button className="social-btn" title="Login with Facebook" aria-label="Facebook">f</button>
         <button className="social-btn" title="Login with Apple" aria-label="Apple"></button>
        </div> */}

        <div className="login-footer">
          <p>Dont have an account? <a href="/register">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
