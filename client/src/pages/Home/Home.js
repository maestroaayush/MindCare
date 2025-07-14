import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      setServices([
        {
          icon: '🧠',
          title: 'Online Counseling',
          desc: 'Connect with certified counselors from the comfort of your home through secure, private sessions.',
          features: ['24/7 Availability', 'Certified Professionals', 'Secure & Private']
        },
        {
          icon: '🔬',
          title: 'Telepsychiatry',
          desc: 'Access comprehensive psychiatric consultations via secure video calls with licensed psychiatrists.',
          features: ['Licensed Psychiatrists', 'Medication Management', 'Follow-up Care']
        },
        {
          icon: '📖',
          title: 'Mental Health Resources',
          desc: 'Explore our extensive library of articles, guides, and self-help tools curated by mental health experts.',
          features: ['Expert-Curated Content', 'Self-Help Tools', 'Educational Materials']
        }
      ]);
      setTestimonials([
        {
          name: 'Aisha K.',
          role: 'Software Engineer',
          text: 'MindCare made it easy to get help when I needed it most. The counselors are caring and professional, and the platform is incredibly user-friendly.',
          rating: 5
        },
        {
          name: 'Rahul S.',
          role: 'Teacher',
          text: 'The telepsychiatry service was a lifesaver during lockdown. Being able to consult with a psychiatrist from home was exactly what I needed.',
          rating: 5
        },
        {
          name: 'Fatima Z.',
          role: 'Student',
          text: 'The resources helped me understand and manage my anxiety better. The self-help tools are particularly valuable for daily coping.',
          rating: 5
        },
        {
          name: 'Samuel O.',
          role: 'Healthcare Worker',
          text: 'Quick, private, and supportive. MindCare is a blessing for busy professionals who need flexible mental health support.',
          rating: 5
        }
      ]);
      setIsLoading(false);
    }, 800);
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
    ));
  };

  if (isLoading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Loading MindCare...</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-image-container">
            <img
              src="assets/hero.png"
              alt="MindCare Heart"
              className="hero-img"
            />
          </div>
          <div className="hero-text">
            <h1>Welcome to MindCare</h1>
            <p className="hero-subtitle">
              Your digital bridge to accessible, compassionate mental health support.
            </p>
            <p className="hero-description">
              Professional mental health services designed to support your wellbeing journey with privacy, convenience, and expert care.
            </p>
            <div className="hero-buttons">
              <a href="/resources" className="cta-button primary">
                Explore Resources
              </a>
              <a href="#services" className="cta-button secondary">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="services" id="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Comprehensive mental health support tailored to your needs</p>
          </div>
          <div className="service-grid">
            {services.map((service, idx) => (
              <div className="service-card" key={idx}>
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p className="service-description">{service.desc}</p>
                <ul className="service-features">
                  {service.features.map((feature, featureIdx) => (
                    <li key={featureIdx}>
                      <span className="feature-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>What Our Users Say</h2>
            <p>Real stories from people who found support through MindCare</p>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((testimonial, idx) => (
              <div className="testimonial-card" key={idx}>
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <p className="testimonial-role">{testimonial.role}</p>
                    <div className="testimonial-rating">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}