const KEYWORD_LIST = [
  { id: 1, value: "애견카페" },
  { id: 2, value: "동물병원" },
  { id: 3, value: "애견호텔" }
];
const CategorySearch = ({ keyword, setClickKeyword, handleKeywordSelect }) => {
  return (
    <button
      className="navToggleBtn"
      key={keyword.id}
      onClick={() => {
        setClickKeyword(keyword.value); // TODO 변경사항
        handleKeywordSelect(keyword.value);
      }}
    >
      {keyword.value}
    </button>
  );
};

export default CategorySearch;
