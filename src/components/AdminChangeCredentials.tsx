import React, { useState } from 'react';

interface AdminChangeCredentialsProps {
  token: string;
  onSuccess?: () => void;
}

export const AdminChangeCredentials: React.FC<AdminChangeCredentialsProps> = ({ token, onSuccess }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/change-credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newUsername: newUsername || undefined, newPassword: newPassword || undefined })
      });
      await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setError('Das alte Passwort ist falsch.');
        } else if (res.status === 404) {
          setError('Admin-Benutzer nicht gefunden.');
        } else {
          setError('Fehler beim Ändern der Daten. Bitte versuchen Sie es erneut.');
        }
      } else {
        setSuccess('Daten erfolgreich geändert!');
        setOldPassword('');
        setNewUsername('');
        setNewPassword('');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError('Serverfehler. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-6 text-center">Admin-Daten ändern</h2>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{success}</div>}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Altes Passwort <span className="text-red-500">*</span></label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Neuer Benutzername</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={newUsername}
          onChange={e => setNewUsername(e.target.value)}
          placeholder="(optional)"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium">Neues Passwort</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="(optional)"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        disabled={loading}
      >
        {loading ? 'Ändern...' : 'Ändern'}
      </button>
    </form>
  );
}; 