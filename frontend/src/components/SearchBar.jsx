import { useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Buscar una película (ej: Inception)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ flex: 1, padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <button 
        type="submit" 
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#e50914', color: '#fff', border: 'none', borderRadius: '4px' }}
      >
        Buscar
      </button>
    </form>
  );
}

export default SearchBar;