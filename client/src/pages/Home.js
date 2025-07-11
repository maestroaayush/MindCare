import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home">
      <header className="navbar">
        <h1 className="logo">MindCare</h1>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
      </header>

      <section className="hero">
  <img src="/assets/hero.png" alt="Mental health support" className="hero-img" />
  <h2>Welcome to MindCare</h2>
  <p>Your digital gateway to accessible, compassionate mental health support.</p>
  <Link to="/register" className="cta-button">Get Started</Link>
</section>

<section className="services">
  <h3>Our Services</h3>
  <div className="service-list">
    <div className="service-item">
      <h4>Telepsychiatry</h4>
      <p>Connect with licensed psychiatrists via secure video sessions.</p>
    </div>
    <div className="service-item">
      <h4>Online Counseling</h4>
      <p>Book therapy sessions tailored to your needs and preferences.</p>
    </div>
    <div className="service-item">
      <h4>Resource Hub</h4>
      <p>Access mental health articles, self-care guides, and tools.</p>
    </div>
  </div>
</section>

<section className="testimonials">
  <h3>What Our Users Say</h3>
  <div className="testimonial-list">
    <div className="testimonial-item">
      <p>“MindCare helped me talk to a therapist when I needed it most. Truly life-changing.”</p>
      <strong>— Aisha, Student</strong>
    </div>
    <div className="testimonial-item">
      <p>“Easy to use and filled with helpful resources. Highly recommend.”</p>
      <strong>— Rohan, Engineer</strong>
    </div>
  </div>
</section>


    </div>
  );
}
