import React, { useState } from 'react';
import './LearnMore.css';

const LearnMore = () => {
  const [activeTab, setActiveTab] = useState('about');

  const services = [
    {
      title: 'Online Counseling',
      description: 'Connect with licensed therapists and counselors through secure video calls, chat, or phone sessions.',
      features: ['24/7 Availability', 'Licensed Professionals', 'Secure & Private', 'Flexible Scheduling'],
      icon: '🧠'
    },
    {
      title: 'Telepsychiatry',
      description: 'Access psychiatric consultations and medication management with certified psychiatrists.',
      features: ['Medication Management', 'Psychiatric Evaluations', 'Follow-up Care', 'Crisis Support'],
      icon: '🔬'
    },
    {
      title: 'Mental Health Resources',
      description: 'Explore our comprehensive library of articles, tools, and educational materials.',
      features: ['Evidence-Based Content', 'Self-Help Tools', 'Interactive Assessments', 'Progress Tracking'],
      icon: '📚'
    }
  ];

  const features = [
    {
      title: 'Secure & Private',
      description: 'End-to-end encryption ensures your conversations remain confidential.',
      icon: '🔒'
    },
    {
      title: 'Licensed Professionals',
      description: 'All our therapists and psychiatrists are licensed and experienced.',
      icon: '👩‍⚕️'
    },
    {
      title: 'Accessible Care',
      description: 'Get support from anywhere, removing geographical barriers to mental health care.',
      icon: '🌍'
    },
    {
      title: 'Affordable Options',
      description: 'We offer various pricing plans to make mental health care accessible to all.',
      icon: '💰'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'People Helped' },
    { number: '500+', label: 'Licensed Professionals' },
    { number: '50+', label: 'Countries Served' },
    { number: '4.8/5', label: 'User Rating' }
  ];

  return (
    <div className="learn-more">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Learn More About MindCare</h1>
          <p>
            MindCare combines the best of technology and compassion to deliver high-quality mental health support. 
            Whether you're looking for mental health resources or expert guidance, we are here to assist you.
          </p>
        </div>
      </section>

      <section className="tabs-section">
        <div className="container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              About Us
            </button>
            <button 
              className={`tab ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              Our Services
            </button>
            <button 
              className={`tab ${activeTab === 'features' ? 'active' : ''}`}
              onClick={() => setActiveTab('features')}
            >
              Key Features
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'about' && (
              <div className="about-content">
                <div className="mission-vision-grid">
                  <div className="mission-card">
                    <h3>Our Mission</h3>
                    <p>
                      To make mental health support accessible to everyone through innovative technology 
                      and compassionate care. We believe that mental health is a fundamental human right 
                      and work tirelessly to break down barriers that prevent people from getting the help they need.
                    </p>
                  </div>
                  <div className="vision-card">
                    <h3>Our Vision</h3>
                    <p>
                      A world where mental health support is available to all, breaking down barriers 
                      and reducing stigma. We envision a future where seeking mental health support 
                      is as normal and accessible as visiting a doctor for physical health.
                    </p>
                  </div>
                </div>
                
                <div className="values-section">
                  <h3>Our Values</h3>
                  <div className="values-grid">
                    <div className="value-item">
                      <h4>Compassion</h4>
                      <p>We approach every interaction with empathy and understanding.</p>
                    </div>
                    <div className="value-item">
                      <h4>Accessibility</h4>
                      <p>Mental health support should be available to everyone, everywhere.</p>
                    </div>
                    <div className="value-item">
                      <h4>Innovation</h4>
                      <p>We leverage technology to create better mental health solutions.</p>
                    </div>
                    <div className="value-item">
                      <h4>Excellence</h4>
                      <p>We maintain the highest standards in all our services.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="services-content">
                <h3>Our Comprehensive Services</h3>
                <div className="services-grid">
                  {services.map((service, index) => (
                    <div key={index} className="service-card">
                      <div className="service-icon">{service.icon}</div>
                      <h4>{service.title}</h4>
                      <p>{service.description}</p>
                      <ul className="service-features">
                        {service.features.map((feature, idx) => (
                          <li key={idx}>
                            <span className="feature-check">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="features-content">
                <h3>Why Choose MindCare?</h3>
                <div className="features-grid">
                  {features.map((feature, index) => (
                    <div key={index} className="feature-card">
                      <div className="feature-icon">{feature.icon}</div>
                      <h4>{feature.title}</h4>
                      <p>{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <h2>Our Impact</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of people who have found support and healing through MindCare.</p>
          <div className="cta-buttons">
            <a href="/register" className="cta-button primary">Get Started Today</a>
            <a href="/contact" className="cta-button secondary">Contact Us</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearnMore;

