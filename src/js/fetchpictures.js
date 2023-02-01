import axios from 'axios';

export const picturesApiSer = {
  searchQuery: '',
  page: 1,

  async fetchPictures() {
    const response = await axios.get(
      `https://pixabay.com/api/?key=33257823-2ec7b17938c0bf72817c659ff&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    );
    const pictures = await response.data;
    this.page += 1;
    return pictures;
  },

  getQuery() {
    return this.searchQuery;
  },

  newQuery(newQuery) {
    this.searchQuery = newQuery;
  },

  resetPage() {
    this.page = 1;
  },
};
