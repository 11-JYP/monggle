import React, { useEffect, useRef, useState } from "react";

const SearchPagination = ({ currentPage, lastPage, onPageChange, scrollToTop }) => {
  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
      scrollToTop();
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
