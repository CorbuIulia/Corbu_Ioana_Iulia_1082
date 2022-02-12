import axios from 'axios'
import {
    routeGetArticlesFull, routeGetArticles, routeGetArticleById,  routeGetReferencesByArticle,
    routeGetReferenceByArticol, routeGetArticlesSortate, routeExportArticlesFull,
    routePostArticle, routePostReference,
    routeDeleteArticle, routeDeleteReference,
    routePutArticle, routePutReference
} from './ApiRoutes.js'

async function get(p_url, searchAfter1 = null, searchAfter2 = null) {
    try {
        let newUrl;
        if (searchAfter1) {
            newUrl = p_url + "/" + searchAfter1;
            if (searchAfter2) {
                newUrl = newUrl + "/" + searchAfter2;
            }
        } else {
            newUrl = p_url;
        }

        return (await axios.get(newUrl)).data;

    } catch (err) {
        if (p_url === routeGetArticlesFull)
            alert('Nu s-au putut prelua articolele full.');
        if (p_url === routeGetArticles)
            alert('Nu s-au putut prelua articolele.');
        if (p_url === routeGetArticlesSortate)
            alert('Nu s-au putut prelua articolele sortate.');
        if (p_url === routeExportArticlesFull)
            alert('Nu s-au putut exporta articolele.');
        if (p_url === routeGetArticleById)
            alert('Nu s-a putut prelua articolul cu acest id.');
        if (p_url === routeGetReferencesByArticle)
            alert('Nu s-au putut prelua referintele din articolul acesta.');
        if (p_url === routeGetReferenceByArticol)
            alert('Nu s-a putut prelua aceasta referinta din articolul acesta.');
    }
}

async function getQuery(p_url, p_titlu, p_rezumat) {
    try {
        const params = new URLSearchParams({ titlu: p_titlu, rezumat: p_rezumat });
        let urlFilter = p_url + "?";
        return (await axios.get(`${urlFilter}${params}`)).data;
    } catch (err) {
        alert("Nu s-au putut prelua articolele filtrate dupa titlu si/sau rezumat.");
    }
}

async function post(p_url, item, id = null) {
    try {
        let newUrl = id ? p_url + "/" + id : p_url;
        return (await axios.post(
            newUrl,
            item,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )).data;
    } catch (err) {
        if (p_url === routePostArticle) {
            alert('Eroare la inserare articol!');
        }
        if (p_url === routePostReference) {
            alert('Eroare la inserare referinta!');
        }
    }
}

async function put(p_url, item, searchAfter1, searchAfter2 = null) {
    try {
        let newUrl;
        newUrl = p_url + "/" + searchAfter1;
        if (searchAfter2) {
            newUrl = newUrl + "/" + searchAfter2;
        }

        return (await axios.put(
            newUrl,
            item,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )).data;
    } catch (err) {
        if (p_url === routePutArticle) {
            alert('Eroare la modificare articol!');
        }
        if (p_url === routePutReference) {
            alert('Eroare la modificare referinta!');
        }
    }
}

async function remove(p_url, searchAfter1, searchAfter2 = null) {
    try {
        let newUrl;
        newUrl = p_url + "/" + searchAfter1;
        if (searchAfter2) {
            newUrl = newUrl + "/" + searchAfter2;
        }

        return (await axios.delete(newUrl)).data;
    } catch (err) {
        if (p_url === routeDeleteArticle) {
            alert('Eroare la stergere articol!');
        }
        if (p_url === routeDeleteReference) {
            alert('Eroare la stergere referinta!');
        }
    }
}

export { get, getQuery, post, put, remove }
