const getLimitAndOffset = ({ page, perPage }) => {
    if (!page || isNaN(parseInt(page, 10)) || parseInt(page, 10) <= 0) {
      page = 0;
    } else {
      page = parseInt(page, 10) - 1;
    }
  
    if (
      !perPage ||
      isNaN(parseInt(perPage, 10)) ||
      parseInt(perPage, 10) <= 0
    ) {
      perPage = 10;
    } else {
      perPage = parseInt(perPage, 10);
    }
  
    const limit = perPage;
    const offset = perPage * page;
  
    return { limit, offset };
  };
  
const getNewPagination = ({ count, page, perPage }) => {

  if (!count || isNaN(parseInt(count, 10)) || parseInt(count, 10) < 0) {
    count = 0;
  } else {
    count = parseInt(count, 10);
  }

  if (!page || isNaN(parseInt(page, 10)) || parseInt(page, 10) <= 0) {
    page = 1;
  } else {
    page = parseInt(page, 10);
  }

  if (
    !perPage ||
    isNaN(parseInt(perPage, 10)) ||
    parseInt(perPage, 10) <= 0
  ) {
    perPage = 10;
  } else {
    perPage = parseInt(perPage, 10);
  }

  let total_pages = Math.ceil(count / perPage) || 1;

  let previous_page = null;
  if (page > 1) {
    previous_page = page - 1;
  }

  let next_page = null;
  if (page < total_pages) {
    next_page = page + 1;
  }

  return {
    previousPage: previous_page,
    currentPage: page,
    nextPage: next_page,
    totalPages: total_pages,
    totalPerPage: perPage,
    totalRecords: count,
  };
};
  
export { getLimitAndOffset, getNewPagination };
  