import { useState, useEffect } from 'react';
import { get, getQuery, remove } from '../Calls.js';
import { useNavigate } from 'react-router-dom';
import { routeGetArticles, routeGetArticlesFilter, routeGetArticlesSortate, routeExportArticlesFull, routeDeleteArticle} from '../ApiRoutes';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Grid, TextField, Button, Paper, Table, TableBody, TableCell, TableRow, TableContainer, TableHead, IconButton } from "@material-ui/core";

export default function TabelArticles() {


    const navigate = useNavigate();
   
    const [rows, setRows] = useState([]);
    const [needToUpdate, setNeedToUpdate] = useState(false)
    const [filtrare, setFiltrare] = useState({
        ArticleTitlu: "",
        ArticleRezumat: ""
    })
  


    useEffect( () => {
        async function f(){
        let data = await get(routeGetArticles);
        setRows(data);

        }f()
    }, [needToUpdate]);
    useEffect( () => {
        async function f(){
        sessionStorage.clear();
        }f()
    }, [])


    const onChangeFiltrare = e => {
        setFiltrare({ ...filtrare, [e.target.name]: e.target.value });
    }
    const filtrareArticles = async () => {
        let data = await getQuery(routeGetArticlesFilter, filtrare.ArticleTitlu, filtrare.ArticleRezumat);
        setRows(data);
    }
    const goToFormularModificareArticle = (id) => {
        sessionStorage.setItem("putScreen", true);
        sessionStorage.setItem("idArticle", id);
        navigate('/formularArticle');
    }
    const goToFormularAdaugareArticle = () => {
        sessionStorage.setItem("putScreen", "false");
        navigate('/formularArticle');
    }

    //nu merge export
    const exporta = async () => {
        await get(routeExportArticlesFull);
    }
    
    const deleteArticle = async (id, index) => {
        await remove(routeDeleteArticle, id);

        rows.splice(index, 1);
        setRows(rows);
        setNeedToUpdate(!needToUpdate);
    }

    const sortare = async () => {
        let data = await get(routeGetArticlesSortate);
        setRows(data);
    }



    const goToTabelReferences = (idArticle) => {
        sessionStorage.setItem("idArticle", idArticle);
        navigate('/references')
    }


    return (
        <div>
            <Grid container spacing={2}
                direction="row"
                justifyContent="space-evenly"
                alignItems="center">

                <Grid item xs={2}>
                    <Button color="primary" variant='contained' startIcon={<AddIcon />} onClick={() => goToFormularAdaugareArticle()}>
                        Add Article
                    </Button >
                </Grid>

                <Grid container item spacing={1} xs={3}
                    direction="column"
                    justifyContent="center"
                    alignItems="center">

                    <TextField
                        margin="dense"
                        id="ArticleTitlu"
                        name="ArticleTitlu"
                        label="Filter for title"
                        fullWidth
                        value={filtrare.ArticleTitlu}
                        onChange={e => onChangeFiltrare(e)}
                    />
                    <TextField
                        margin="dense"
                        id="ArticleRezumat"
                        name="ArticleRezumat"
                        label="Filter for summary"
                        fullWidth
                        value={filtrare.ArticleRezumat}
                        onChange={e => onChangeFiltrare(e)}
                    />
                    <Button color="primary" variant='contained' onClick={() => filtrareArticles()}
                    >
                        Filter
                    </Button>

                </Grid>

              

                <Grid item xs={2}>
                    <Button color="primary" variant='contained' onClick={() => sortare()}>
                        Sort by date descending
                    </Button >
                </Grid>

                <Grid item xs={2}>
                    <Button color="primary" variant='contained' onClick={() => exporta()}>
                        Export articles
                    </Button >
                </Grid>
            </Grid>

            <br />

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
               
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Article</TableCell>
                            <TableCell align="center">Title article</TableCell>
                            <TableCell align="center">Summary article</TableCell>
                            <TableCell align="center">Date article</TableCell>
                            <TableCell align="center">References</TableCell>
                            <TableCell align="center">Actions article</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.ArticleId}>
                                <TableCell component="th" scope="row">
                                    {row.ArticleId}
                                </TableCell>
                                <TableCell align="center">{row.ArticleTitlu}</TableCell>
                                <TableCell align="center">{row.ArticleRezumat}</TableCell>
                                <TableCell align="center">{row.ArticleData}</TableCell>
                                <TableCell align="center">
                                    <Button color="primary" variant='contained' onClick={() => goToTabelReferences(row.ArticleId)}>
                                       Show references
                                    </Button>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => goToFormularModificareArticle(row.ArticleId)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => deleteArticle(row.ArticleId, index)}>
                                        <DeleteIcon color="secondary" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    )
}
