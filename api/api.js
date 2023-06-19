import axios from 'axios';

const api = {
  getCards: async (pageNumber, pageSize) => {
    const url = 'https://cardsapp-1c06e7ea9869.herokuapp.com/';
    return await axios.get(url, {
      params: {pageNumber, pageSize},
    });
  },
};

export default api;
