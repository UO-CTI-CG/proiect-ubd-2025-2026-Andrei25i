import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import prevIcon from "../../assets/prev.svg";
import nextIcon from "../../assets/next.svg";
import styles from "./PaginatedList.module.css";

const PaginatedList = ({ items, itemsPerPage = 20, renderItem }) => {
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageClick = (e) => {
    const newOffset = (e.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    setItemOffset(0);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className={styles.noResults}>
        <p>Nu a fost găsit niciun rezultat conform criteriilor.</p>
      </div>
    );
  }

  return (
    <div className={styles.paginatedList}>
      <div className={styles.gridContainer}>
        {currentItems.map((item) => renderItem(item))}
      </div>

      {pageCount > 1 && (
        <ReactPaginate
          breakLabel="..."
          previousLabel={<img src={prevIcon} />}
          nextLabel={<img src={nextIcon} />}
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={pageCount}
          containerClassName={styles.pagination}
          pageClassName={styles.pageItem}
          pageLinkClassName={styles.pageLink}
          previousClassName={styles.navBtn}
          nextClassName={styles.navBtn}
          breakClassName={styles.pageItem}
          activeClassName={styles.activePage}
          disabledClassName={styles.disabled}
        />
      )}
    </div>
  );
};

export default PaginatedList;
