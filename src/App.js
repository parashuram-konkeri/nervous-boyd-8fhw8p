import React, { useState } from 'react';
import './styles.css';

function App() {
  const [bookTitle, setBookTitle] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    if (!bookTitle) return;
    setLoading(true);
    setError('');
    setBooks([]);

    try {
      const response = await fetch(`https://openlibrary.org/search.json?title=${bookTitle}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json(); // ✅ Convert to JSON
      setBooks(data.docs); // ✅ Now we can access docs
      if (data.docs.length === 0) setError('No books found.');
    } catch (err) {
      setError('Failed to fetch books.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Book Finder</h1>
      <input
        type="text"
        value={bookTitle}
        onChange={(e) => setBookTitle(e.target.value)}
        placeholder="Enter book title"
      />
      <button onClick={fetchBooks}>Search</button>
      <button onClick={()=>{setBookTitle('');setBooks([]);setError('');}}>clear</button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="book-list">
        {books.map((book) => (
          <div key={book.key} className="book-card">
            {book.cover_i && (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
              />
            )}
            <h3>{book.title}</h3>
            <p>{book.author_name?.join(', ')}</p>
            <p>{book.first_publish_year}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
