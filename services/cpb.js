

locale = 'en';

BASE_URL  = "http://192.168.0.115:8000/api/v2/pages/?locale="+locale

URL     = "https://reactnative.dev/movies.json"

export function getUpdates() {
    return fetch(URL)
    .then(response => response.json())
    .then(json => {return json.movies;})
    .catch(error => {
      console.error(error);
    });
  }


URL_PRODUCT     = "https://dummyjson.com/products"

export function getProducts() {
    return fetch(URL_PRODUCT)
    .then(response => response.json())
    .then(json => {return json.products;})
    .catch(error => {
      console.error(error);
    });
  }


URL_FAQ =  BASE_URL+"&type=faq.faqPage&fields=question,answer,related_links,related_documents"

export function getFaq() {
  console.log(URL_FAQ)

    return fetch(URL_FAQ)
    .then(response => response.json())
    .then(json => {return json.items;})
    .catch(error => {
      console.error(error);
    });
  }
  