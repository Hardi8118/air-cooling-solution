// src/screens/ExportScreen.js
import React, { useEffect, useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import { auth, db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';

export default function ExportScreen() {
  const [orders, setOrders] = useState([]);
  const userId = auth.currentUser.uid;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => doc.data());
    setOrders(data);
  };

  const generatePDF = async () => {
    let htmlContent = `
      <h1>Laporan Pemesanan</h1>
      <table border="1" style="width:100%; border-collapse: collapse;">
        <tr>
          <th>Layanan</th>
          <th>Status</th>
          <th>Jadwal</th>
        </tr>
    `;

    orders.forEach((o) => {
      htmlContent += `
        <tr>
          <td>${o.serviceId}</td>
          <td>${o.status}</td>
          <td>${o.scheduledTime?.toDate().toLocaleString()}</td>
        </tr>
      `;
    });

    htmlContent += '</table>';

    const file = await RNHTMLtoPDF.convert({
      html: htmlContent,
      fileName: 'laporan_pemesanan',
      base64: false,
    });

    await Sharing.shareAsync(file.filePath);
  };

  const generateCSV = async () => {
    const csv = Papa.unparse(
      orders.map((o) => ({
        Layanan: o.serviceId,
        Status: o.status,
        Jadwal: o.scheduledTime?.toDate().toLocaleString(),
      }))
    );

    const fileUri = FileSystem.documentDirectory + 'laporan.csv';
    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Export Laporan</Text>
      <Button title="Export ke PDF" onPress={generatePDF} />
      <View style={{ height: 10 }} />
      <Button title="Export ke CSV" onPress={generateCSV} color="#28a745" />
    </View>
  );
}
