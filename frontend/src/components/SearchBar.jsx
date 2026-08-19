import { useState } from 'react';

function SearchBar({ onSearch, heroMode = false }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`search-bar-container ${heroMode ? 'hero-search-bar' : 'normal-search-bar'}`}
      id={heroMode ? 'ev-search-form' : undefined}
    >
      <input
        type="text"
        placeholder="Buscar una película (ej: Inception)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-bar-input"
      />
      {/* From Uiverse.io by ryota1231 adaptado con ícono de lupa */}
      <button type="submit" className="animated-button">
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span className="text">Buscar</span>
        <span className="circle"></span>
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </form>
  );
}

export default SearchBar;