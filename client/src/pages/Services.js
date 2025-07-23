import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

function Services() {
  const services = [
    {
      id: 1,
      icon: '🧠',
      title: 'Individual Therapy',
      description: 'One-on-one sessions with licensed therapists to address your specific mental health needs.',
      features: [
        'Personalized treatment plans',
        'Evidence-based approaches',
        'Flexible scheduling',
        'Secure video sessions'
      ],
      price: 'Starting at $120/session'
    },
    {
      id: 2,
      icon: '👥',
      title: 'Group Therapy',
      description: 'Join supportive group sessions to connect with others facing similar challenges.',
      features: [
        'Peer support network',
        'Shared experiences',
        'Cost-effective option',
        'Various specialized groups'
      ],
      price: 'Starting at $60/session'
    },
    {
      id: 3,
      icon: '💑',
      title: 'Couples Counseling',
      description: 'Work together with your partner to strengthen your relationship and communication.',
      features: [
        'Communication skills',
        'Conflict resolution',
        'Relationship building',
        'Pre-marital counseling'
      ],
      price: 'Starting at $150/session'
    },
    {
      id: 4,
      icon: '👨‍👩‍👧‍👦',
      title: 'Family Therapy',
      description: 'Address family dynamics and improve relationships between family members.',
      features: [
        'Family communication',
        'Behavioral issues',
        'Parenting support',
        'Crisis intervention'
      ],
      price: 'Starting at $180/session'
    },
    {
      id: 5,
      icon: '🎓',
      title: 'Mental Health Workshops',
      description: 'Educational workshops on various mental health topics and coping strategies.',
      features: [
        'Stress management',
        'Mindfulness techniques',
        'Anxiety coping skills',
        'Depression awareness'
      ],
      price: 'Starting at $40/workshop'
    },
    {
      id: 6,
      icon: '📱',
      title: 'Digital Mental Health Tools',
      description: 'Access our comprehensive suite of digital tools and resources.',
      features: [
        'Mobile app access',
        'Self-assessment tools',
        'Progress tracking',
        '24/7 crisis support'
      ],
      price: 'Starting at $29/month'
    }
  ];

  const specializations = [
    {
      title: 'Anxiety Disorders',
      description: 'Specialized treatment for various anxiety conditions including GAD, panic disorder, and phobias.',
      icon: '😰'
    },
    {
      title: 'Depression',
      description: 'Comprehensive care for major depression, seasonal depression, and mood disorders.',
      icon: '💙'
    },
    {
      title: 'Trauma & PTSD',
      description: 'Evidence-based trauma therapy including EMDR and cognitive processing therapy.',
      icon: '🛡️'
    },
    {
      title: 'Addiction Recovery',
      description: 'Support for substance abuse recovery and behavioral addictions.',
      icon: '🔄'
    },
    {
      title: 'Eating Disorders',
      description: 'Specialized treatment for anorexia, bulimia, and binge eating disorder.',
      icon: '🍎'
    },
    {
      title: 'ADHD Support',
      description: 'Comprehensive ADHD assessment, treatment, and management strategies.',
      icon: '⚡'
    }
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="hero-overlay"></div>
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-left">
              <div className="hero-badge">
                <span className="badge-icon">🏥</span>
                <span className="badge-text">Professional Mental Health Care</span>
              </div>
              <h1>Transform Your Mental Wellness Journey</h1>
              <p className="hero-subtitle">
                Comprehensive, evidence-based mental health care tailored to your unique needs
              </p>
              <p className="hero-description">
                Our team of licensed professionals provides a full range of mental health services 
                to support your journey toward wellness and recovery.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Clients Helped</div>
                </div>
                <div className="stat">
                  <div className="stat-number">15+</div>
                  <div className="stat-label">Expert Therapists</div>
                </div>
                <div className="stat">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
              </div>
              <div className="hero-buttons">
                <Link to="/register" className="cta-button primary">
                  <span className="button-icon">🚀</span>
                  Get Started Today
                </Link>
                <Link to="/contact" className="cta-button secondary">
                  <span className="button-icon">📞</span>
                  Schedule Consultation
                </Link>
              </div>
            </div>
            
            <div className="hero-right">
              <div className="hero-image-container">
                <div className="hero-visual">
                  <div className="therapy-illustration">
                    <div className="therapist-icon">👨‍⚕️</div>
                    <div className="patient-icon">🧑‍🦰</div>
                    <div className="conversation-bubble bubble-1">💭</div>
                    <div className="conversation-bubble bubble-2">💙</div>
                    <div className="wellness-icons">
                      <span className="wellness-icon icon-1">🌱</span>
                      <span className="wellness-icon icon-2">🧠</span>
                      <span className="wellness-icon icon-3">💚</span>
                      <span className="wellness-icon icon-4">🌟</span>
                    </div>
                  </div>
                </div>
                <div className="feature-cards">
                  <div className="feature-card card-1">
                    <span className="feature-icon">📊</span>
                    <span className="feature-text">Progress Tracking</span>
                  </div>
                  <div className="feature-card card-2">
                    <span className="feature-icon">🔒</span>
                    <span className="feature-text">100% Confidential</span>
                  </div>
                  <div className="feature-card card-3">
                    <span className="feature-icon">⏰</span>
                    <span className="feature-text">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>
              Choose from our comprehensive range of mental health services designed 
              to meet you wherever you are in your wellness journey.
            </p>
          </div>
          
          <div className="service-grid">
            {services.map(service => (
              <div key={service.id} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p className="service-description">{service.description}</p>
                
                <ul className="service-features">
                  {service.features.map((feature, index) => (
                    <li key={index}>
                      <span className="feature-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="service-footer">
                  <div className="service-price">{service.price}</div>
                  <Link to="/register" className="service-cta">
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="specializations-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Specializations</h2>
            <p>
              Our experienced therapists specialize in treating a wide range of mental health conditions.
            </p>
          </div>
          
          <div className="specializations-grid">
            {specializations.map((spec, index) => (
              <div key={index} className="specialization-card">
                <div className="spec-icon">{spec.icon}</div>
                <h3>{spec.title}</h3>
                <p>{spec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="services-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Begin Your Mental Health Journey?</h2>
            <p>
              Take the first step toward better mental health. Our compassionate team 
              is here to support you every step of the way.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-button primary">
                Book Your First Session
              </Link>
              <Link to="/contact" className="cta-button secondary">
                Ask Questions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
