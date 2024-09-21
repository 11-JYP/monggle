import React, { useEffect, useRef, useState } from "react";

const SearchPagination = ({ currentPage, lastPage, onPageChange, scrollToTop }) => {
  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
      scrollToTop();
    }
  };

  return (
    <div className="flex justify-center my-4 font-Uhbee">
      {Array.from({ length: lastPage }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          onClick={() => {
            handlePageClick(page);
          }}
          className={`mx-1 px-3 py-1 ${page === currentPage ? " text-[orange]" : "text-gray-700"}`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default SearchPagination;
