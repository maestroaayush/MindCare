import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      setServices([
        {
          icon: '💬',
          title: 'Online Counseling',
          desc: 'Connect with certified counselors from the comfort of your home.'
        },
        {
          icon: '📞',
          title: 'Telepsychiatry',
          desc: 'Access psychiatric consultations via secure video calls.'
        },
        {
          icon: '📚',
          title: 'Mental Health Resources',
          desc: 'Explore articles, guides, and self-help tools curated by experts.'
        }
      ]);
      setTestimonials([
        {
          name: 'Aisha K.',
          text: 'MindCare made it easy to get help when I needed it most. The counselors are caring and professional.'
        },
        {
          name: 'Rahul S.',
          text: 'The telepsychiatry service was a lifesaver during lockdown. Highly recommend!'
        },
        {
          name: 'Fatima Z.',
          text: 'The resources helped me understand and manage my anxiety better.'
        },
        {
          name: 'Samuel O.',
          text: 'Quick, private, and supportive. MindCare is a blessing!'
        }
      ]);
    }, 500);
  }, []);

  // Scroll to services if URL has #services
  useEffect(() => {
    if (location.hash === '#services') {
      const section = document.getElementById('services-section');
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 100); // wait for render
      }
    }
  }, [location]);

  return (
    <div className="home">
      <section className="hero">
        <img
          src="assets/hero.png"
          alt="MindCare Heart"
          className="hero-img"
        />
        <h2>Welcome to MindCare</h2>
        <p>
          Your digital bridge to accessible, compassionate mental health support.
        </p>
        <a href="/resources" className="cta-button">
          Explore Resources
        </a>
      </section>

      <hr className="section-separator" />

      <section className="services" id="services-section">
        <h3>Our Services</h3>
        <div className="service-list">
          {services.length === 0 ? (
            <p>Loading services...</p>
          ) : (
            services.map((service, idx) => (
              <div className="service-item" key={idx}>
                <div style={{ fontSize: '2.2rem', marginBottom: '12px' }}>{service.icon}</div>
                <h4>{service.title}</h4>
                <p>{service.desc}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <hr className="section-separator" />

      <section className="testimonials">
        <h3>What Our Users Say</h3>
        <div className="service-list">
          {testimonials.length === 0 ? (
            <p>Loading testimonials...</p>
          ) : (
            testimonials.map((t, idx) => (
              <div className="service-item testimonial-service-item" key={idx}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🗣️</div>
                <p style={{ fontStyle: 'italic', marginBottom: '10px' }}>"{t.text}"</p>
                <span style={{ fontWeight: 600, color: '#6a1b9a' }}>— {t.name}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}