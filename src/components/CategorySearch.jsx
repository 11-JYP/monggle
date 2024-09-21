const KEYWORD_LIST = [
  { id: 1, value: "애견카페" },
  { id: 2, value: "동물병원" },
  { id: 3, value: "애견호텔" }
];
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
