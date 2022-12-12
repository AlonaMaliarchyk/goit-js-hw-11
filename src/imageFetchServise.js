import axios from "axios";


export class ImageFetchservice {

    #BASE_URL;
    #API_KEY;
    #IMAGE_TYPE;
    #ORIENTATION;
    #SAFESEARCH;
    #PER_PAGE;
    MAX_RESULTS_LIMIT;

    constructor() {
        this.#BASE_URL = 'https://pixabay.com/api/';
        this.#API_KEY = '31935379-2c0634669ff1003b6320ce3d9';
        this.#IMAGE_TYPE = 'photo';
        this.#ORIENTATION = 'vertical';
        this.#SAFESEARCH = 'true';
        this.#PER_PAGE = 40;
        this.MAX_RESULTS_LIMIT = 500;
    }

    getImages(searchTerm, page) {
        return axios.get(`${this.#BASE_URL}?key=${this.#API_KEY}&q=${searchTerm}&page=${page}&per_page=${this.#PER_PAGE}&image_type=${this.#IMAGE_TYPE}&orientation=${this.#ORIENTATION}&safesearch=${this.#SAFESEARCH}`);
    };

}

