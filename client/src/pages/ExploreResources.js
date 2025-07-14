import React, { useState, useEffect } from 'react';
import './ExploreResources.css';

const ExploreResources = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sample resources data - in real implementation, this would come from API
  const [resources] = useState([
    {
      id: 1,
      title: 'Understanding Anxiety: A Comprehensive Guide',
      description: 'Learn about the signs, symptoms, and effective coping strategies for managing anxiety in daily life.',
      type: 'article',
      category: 'anxiety',
      difficulty: 'beginner',
      duration: 15,
      author: 'Dr. Sarah Johnson',
      views: 1250,
      likes: 89,
      link: '#',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop&crop=entropy&auto=format&dpr=2&q=80'
    },
    {
      id: 2,
      title: 'Mindfulness Meditation for Stress Relief',
      description: 'A guided meditation session to help you reduce stress and find inner peace.',
      type: 'video',
      category: 'mindfulness',
      difficulty: 'beginner',
      duration: 20,
      author: 'Dr. Michael Chen',
      views: 2100,
      likes: 156,
      link: '#',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&crop=entropy&auto=format&dpr=2&q=80'
    },
    {
      id: 3,
      title: 'Daily Mood Tracker',
      description: 'Interactive tool to help you track your daily emotions and identify patterns.',
      type: 'tool',
      category: 'self-care',
      difficulty: 'beginner',
      duration: 0,
      author: 'MindCare Team',
      views: 890,
      likes: 67,
      link: '#',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop&crop=entropy&auto=format&dpr=2&q=80'
    },
    {
      id: 4,
      title: 'Understanding Depression: Breaking the Silence',
      description: 'An insightful podcast episode discussing depression, its impact, and treatment options.',
      type: 'podcast',
      category: 'depression',
      difficulty: 'intermediate',
      duration: 45,
      author: 'Dr. Emma Wilson',
      views: 1680,
      likes: 124,
      link: '#',
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=250&fit=crop&crop=entropy&auto=format&dpr=2&q=80'
    },
    {
      id: 5,
      title: 'Building Resilience: A Step-by-Step Guide',
      description: 'Comprehensive guide to developing emotional resilience and mental strength.',
      type: 'guide',
      category: 'stress',
      difficulty: 'advanced',
      duration: 30,
      author: 'Dr. James Anderson',
      views: 945,
      likes: 78,
      link: '#',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=entropy&auto=format&dpr=2&q=80'
    },
    {
      id: 6,
      title: 'Sleep Hygiene for Better Mental Health',
      description: 'Learn how proper sleep habits can significantly improve your mental wellbeing.',
      type: 'article',
      category: 'self-care',
      difficulty: 'beginner',
      duration: 12,
      author: 'Dr. Lisa Martinez',
      views: 1456,
      likes: 112,
      link: '#',
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=250&fit=crop&crop=entropy&auto=format&dpr=2&q=80'
    }
  ]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'anxiety', label: 'Anxiety' },
    { value: 'depression', label: 'Depression' },
    { value: 'stress', label: 'Stress Management' },
    { value: 'self-care', label: 'Self-Care' },
    { value: 'mindfulness', label: 'Mindfulness' },
    { value: 'general', label: 'General' }
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'article', label: 'Articles' },
    { value: 'video', label: 'Videos' },
    { value: 'podcast', label: 'Podcasts' },
    { value: 'tool', label: 'Tools' },
    { value: 'guide', label: 'Guides' }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  const getTypeIcon = (type) => {
    const icons = {
      article: '📄',
      video: '🎥',
      podcast: '🎧',
      tool: '🛠️',
      guide: '📖'
    };
    return icons[type] || '📄';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: '#10b981',
      intermediate: '#f59e0b',
      advanced: '#ef4444'
    };
    return colors[difficulty] || '#10b981';
  };

  const formatDuration = (minutes) => {
    if (minutes === 0) return 'Interactive';
    return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
  };

  return (
    <div className="explore-resources">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Explore Mental Health Resources</h1>
          <p>
            Discover a curated collection of evidence-based resources designed to support your mental wellbeing journey. 
            From articles and videos to interactive tools and expert guides.
          </p>
        </div>
      </section>

      <section className="filters-section">
        <div className="container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="filter-select"
            >
              {types.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="resources-section">
        <div className="container">
          <div className="resources-header">
            <h2>Resources ({filteredResources.length})</h2>
          </div>
          
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading resources...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="no-resources">
              <p>No resources found matching your criteria.</p>
            </div>
          ) : (
            <div className="resources-grid">
              {filteredResources.map(resource => (
                <div key={resource.id} className="resource-card">
                  <div className="resource-image">
                    <img src={resource.image} alt={resource.title} />
                    <div className="resource-type">
                      <span className="type-icon">{getTypeIcon(resource.type)}</span>
                      <span className="type-label">{formatCategory(resource.type)}</span>
                    </div>
                  </div>
                  
                  <div className="resource-content">
                    <h3 className="resource-title">{resource.title}</h3>
                    <p className="resource-description">{resource.description}</p>
                    
                    <div className="resource-meta">
                      <span className="resource-author">By {resource.author}</span>
                      <span className="resource-category">{formatCategory(resource.category)}</span>
                    </div>
                    
                    <div className="resource-stats">
                      <span className="resource-duration">{formatDuration(resource.duration)}</span>
                      <span 
                        className="resource-difficulty"
                        style={{ color: getDifficultyColor(resource.difficulty) }}
                      >
                        {formatCategory(resource.difficulty)}
                      </span>
                    </div>
                    
                    <div className="resource-footer">
                      <div className="resource-engagement">
                        <span className="views">👁️ {resource.views}</span>
                        <span className="likes">❤️ {resource.likes}</span>
                      </div>
                      
                      <a href={resource.link} className="resource-link">
                        Access Resource
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ExploreResources;
