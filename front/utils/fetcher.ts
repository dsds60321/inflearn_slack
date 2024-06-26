import axios from 'axios';

const fetcher = (url: string) => {
  return axios.get(url).then((response) => response.data);
};

export default fetcher;
