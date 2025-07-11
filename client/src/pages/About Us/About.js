import React, { useEffect, useState } from 'react';
import './About.css';

export default function About() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setTeam([
        {
          name: 'John Doe',
          role: 'Frontend Developer',
          image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f468-200d-1f4bb.png'
        },
        {
          name: 'Maya Singh',
          role: 'Backend Developer',
          image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f469-200d-1f4bb.png'
        },
        {
          name: 'Ali Tan',
          role: 'UI/UX Designer',
          image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f9d1-200d-1f3a8.png'
        },
        {
          name: 'Sarah Lim',
          role: 'Project Coordinator',
          image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f469-200d-1f4bc.png'
        }
      ]);
    }, 500);
  }, []);

  return (
    <div className="about-page">
      <div className="hero-section">
        <img
          src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4da.png"
          alt="About MindCare"
          className="hero-image"
        />
        <h2 className="title">About MindCare</h2>
        <p className="subtitle">Bridging the mental health gap through digital transformation.</p>
      </div>

      <div className="section">
        <p>
          MindCare connects individuals to mental health professionals through secure digital services like
          telepsychiatry and online counseling. We’re passionate about reducing stigma and improving access—
          whether you’re in a city or a rural village.
        </p>
        <p>
          Our goal is to make mental wellness more approachable, compassionate, and accessible to everyone.
        </p>
      </div>
<hr className="section-separator" />
      <div className="team-section">
        <h3 className="team-title">Meet Our Team</h3>
        <div className="card-grid">
          {team.length === 0 ? (
            <p className="loading-text">Loading team...</p>
          ) : (
            team.map((member, idx) => (
              <div key={idx} className="card">
                <img src={member.image} alt={member.name} className="card-img" />
                <h4 className="card-name">{member.name}</h4>
                <p className="card-role">{member.role}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
