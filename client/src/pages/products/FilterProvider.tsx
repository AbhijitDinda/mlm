import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { trpc } from "../../trpc";
import { PageSizeOptions } from "./ProductPagination";
import { Product } from "./ProductsList";
import { SortOptions } from "./SortFilter";

interface FilterContextType {
  isFetching: boolean;
  error: any;
  products: Product[];
  rowCount: number;
  resultCount: number;
  page: number;
  pageSize: PageSizeOptions;
  sort: SortOptions;
  search?: string;
  category?: string;
  subCategory?: string;
  subSubCategory?: string;
  queryOptions: {
    pageIndex: number;
    pageSize: PageSizeOptions;
    sort: SortOptions;
    search: string;
  };
  onChangeSearch: (search: string) => void;
  onChangeSort: (text: SortOptions) => void;
  onChangePage: (page: number) => void;
  onChangeCategory: (text: string) => void;
  onChangeSubCategory: (text: string) => void;
  onChangeSubSubCategory: (text: string) => void;
  onChangePageSize: (text: PageSizeOptions) => void;
  onResetAll: () => void;
  isDefaultFilter: boolean;
}

const FilterContext = createContext<FilterContextType>({} as FilterContextType);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<PageSizeOptions>(10);
  const [sort, setSort] = useState("featured" as SortOptions);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");

  const queryOptions = useMemo(
    () => ({
      pageIndex: page,
      pageSize,
      sort,
      search,
      category,
      subCategory,
      subSubCategory,
    }),
    [page, sort, search, pageSize, category, subCategory, subSubCategory]
  );
  const onChangeSearch = (search: string) => setSearch(search);
  const onChangeSort = (text: SortOptions) => setSort(text);
  const onChangePage = (page: number) => setPage(page);
  const onChangeCategory = (text: string) => setCategory(text);
  const onChangeSubCategory = (text: string) => setSubCategory(text);
  const onChangeSubSubCategory = (text: string) => setSubSubCategory(text);
  const onChangePageSize = (text: PageSizeOptions) => setPageSize(text);

  const { data, isFetching, error } = trpc.product.list.useQuery(queryOptions);
  const _data = data! ?? { rowCount: 0, rows: [] };
  const { rows: products, rowCount } = _data;
  const resultCount = _data.rows.length;
  const isDefaultFilter =
    category === "" &&
    subCategory === "" &&
    subSubCategory === "" &&
    search === "";

  const onResetAll = () => {
    setCategory("");
    setSubCategory("");
    setSubSubCategory("");
    setSearch("");
    setSort("featured");
    setPage(0);
  };

  return (
    <FilterContext.Provider
      value={{
        isFetching,
        products,
        error,
        rowCount,
        resultCount,
        page,
        pageSize,
        sort,
        search,
        category,
        subCategory,
        subSubCategory,
        queryOptions,
        onChangeSearch,
        onChangeSort,
        onChangePage,
        onChangeCategory,
        onChangeSubCategory,
        onChangeSubSubCategory,
        onChangePageSize,
        onResetAll,
        isDefaultFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

const useProductFilter = () => {
  const context = useContext(FilterContext);
  if (!context)
    throw new Error("Filter context must be use inside FilterProvider");
  return context;
};
export default useProductFilter;
