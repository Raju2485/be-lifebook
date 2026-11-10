type PaginationInput = {
  page?: unknown;
  perPage?: unknown;
};

type PaginationWithCountInput = PaginationInput & {
  count?: unknown;
};

const getLimitAndOffset = ({ page, perPage }: PaginationInput) => {
  let pageNum: number;
  if (!page || isNaN(parseInt(String(page), 10)) || parseInt(String(page), 10) <= 0) {
    pageNum = 0;
  } else {
    pageNum = parseInt(String(page), 10) - 1;
  }

  let perPageNum: number;
  if (
    !perPage ||
    isNaN(parseInt(String(perPage), 10)) ||
    parseInt(String(perPage), 10) <= 0
  ) {
    perPageNum = 10;
  } else {
    perPageNum = parseInt(String(perPage), 10);
  }

  const limit = perPageNum;
  const offset = perPageNum * pageNum;

  return { limit, offset };
};

const getNewPagination = ({ count, page, perPage }: PaginationWithCountInput) => {
  let countNum: number;
  if (!count || isNaN(parseInt(String(count), 10)) || parseInt(String(count), 10) < 0) {
    countNum = 0;
  } else {
    countNum = parseInt(String(count), 10);
  }

  let pageNum: number;
  if (!page || isNaN(parseInt(String(page), 10)) || parseInt(String(page), 10) <= 0) {
    pageNum = 1;
  } else {
    pageNum = parseInt(String(page), 10);
  }

  let perPageNum: number;
  if (
    !perPage ||
    isNaN(parseInt(String(perPage), 10)) ||
    parseInt(String(perPage), 10) <= 0
  ) {
    perPageNum = 10;
  } else {
    perPageNum = parseInt(String(perPage), 10);
  }

  const total_pages = Math.ceil(countNum / perPageNum) || 1;

  let previous_page: number | null = null;
  if (pageNum > 1) {
    previous_page = pageNum - 1;
  }

  let next_page: number | null = null;
  if (pageNum < total_pages) {
    next_page = pageNum + 1;
  }

  return {
    previousPage: previous_page,
    currentPage: pageNum,
    nextPage: next_page,
    totalPages: total_pages,
    totalPerPage: perPageNum,
    totalRecords: countNum,
  };
};

export { getLimitAndOffset, getNewPagination };
