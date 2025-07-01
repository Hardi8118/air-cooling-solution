import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    async function fetchUsers() {
      const snapshot = await getDocs(collection(db, 'users'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
    }
    fetchUsers();
  }, []);

  const filtered = roleFilter === 'all'
    ? users
    : users.filter((u) => u.role === roleFilter);

  return (
    <div style={{ padding: 20 }}>
      <h2>Daftar Pengguna & Teknisi</h2>

      <div style={{ marginBottom: 15 }}>
        <label>Filter Role: </label>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">Semua</option>
          <option value="user">Pengguna</option>
          <option value="technician">Teknisi</option>
        </select>
      </div>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Rating</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.role === 'technician' ? (u.rating || 0).toFixed(1) : '-'}</td>
              <td>{u.isActive ? 'Aktif' : 'Offline'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
