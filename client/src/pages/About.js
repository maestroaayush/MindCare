import React from 'react';

export default function About() {
  const team = [
  {
    name: 'John Doe',
    role: 'Frontend Developer',
    image: '/assets/john.jpg'
  },
  {
    name: 'Maya Singh',
    role: 'Backend Developer',
    image: '/assets/maya.jpg'
  },
  {
    name: 'Ali Tan',
    role: 'UI/UX Designer',
    image: '/assets/ali.jpg'
  },
  {
    name: 'Sarah Lim',
    role: 'Project Coordinator',
    image: '/assets/sarah.jpg'
  }
];

  return (
    <div style={styles.page}>
      <div style={styles.heroSection}>
        <img src="/assets/about-hero.png" alt="About MindCare" style={styles.heroImage} />
        <h2 style={styles.title}>About MindCare</h2>
        <p style={styles.subtitle}>
          Bridging the mental health gap through digital transformation.
        </p>
      </div>

      <div style={styles.section}>
        <p style={styles.text}>
          MindCare connects individuals to mental health professionals through secure digital services like
          telepsychiatry and online counseling. We’re passionate about reducing stigma and improving access—
          whether you’re in a city or a rural village.
        </p>
        <p style={styles.text}>
          Our goal is to make mental wellness more approachable, compassionate, and accessible to everyone.
        </p>
      </div>

      <div style={styles.teamSection}>
        <h3 style={styles.teamTitle}>Meet Our Team</h3>
        <div style={styles.cardGroup}>
          {team.map((member, idx) => (
            <div key={idx} style={styles.card}>
              <img src={member.image} alt={member.name} style={styles.cardImg} />
              <h4 style={styles.cardName}>{member.name}</h4>
              <p style={styles.cardRole}>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: '#f4f6f8',
    padding: '40px 20px',
    minHeight: '100vh',
    textAlign: 'center'
  },
  heroSection: {
    marginBottom: '40px'
  },
  heroImage: {
    width: '300px',
    maxWidth: '100%',
    marginBottom: '20px'
  },
  title: {
    fontSize: '2.4rem',
    color: '#6a1b9a'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#555'
  },
  section: {
    maxWidth: '800px',
    margin: '0 auto',
    marginBottom: '40px'
  },
  text: {
    fontSize: '1.1rem',
    color: '#444',
    marginBottom: '20px',
    lineHeight: '1.6'
  },
  teamSection: {
    marginTop: '60px'
  },
  teamTitle: {
    fontSize: '1.8rem',
    marginBottom: '30px',
    color: '#333'
  },
  cardGroup: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '20px'
  },
  card: {
    background: 'white',
    padding: '20px',
    width: '200px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  cardImg: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px'
  },
  cardName: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  cardRole: {
    fontSize: '0.9rem',
    color: '#777'
  }
};
