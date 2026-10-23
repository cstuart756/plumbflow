import * as React from 'react';

interface Props {
  businessName: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  date: string;
  time: string;
}

export default function OwnerAlert({ businessName, customerName, customerPhone, serviceName, date, time }: Props) {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#333' }}>
      <h2>New Booking Alert 🚨</h2>
      <p>You have a new booking for <strong>{businessName}</strong>.</p>
      
      <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '8px', margin: '20px 0' }}>
        <p style={{ margin: '0 0 10px 0' }}><strong>Service:</strong> {serviceName}</p>
        <p style={{ margin: '0 0 10px 0' }}><strong>Date:</strong> {date}</p>
        <p style={{ margin: '0 0 10px 0' }}><strong>Time:</strong> {time}</p>
        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0' }} />
        <p style={{ margin: '0 0 5px 0' }}><strong>Customer:</strong> {customerName}</p>
        <p style={{ margin: '0' }}><strong>Phone:</strong> {customerPhone}</p>
      </div>
      
      <p>Log in to your dashboard to view the full details.</p>
    </div>
  );
}