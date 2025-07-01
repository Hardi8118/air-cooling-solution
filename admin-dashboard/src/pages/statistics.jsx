import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';

import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  TimeScale
);

export default function StatisticsPage() {
  const [statusData, setStatusData] = useState({ pending: 0, accepted: 0, done: 0 });
  const [activeTech, setActiveTech] = useState(0);
  const [monthlyData, setMonthlyData] = useState({});
  const [technicianData, setTechnicianData] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      const ordersSnap = await getDocs(collection(db, 'orders'));
      const usersSnap = await getDocs(collection(db, 'users'));

      let pending = 0, accepted = 0, done = 0;
      let monthlyCount = {};
      let technicianCount = {};
      let activeTechCount = 0;

      ordersSnap.forEach(doc => {
        const data = doc.data();
        const status = data.status;
        const createdAt = data.createdAt?.toDate();
        const techId = data.technicianId;

        // Hitung status
        if (status === 'pending') pending++;
        else if (status === 'accepted') accepted++;
        else if (status === 'done') done++;

        // Hitung order selesai per bulan
        if (status === 'done' && createdAt) {
          const month = format(createdAt, 'yyyy-MM');
          monthlyCount[month] = (monthlyCount[month] || 0) + 1;
        }

        // Hitung order per teknisi
        if (techId) {
          technicianCount[techId] = (technicianCount[techId] || 0) + 1;
        }
      });

      // Hitung teknisi aktif
      usersSnap.forEach(doc => {
        const user = doc.data();
        if (user.role === 'technician' && user.isActive) {
          activeTechCount++;
        }
      });

      setStatusData({ pending, accepted, done });
      setActiveTech(activeTechCount);
      setMonthlyData(monthlyCount);
      setTechnicianData(technicianCount);
    };

    fetchStats();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Statistik Sistem</h2>

      {/* Grafik Status Order */}
      <div style={{ maxWidth: 500, marginTop: 30 }}>
        <h4>Jumlah Order per Status</h4>
        <Bar
          data={{
            labels: ['Pending', 'Accepted', 'Done'],
            datasets: [{
              label: 'Jumlah Order',
              data: [statusData.pending, statusData.accepted, statusData.done],
              backgroundColor: ['orange', 'skyblue', 'green'],
            }]
          }}
        />
      </div>

      {/* Grafik Teknisi Aktif */}
      <div style={{ maxWidth: 400, marginTop: 50 }}>
        <h4>Teknisi Aktif</h4>
        <Pie
          data={{
            labels: ['Aktif', 'Tidak Aktif'],
            datasets: [{
              data: [activeTech, Math.max(0, 10 - activeTech)],
              backgroundColor: ['#28a745', '#ccc'],
            }]
          }}
        />
      </div>

      {/* Grafik Order per Bulan */}
      <div style={{ maxWidth: 700, marginTop: 50 }}>
        <h4>Order Selesai per Bulan</h4>
        <Line
          data={{
            labels: Object.keys(monthlyData),
            datasets: [{
              label: 'Order Selesai',
              data: Object.values(monthlyData),
              borderColor: 'blue',
              backgroundColor: 'rgba(30,144,255,0.2)',
              tension: 0.3,
              fill: true,
            }]
          }}
        />
      </div>

      {/* Grafik Order per Teknisi */}
      <div style={{ maxWidth: 700, marginTop: 50 }}>
        <h4>Jumlah Order per Teknisi (UID)</h4>
        <Bar
          data={{
            labels: Object.keys(technicianData),
            datasets: [{
              label: 'Jumlah Order',
              data: Object.values(technicianData),
              backgroundColor: 'green'
            }]
          }}
        />
      </div>
    </div>
  );
}
