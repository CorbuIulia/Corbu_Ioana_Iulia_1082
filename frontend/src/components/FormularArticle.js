import { useState, useEffect } from 'react';
import { get, put, post } from '../Calls.js';
import { useNavigate } from 'react-router-dom';
import { routePostArticle, routeGetArticleById, routePutArticle } from '../ApiRoutes';

import SaveIcon from '@material-ui/icons/Save'
import { Grid, TextField, Button } from '@material-ui/core';

export default function FormularArticle() {

    const navigate = useNavigate();

    const [article, setArticle] = useState({
        ArticleId: 0,
        ArticleTitlu: "",
        ArticleRezumat: "",
        ArticleData: ""
    })

    const onChangeArticle = e => {
        setArticle({ ...article, [e.target.name]: e.target.value });
    }

    const saveArticle = async () => {
        if (!JSON.parse(sessionStorage.getItem("putScreen")))
            await post(routePostArticle, article);
        else
            await put(routePutArticle, article, article.ArticleId);

        navigate('/');
    }

    useEffect( () => {
        async function f(){
        if (JSON.parse(sessionStorage.getItem('putScreen'))) {
            let data = await get(routeGetArticleById, JSON.parse(sessionStorage.getItem("idArticle")));
            setArticle(data);
        }
    } f()
    }, [])

    return (
        <div>
            <Grid container
                spacing={2}
                direction="row"
                justifyContent="flex-start">

                <Grid item xs={2}>
                    <TextField
                        margin="dense"
                        id="ArticleId"
                        name="ArticleId"
                        label="Id article"
                        fullWidth
                        disabled={true}
                        value={article.ArticleId}
                        onChange={e => onChangeArticle(e)} />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        margin="dense"
                        id="ArticleTitlu"
                        name="ArticleTitlu"
                        label="Title article"
                        fullWidth
                        value={article.ArticleTitlu}
                        onChange={e => onChangeArticle(e)} />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        margin="dense"
                        id="ArticleRezumat"
                        name="ArticleRezumat"
                        label="Summary article"
                        fullWidth
                        value={article.ArticleRezumat}
                        onChange={e => onChangeArticle(e)} />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        margin="dense"
                        id="ArticleData"
                        name="ArticleData"
                        label="Date article"
                        fullWidth
                        value={article.ArticleData}
                        onChange={e => onChangeArticle(e)} />
                </Grid>
            </Grid>

            <br />

            <Button color="primary" variant='contained' startIcon={<SaveIcon />} onClick={() => saveArticle()}>
                Save
            </Button>
        </div>
    )
}