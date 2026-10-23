import * as React from 'react';

interface Props {
  customerName: string;
  businessName: string;
  serviceName: string;
  date: string;
  time: string;
}

export default function CustomerConfirmation({ customerName, businessName, serviceName, date, time }: Props) {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#333' }}>
      <h2>Booking Confirmed!</h2>
      <p>Hi {customerName},</p>
      <p>Your booking with <strong>{businessName}</strong> has been confirmed.</p>
      
      <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '8px', margin: '20px 0' }}>
        <p style={{ margin: '0 0 10px 0' }}><strong>Service:</strong> {serviceName}</p>
        <p style={{ margin: '0 0 10px 0' }}><strong>Date:</strong> {date}</p>
        <p style={{ margin: '0' }}><strong>Time:</strong> {time}</p>
      </div>
      
      <p>If you need to reschedule, please contact {businessName} directly.</p>
      <p>Thanks,<br/>The Plumbflow Team</p>
    </div>
  );
}