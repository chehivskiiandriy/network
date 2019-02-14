import axios from 'axios';

const  instance = axios.create({
  baseURL: 'https://rest01.tiw-sys.eu/api/'
});

export default instance;
