import { useState } from 'react';

function SearchBar({ onSearch, heroMode = false }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  if (heroMode) {
    return (
      <form onSubmit={handleSubmit} id="ev-search-form">
        <input
          type="text"
          placeholder="Buscar una película (ej: Inception)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="ev-search-input"
        />
        <input type="submit" value="Buscar" />
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        placeholder="Buscar una película (ej: Inception)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <button
        type="submit"
        className="search-btn"
      >
        Buscar
      </button>
    </form>
  );
}

export default SearchBar;