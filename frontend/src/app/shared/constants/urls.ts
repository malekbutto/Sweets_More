const BASE_URL = 'http://localhost:5000';
export const FOODS_URL = BASE_URL + '/api/foods';
export const FOODS_TAGS_URL = BASE_URL + '/api/tags';
export const FOODS_BY_SEARCH_URL = BASE_URL + '/api/search/';
export const FOODS_BY_TAG_URL = BASE_URL + '/api/tag/';
export const FOODS_BY_ID_URL = FOODS_TAGS_URL + '/';
export const ADD_FOOD = FOODS_URL + '/addProduct';
export const EDIT_FOOD = FOODS_URL + '/editProduct';
export const DELETE_FOOD = FOODS_URL + '/deleteProduct';

export const USERS_URL = BASE_URL + '/api/users';
export const USER_LOGIN_URL = BASE_URL + '/api/users/login';
export const USER_REGISTER_URL = BASE_URL + '/api/users/register';
export const USER_UPDATE_URL = BASE_URL + '/api/users/update';

export const ORDERS_URL = BASE_URL + '/api/orders';
export const ORDER_CREATE_URL = ORDERS_URL + '/create';

