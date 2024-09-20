import React from "react";

const SearchPagination = ({ currentPage, lastPage, onPageChange }) => {
  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: lastPage }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          onClick={() => {
            handlePageClick(page);
          }}
          className={`p-1 ${page === currentPage ? "text-white" : "text-black	"}`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default SearchPagination;
