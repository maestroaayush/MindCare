import React from 'react';

export default function Resources() {
  const resources = [
    { title: "Managing Anxiety", type: "Article", link: "#" },
    { title: "Self-Care Routine", type: "Guide", link: "#" },
    { title: "Coping with Depression", type: "Video", link: "#" }
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Mental Health Resources</h2>
      <ul style={styles.list}>
        {resources.map((res, idx) => (
          <li key={idx} style={styles.item}>
            <h4>{res.title}</h4>
            <p>{res.type}</p>
            <a href={res.link}>View</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { padding: '30px' },
  heading: { fontSize: '1.6rem', color: '#6a1b9a' },
  list: { listStyle: 'none', padding: 0 },
  item: {
    background: '#fff',
    padding: '20px',
    marginBottom: '15px',
    borderRadius: '8px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.05)'
  }
};
