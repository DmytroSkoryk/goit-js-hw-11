'use strict'
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '34736724-43de875ebed23001707db1297'

export async function fetchPhoto(searchName, page) {
  try {
    const response = await axios.get(`${BASE_URL}?key=${KEY}&q=${searchName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}