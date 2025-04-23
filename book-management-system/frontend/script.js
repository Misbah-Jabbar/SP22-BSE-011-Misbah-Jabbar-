document.addEventListener('DOMContentLoaded', function() {
    const booksTableBody = document.getElementById('booksTableBody');
    const searchInput = document.getElementById('searchInput');
    
    // Load all books on page load
    fetchBooks();
    
    // Enhanced search functionality with debouncing
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim();
        
        clearTimeout(this.searchTimeout);
        
        this.searchTimeout = setTimeout(() => {
            if (searchTerm.length > 0) {
                console.log('Searching for:', searchTerm);
                fetch(`http://localhost:3001/api/books/search?author=${encodeURIComponent(searchTerm)}`)
                    .then(response => {
                        console.log('Response status:', response.status);
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        return response.json();
                    })
                    .then(data => {
                        console.log('Received data:', data);
                        displayBooks(data);
                    })
                    .catch(error => {
                        console.error('Search failed:', error);
                        booksTableBody.innerHTML = '<tr><td colspan="4" class="text-center">Search failed. Please try again.</td></tr>';
                    });
            } else {
                fetchBooks();
            }
        }, 300);
    });
    
    function fetchBooks() {
        fetch('http://localhost:3001/api/books')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => displayBooks(data))
            .catch(error => {
                console.error('Error:', error);
                booksTableBody.innerHTML = '<tr><td colspan="4" class="text-center">Error loading books</td></tr>';
            });
    }
    
    function displayBooks(books) {
        booksTableBody.innerHTML = '';
        
        if (!books || books.length === 0) {
            booksTableBody.innerHTML = '<tr><td colspan="4" class="text-center">No books found</td></tr>';
            return;
        }
        
        books.forEach((book, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>$${book.price?.toFixed(2) || '0.00'}</td>
            `;
            booksTableBody.appendChild(row);
        });
    }
});