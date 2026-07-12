/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Shield } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'register' && !name) {
      setError('Please provide your full name.');
      return;
    }

    // Load existing users from localStorage
    const storedUsersJson = localStorage.getItem('fm_users');
    const storedUsers: User[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];

    if (mode === 'register') {
      // Check if user already exists
      const userExists = storedUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        setError('An account with this email already exists.');
        return;
      }

      // Assign role. Only the specific owner email gets ADMIN.
      const isAdmin = email.trim().toLowerCase() === 'fahimmd6986@gmail.com';
      const newUser: User = {
        id: 'u_' + Date.now(),
        email: email.trim().toLowerCase(),
        name: name.trim(),
        role: isAdmin ? 'Admin' : 'Customer',
        createdAt: new Date().toISOString()
      };

      storedUsers.push(newUser);
      localStorage.setItem('fm_users', JSON.stringify(storedUsers));
      
      // Log audit
      const auditLogs = JSON.parse(localStorage.getItem('fm_audit_logs') || '[]');
      auditLogs.unshift({
        id: 'log_' + Date.now(),
        userEmail: newUser.email,
        action: 'USER_REGISTER',
        details: `Successfully registered new account. Assigned role: ${newUser.role}`,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS'
      });
      localStorage.setItem('fm_audit_logs', JSON.stringify(auditLogs));

      setSuccess(`Account registered successfully as a ${newUser.role}! Logging in...`);
      setTimeout(() => {
        onLoginSuccess(newUser);
        onClose();
      }, 1200);

    } else {
      // Login mode
      // Admin bypass simulation for owner email
      const isAdminEmail = email.trim().toLowerCase() === 'fahimmd6986@gmail.com';
      let targetUser = storedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!targetUser && isAdminEmail) {
        // Auto-seed admin user if not exists
        targetUser = {
          id: 'u_admin',
          email: 'fahimmd6986@gmail.com',
          name: 'Fahim (Owner)',
          role: 'Admin',
          createdAt: new Date().toISOString()
        };
        storedUsers.push(targetUser);
        localStorage.setItem('fm_users', JSON.stringify(storedUsers));
      }

      if (!targetUser) {
        // Log failed login audit
        const auditLogs = JSON.parse(localStorage.getItem('fm_audit_logs') || '[]');
        auditLogs.unshift({
          id: 'log_' + Date.now(),
          userEmail: email,
          action: 'USER_LOGIN_FAIL',
          details: 'Failed login attempt. Account does not exist.',
          timestamp: new Date().toISOString(),
          status: 'FAILED'
        });
        localStorage.setItem('fm_audit_logs', JSON.stringify(auditLogs));

        setError('No account found with this email. Please register.');
        return;
      }

      // Secure login simulation
      // In a simulation we accept standard passwords.
      // Log successful login audit
      const auditLogs = JSON.parse(localStorage.getItem('fm_audit_logs') || '[]');
      auditLogs.unshift({
        id: 'log_' + Date.now(),
        userEmail: targetUser.email,
        action: 'USER_LOGIN_SUCCESS',
        details: `Logged in successfully. Role: ${targetUser.role}`,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS'
      });
      localStorage.setItem('fm_audit_logs', JSON.stringify(auditLogs));

      setSuccess(`Welcome back, ${targetUser.name}!`);
      const userToSave = targetUser;
      setTimeout(() => {
        onLoginSuccess(userToSave);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div 
        id="auth-modal-card" 
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 dark:bg-slate-900 border border-amber-500/10"
      >
        <div className="relative p-6">
          <button 
            id="close-auth-modal"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          >
            <X size={20} />
          </button>

          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
              <Shield size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white font-sans tracking-tight">
              {mode === 'login' ? 'Welcome to FahimMart' : 'Create Luxury Account'}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {mode === 'login' ? 'Sign in to access premium curation & outfit syncing' : 'Join FahimMart for exclusive access'}
            </p>
          </div>

          {error && (
            <div id="auth-error-banner" className="mb-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
              {error}
            </div>
          )}

          {success && (
            <div id="auth-success-banner" className="mb-4 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <UserIcon size={16} />
                  </span>
                  <input
                    id="auth-register-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail size={16} />
                </span>
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
                  placeholder="name@example.com"
                />
              </div>
              {email.trim().toLowerCase() === 'fahimmd6986@gmail.com' && (
                <span className="mt-1 flex items-center gap-1 text-[10px] text-amber-600 font-semibold dark:text-amber-400">
                  <Shield size={10} /> Owner Admin Account Detected
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Secure Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              className="mt-2 w-full cursor-pointer rounded-lg bg-amber-500 py-3 text-sm font-semibold text-slate-950 shadow-md hover:bg-amber-400 transition-colors duration-200 active:scale-95"
            >
              {mode === 'login' ? 'Access FahimMart' : 'Register Secure Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button 
                  id="switch-to-register"
                  onClick={() => setMode('register')} 
                  className="font-semibold text-amber-600 hover:underline dark:text-amber-400 cursor-pointer"
                >
                  Register Now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button 
                  id="switch-to-login"
                  onClick={() => setMode('login')} 
                  className="font-semibold text-amber-600 hover:underline dark:text-amber-400 cursor-pointer"
                >
                  Login Here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
