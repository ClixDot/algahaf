'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Lock,
  Mail,
  User,
  Key,
} from 'lucide-react';

interface AdminUserItem {
  _id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'editor';
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'superadmin' | 'editor'>('admin');
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (res.ok) {
        setAlert({
          type: 'success',
          message: `Administrator "${name}" created successfully.`,
        });
        setModalOpen(false);
        setName('');
        setEmail('');
        setPassword('');
        fetchUsers();
      } else {
        const err = await res.json();
        setAlert({ type: 'error', message: err.error || 'Failed to create user' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Error creating user' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (id: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to revoke access for "${userName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        setAlert({ type: 'success', message: `Administrator "${userName}" removed.` });
      } else {
        const err = await res.json();
        setAlert({ type: 'error', message: err.error || 'Failed to delete user' });
      }
    } catch (e: any) {
      setAlert({ type: 'error', message: e.message || 'Error deleting user' });
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <Users style={{ color: 'var(--admin-accent-gold)', width: 24, height: 24 }} />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0 }}>
              Admin Users & Permissions
            </h1>
          </div>
          <p style={{ color: 'var(--admin-text-muted)', margin: 0, fontSize: '0.9rem' }}>
            Manage authorized staff accounts, role levels (Super Admin, Admin, Editor), and console access credentials.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="admin-btn admin-btn-primary"
        >
          <Plus size={16} />
          Add Administrator
        </button>
      </div>

      {alert && (
        <div className={`admin-alert admin-alert-${alert.type}`}>
          <span>{alert.message}</span>
          <button
            onClick={() => setAlert(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            <Sparkles size={24} style={{ color: 'var(--admin-accent-gold)', animation: 'spin 1s infinite' }} />
            <p style={{ marginTop: '1rem' }}>Loading authorized users...</p>
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            No users found.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '35%' }}>Administrator</th>
                <th style={{ width: '25%' }}>Email Address</th>
                <th style={{ width: '20%' }}>Access Role</th>
                <th style={{ width: '20%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(201, 167, 121, 0.15)',
                          color: 'var(--admin-accent-gold)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                        }}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>
                          {u.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                          Joined {new Date(u.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{u.email}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        backgroundColor:
                          u.role === 'superadmin'
                            ? 'var(--admin-accent-gold-tint)'
                            : 'var(--admin-surface-muted)',
                        color:
                          u.role === 'superadmin'
                            ? 'var(--admin-accent-gold)'
                            : 'var(--admin-text-main)',
                        border:
                          u.role === 'superadmin'
                            ? '1px solid var(--admin-border-sand)'
                            : '1px solid var(--admin-border)',
                      }}
                    >
                      {u.role === 'superadmin' ? 'Super Admin' : u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteUser(u._id, u.name)}
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '0.4rem 0.65rem', fontSize: '0.75rem' }}
                      title="Revoke Admin Access"
                    >
                      <Trash2 size={13} />
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add User Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                borderBottom: '1px solid var(--admin-border-light)',
                paddingBottom: '1rem',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                Create Administrator
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--admin-text-muted)',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="admin-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Miller"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="admin-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="admin-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah@alghaf.ae"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="admin-label">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  className="admin-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters..."
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="admin-label">Access Level</label>
                <select
                  className="admin-select"
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                >
                  <option value="admin">Admin (Manage Pages, Media, Products & Enquiries)</option>
                  <option value="superadmin">Super Admin (Full Access & User Management)</option>
                  <option value="editor">Editor (Draft & Content Edits Only)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-btn admin-btn-primary"
                >
                  {saving ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
