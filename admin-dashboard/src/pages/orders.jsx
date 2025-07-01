import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { deleteDoc, doc } from 'firebase/firestore';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
const exportToCSV = () => {
  const csvData = orders.map((o) => ({
    ID: o.id,
    User: o.userId,
    Teknisi: o.technicianId || '-',
    Status: o.status,
    Jadwal: o.scheduledTime?.toDate?.().toLocaleString() || '-',
    Catatan: o.notes || '-',
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'data_orders.csv');
};
const handleDelete = async (id) => {
  if (!window.confirm('Yakin ingin menghapus order ini?')) return;
  await deleteDoc(doc(db, 'orders', id));
  fetchOrders();
};

  const fetchOrders = async () => {
    const snapshot = await getDocs(collection(db, 'orders'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setOrders(data);
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateDoc(doc(db, 'orders', id), {
      status: newStatus,
    });
    fetchOrders(); // refresh setelah update
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusOptions = ['pending', 'accepted', 'done'];

  return (
    <div style={{ padding: 20 }}>
      <h2>Data Order</h2>
        <button onClick={exportToCSV} style={{ marginBottom: 10 }}>⬇ Export ke CSV</button>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Status</th>
            <th>Waktu</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.userId}</td>
              <td>{o.status}</td>
              <td>{o.scheduledTime?.toDate?.().toLocaleString() || '-'}</td>
              <td>
  <select
    value={o.status}
    onChange={(e) => handleStatusChange(o.id, e.target.value)}
  >
    {statusOptions.map((opt) => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>
  <button onClick={() => handleDelete(o.id)} style={{ marginLeft: 10, backgroundColor: 'red', color: '#fff' }}>
    Hapus
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
