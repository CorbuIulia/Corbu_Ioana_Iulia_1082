const link = "http://localhost:8000/api";

const routeGetArticlesFull = link + '/getArticlesFull';
const routeGetArticles = link + '/getArticles';
const routeGetArticleById = link + '/getArticleById'; 
const routeGetReferencesByArticle = link + '/getReferencesByArticle'; 
const routeGetReferenceByArticol = link + '/getReferenceByArticle'; 
const routeGetArticlesFilter = link + '/getArticlesFilter'; 
const routeGetArticlesSortate = link + '/getArticlesSortateDupaData';
const routeExportArticlesFull = link + '/exportArticlesFull';

const routePostArticle = link + '/addArticle';
const routePostReference = link + '/addReference'; 

const routeDeleteArticle = link + '/deleteArticle';  
const routeDeleteReference = link + '/deleteReference'; 

const routePutArticle = link + '/updateArticle';
const routePutReference = link + '/updateReference'; 

export{routeGetArticlesFull,routeGetArticles,routeGetArticleById,routeGetReferencesByArticle,routeGetReferenceByArticol,
routeGetArticlesFilter,routeGetArticlesSortate,routeExportArticlesFull,routePostArticle,routePostReference,
routeDeleteArticle,routeDeleteReference,routePutArticle,routePutReference}

