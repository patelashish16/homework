import axios from 'axios';

interface IHttpRequestOptions {
  url: string;
}

const get = (options: IHttpRequestOptions) =>
  axios.get(
    options.url,
  )
    .then((response) => response.data);

const post = (options: any,data:any) =>
  axios.post(
    options.url,data 
  )
    .then((response) => response.data);

export const api = {
  get, post
}

