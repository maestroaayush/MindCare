import React from 'react';

export default function Sessions() {
  const sessions = [
    { date: "2025-07-01", time: "10:00 AM", psychiatrist: "Dr. Maya Singh" },
    { date: "2025-07-08", time: "2:00 PM", psychiatrist: "Dr. Ali Tan" }
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Sessions</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Psychiatrist</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, i) => (
            <tr key={i}>
              <td>{s.date}</td>
              <td>{s.time}</td>
              <td>{s.psychiatrist}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: '30px' },
  heading: { fontSize: '1.6rem', color: '#6a1b9a' },
  table: {
    width: '100%',
    marginTop: '20px',
    borderCollapse: 'collapse'
  },
  th: {
    background: '#eee',
    textAlign: 'left',
    padding: '10px'
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd'
  }
};
