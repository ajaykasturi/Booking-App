import { useMemo } from "react";
export type Props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ page, pages, onPageChange }: Props) => {
  const pageNumbers = useMemo(() => {
    const pageNums = [];
    for (let i = 1; i <= pages; i++) {
      pageNums.push(i);
    }
    return pageNums;
  }, [pages]);
  return (
    <div className="flex justify-center gap-2">
      <ul className="flex gap-2">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`border border-slate-300 px-3 py-1 rounded text-1xl ${
              page === number ? "bg-gray-200" : ""
            }`}
          >
            <button onClick={() => onPageChange(number)}>{number}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Pagination;
