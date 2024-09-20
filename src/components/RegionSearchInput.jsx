import React from "react";

const RegionSearchInput = () => {
  return (
    <div>
      <form onSubmit={handleSearchSubmit} className="w-full">
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-md border font-semibold 
                : "bg-gray-200 text-gray-700 border-gray-300"
            }`}
          >
            지역이름
          </button>
        </div>

        <input
          type="text"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          placeholder={placeholderText}
          className="w-full"
        />
        <button>검색</button>
      </form>
    </div>
  );
};

export default RegionSearchInput;
