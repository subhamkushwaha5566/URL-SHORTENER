import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiLink2, FiCopy, FiExternalLink, FiBarChart2, FiCheck, FiArrowRight } from 'react-icons/fi';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

  const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });

  const fetchUrls = async () => {
    try {
      const response = await api.get('/url/myurls');
      const fetchedUrls = response.data.urls || [];
      setUrls(fetchedUrls.reverse());
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch URLs');
      }
    }
  };

  useEffect(() => {
    fetchUrls();
  },[]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!newUrl) return;
    setIsGenerating(true);
    setError(null);

    try {
      const response = await api.post('/url', { url: newUrl });
      if (response.status === 201) {
        setNewUrl('');
        fetchUrls();
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to generate URL');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/login');
  };

  const handleCopy = (shortId) => {
    const fullUrl = `${API_URL}/${shortId}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(shortId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="container py-4 position-relative z-1">
      {/* Navbar / Header */}
      <header className="d-flex justify-content-between align-items-center mb-5 pb-3">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-white rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', border: '1px solid var(--border-subtle)'}}>
            <FiLink2 size={20} color="var(--accent-primary)" style={{ strokeWidth: '3px'}} />
          </div>
          <h4 className="m-0 fw-bold tracking-tight text-main">shortnr<span style={{ color: 'var(--accent-secondary)' }}>.</span></h4>
        </div>
        
        <button onClick={handleLogout} className="btn-outline-light-theme bg-white d-flex align-items-center gap-2 small px-3 py-2 shadow-sm">
          <FiLogOut size={14} />
          <span>Sign Out</span>
        </button>
      </header>

      {error && (
        <div className="alert alert-danger font-mono small py-2 mb-4" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'var(--error-color)', color: 'var(--error-color)' }}>
          {error}
        </div>
      )}

      {/* Hero / Generator Section */}
      <div className="mb-5 text-center mt-5 pt-3">
        <div className="d-inline-block mb-3 px-3 py-1 rounded-pill bg-white shadow-sm border small fw-bold" style={{ color: 'var(--accent-primary)'}}>
          ✨ The modern way to manage links
        </div>
        <h1 className="display-4 fw-bolder mb-3">
          Shorten Your <span className="text-gradient">Links.</span>
        </h1>
        <p className="text-muted-light mb-4 lead" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Create clean, trackable URLs instantly, wrapped in a beautiful experience.
        </p>

        <form onSubmit={handleGenerate} className="mt-5" style={{ maxWidth: '750px', margin: '0 auto' }}>
          <div className="position-relative d-flex bg-white p-2 rounded-pill shadow-float" style={{ border: '1px solid var(--border-subtle)' }}>
            <div className="d-flex align-items-center ps-4 text-muted-light">
              <FiLink2 size={24} color="var(--accent-primary)" />
            </div>
            <input
              type="url"
              className="form-control bg-transparent border-0 font-mono ps-3 py-3 fs-5"
              placeholder="Paste your long URL here... e.g. https://github.com"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              style={{ boxShadow: 'none', color: 'var(--text-main)' }}
              required
            />
            <button 
              type="submit" 
              className="btn btn-primary-light rounded-pill px-4 d-flex align-items-center gap-2 m-1"
              disabled={isGenerating}
              style={{ padding: '0 2rem' }}
            >
              {isGenerating ? 'Working...' : (
                <span className="fw-bold d-flex align-items-center gap-2"><FiArrowRight size={20} /> Shorten</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Links List Section */}
      <div className="mt-5 pt-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h5 className="m-0 fw-bold d-flex align-items-center gap-2 text-main">
            <FiBarChart2 color="var(--accent-primary)" /> 
            Your Links
          </h5>
          <span className="badge-indigo">{urls.length} Total</span>
        </div>

        {urls.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {urls.map((url) => (
              <div key={url.shortId} className="light-card light-card-hoverable p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between" style={{ borderLeft: '4px solid transparent' }} onMouseOver={(e) => e.currentTarget.style.borderLeftColor = 'var(--accent-primary)'} onMouseOut={(e) => e.currentTarget.style.borderLeftColor = 'transparent'}>
                
                {/* Left Side: URLs */}
                <div className="mb-3 mb-md-0 d-flex flex-column overflow-hidden" style={{ flex: '1 1 auto', marginRight: '20px' }}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="text-muted-light small">{API_URL.replace(/^https?:\/\//, '')}/</span>
                    <a 
                      href={`${API_URL}/${url.shortId}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-mono fs-5 text-decoration-none fw-bold"
                      style={{ color: 'var(--text-main)'}}
                    >
                      {url.shortId}
                    </a>
                  </div>
                  <div className="d-flex align-items-center gap-2 overflow-hidden">
                    <FiLink2 size={14} className="text-muted-light flex-shrink-0" />
                    <a 
                      href={url.redirectURL} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-muted-light small font-mono text-truncate text-decoration-none"
                    >
                      {url.redirectURL}
                    </a>
                  </div>
                </div>

                {/* Right Side: Actions & Clicks */}
                <div className="d-flex align-items-center gap-3 ms-md-auto flex-shrink-0">
                  <div className="d-flex align-items-center gap-1 badge-indigo me-2 bg-light text-main border" title="Total Clicks">
                    <FiBarChart2 size={16} className="text-muted-light" />
                    <span className="ms-1 fw-bold">{url.visitHistory?.length || 0}</span>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button 
                      onClick={() => handleCopy(url.shortId)}
                      className="btn-outline-light-theme bg-white d-flex align-items-center justify-content-center p-2 rounded"
                      title="Copy to clipboard"
                    >
                      {copiedId === url.shortId ? <FiCheck color="var(--success-color)" /> : <FiCopy />}
                    </button>
                    <a 
                      href={`${API_URL}/${url.shortId}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-outline-light-theme bg-white d-flex align-items-center justify-content-center p-2 rounded"
                      title="Test link"
                    >
                      <FiExternalLink />
                    </a>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        ) : (
          <div className="light-card p-5 text-center mt-3 d-flex flex-column align-items-center border-dashed">
            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-3 border shadow-sm" style={{ width: '80px', height: '80px' }}>
              <FiLink2 size={32} color="var(--accent-primary)" />
            </div>
            <h4 className="fw-bold mt-2">No links yet</h4>
            <p className="text-muted-light mb-0">Use the form above to generate your first beautiful short URL.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
