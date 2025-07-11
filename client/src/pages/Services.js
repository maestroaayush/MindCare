import React from 'react';

export default function Services() {
  const services = [
    {
      title: 'Telepsychiatry',
      description: 'Book secure, private video sessions with licensed psychiatrists from the comfort of your home.',
      icon: '/assets/video-consult.png'
    },
    {
      title: 'Online Counseling',
      description: 'Access personalized counseling from certified therapists for anxiety, stress, or depression.',
      icon: '/assets/online-counseling.png'
    },
    {
      title: 'Resource Hub',
      description: 'Explore articles, mental health tips, self-care guides, and community-recommended resources.',
      icon: '/assets/resources.png'
    },
    {
      title: 'Progress Tracker',
      description: 'Track your mental health journey with guided check-ins, journals, and mood logs.',
      icon: '/assets/progress.png'
    }
  ];

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Our Services</h2>
      <p style={styles.subtitle}>
        MindCare offers a wide range of digital mental health services tailored to support your well-being.
      </p>

      <div style={styles.cardContainer}>
        {services.map((service, index) => (
          <div key={index} style={styles.card}>
            <img src={service.icon} alt={service.title} style={styles.icon} />
            <h3 style={styles.cardTitle}>{service.title}</h3>
            <p style={styles.cardDesc}>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f4f6f8',
    padding: '60px 20px',
    textAlign: 'center'
  },
  title: {
    fontSize: '2.4rem',
    color: '#6a1b9a',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#555',
    marginBottom: '40px'
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '30px'
  },
  card: {
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    padding: '30px',
    maxWidth: '300px',
    flex: '1 1 250px'
  },
  icon: {
    width: '60px',
    height: '60px',
    marginBottom: '20px'
  },
  cardTitle: {
    fontSize: '1.3rem',
    color: '#333',
    marginBottom: '10px'
  },
  cardDesc: {
    fontSize: '1rem',
    color: '#666'
  }
};
