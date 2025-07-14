import React, { useState, useEffect } from 'react';
import { resourcesAPI } from '../../utils/api';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ type: '', category: '' });
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    fetchResources();
    fetchMetadata();
  }, [filters]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await resourcesAPI.getAll(filters);
      setResources(response.resources || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch resources');
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [categoriesData, typesData] = await Promise.all([
        resourcesAPI.getCategories(),
        resourcesAPI.getTypes()
      ]);
      setCategories(categoriesData);
      setTypes(typesData);
    } catch (err) {
      console.error('Error fetching metadata:', err);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleLike = async (resourceId) => {
    try {
      await resourcesAPI.like(resourceId);
      // Refresh the resources to show updated like count
      fetchResources();
    } catch (err) {
      console.error('Error liking resource:', err);
    }
  };

  const formatDuration = (minutes) => {
    if (minutes === 0) return '';
    return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Mental Health Resources</h2>
        <div style={styles.loading}>Loading resources...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Mental Health Resources</h2>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Mental Health Resources</h2>
      
      {/* Filters */}
      <div style={styles.filters}>
        <select 
          value={filters.type} 
          onChange={(e) => handleFilterChange('type', e.target.value)}
          style={styles.select}
        >
          <option value="">All Types</option>
          {types.map(type => (
            <option key={type} value={type}>{formatCategory(type)}</option>
          ))}
        </select>
        
        <select 
          value={filters.category} 
          onChange={(e) => handleFilterChange('category', e.target.value)}
          style={styles.select}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{formatCategory(category)}</option>
          ))}
        </select>
      </div>

      {/* Resources List */}
      <ul style={styles.list}>
        {resources.length === 0 ? (
          <div style={styles.noResources}>No resources found</div>
        ) : (
          resources.map((resource) => (
            <li key={resource._id} style={styles.item}>
              <div style={styles.resourceHeader}>
                <h4 style={styles.resourceTitle}>{resource.title}</h4>
                <span style={styles.resourceType}>{formatCategory(resource.type)}</span>
              </div>
              
              <p style={styles.resourceDescription}>{resource.description}</p>
              
              <div style={styles.resourceMeta}>
                <span style={styles.category}>Category: {formatCategory(resource.category)}</span>
                <span style={styles.duration}>{formatDuration(resource.duration)}</span>
                <span style={styles.difficulty}>Level: {formatCategory(resource.difficulty)}</span>
              </div>
              
              <div style={styles.resourceFooter}>
                <div style={styles.stats}>
                  <span>👁️ {resource.views}</span>
                  <span>❤️ {resource.likes}</span>
                </div>
                <div style={styles.actions}>
                  <button 
                    onClick={() => handleLike(resource._id)}
                    style={styles.likeButton}
                  >
                    Like
                  </button>
                  <a 
                    href={resource.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={styles.viewButton}
                  >
                    View Resource
                  </a>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

const styles = {
  container: { padding: '30px' },
  heading: { fontSize: '1.6rem', color: '#6a1b9a', marginBottom: '20px' },
  loading: { textAlign: 'center', padding: '20px', color: '#666' },
  error: { textAlign: 'center', padding: '20px', color: '#d32f2f', backgroundColor: '#ffebee', borderRadius: '4px' },
  filters: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px'
  },
  select: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    fontSize: '14px'
  },
  list: { listStyle: 'none', padding: 0 },
  noResources: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontStyle: 'italic'
  },
  item: {
    background: '#fff',
    padding: '20px',
    marginBottom: '15px',
    borderRadius: '8px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
    border: '1px solid #eee'
  },
  resourceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  resourceTitle: {
    margin: 0,
    color: '#333',
    fontSize: '18px'
  },
  resourceType: {
    backgroundColor: '#6a1b9a',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  resourceDescription: {
    color: '#666',
    lineHeight: '1.4',
    marginBottom: '15px'
  },
  resourceMeta: {
    display: 'flex',
    gap: '20px',
    marginBottom: '15px',
    fontSize: '14px'
  },
  category: {
    color: '#555',
    fontWeight: '500'
  },
  duration: {
    color: '#007bff',
    fontWeight: '500'
  },
  difficulty: {
    color: '#28a745',
    fontWeight: '500'
  },
  resourceFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '15px',
    borderTop: '1px solid #eee'
  },
  stats: {
    display: 'flex',
    gap: '15px',
    fontSize: '14px',
    color: '#666'
  },
  actions: {
    display: 'flex',
    gap: '10px'
  },
  likeButton: {
    padding: '6px 12px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  viewButton: {
    padding: '6px 12px',
    backgroundColor: '#6a1b9a',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    transition: 'all 0.2s'
  }
};
