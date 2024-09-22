const CategorySearch = ({ keyword, setClickKeyword, handleKeywordSelect, clickKeyword }) => {
  return (
    <button
      className={`navToggleBtn ${clickKeyword === keyword.value ? "bg-[#FFA500] text-white" : ""}`}
      key={keyword.id}
      onClick={() => {
        setClickKeyword(keyword.value);
        handleKeywordSelect(keyword.value);
      }}
    >
      {keyword.value}
    </button>
  );
};

export default CategorySearch;
