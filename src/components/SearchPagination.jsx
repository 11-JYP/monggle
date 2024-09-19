import React from 'react';

const SearchPagination = ({ currentPage, lastPage, onPageChange }) => {
  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
      {Array.from({ length: lastPage }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          onClick={() => {
            console.log('page :>> ', page);
            handlePageClick(page);
          }}
          style={{ padding: '5px', backgroundColor: page === currentPage ? 'lightblue' : 'white' }}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default SearchPagination;
