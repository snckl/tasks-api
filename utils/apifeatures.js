export default class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    //Advanced Filtering
    // There are no numerical values but for implementations.
    const queryStr = JSON.stringify(queryObj);
    queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    // WARNING WITHOUT RETURNING NEW IMPLEMENTATIONS WILL NOT WORK!
    return this;
  }
  sort() {
    //Sorting
    // There are no numerical values but for implementations.
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-uploadDate');
    }

    return this;
  }
  limitField() {
    //Limiting field with queryString
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }
  pagination() {
    //Pagination and limitation
    // if user type page 1 in order to not skip we decrease 1.
    this.query = this.query
      .skip((this.queryString.limit - 1) * this.queryString.page)
      .limit(this.queryString.limit * 1);

    return this;
  }
}
