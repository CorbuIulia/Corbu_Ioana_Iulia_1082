import { useState, useEffect } from 'react';
import { get, put, post } from '../Calls.js';
import { useNavigate } from 'react-router-dom';
import { routePostReference, routePutReference, routeGetReferenceByArticol } from '../ApiRoutes';

import SaveIcon from '@material-ui/icons/Save'
import { Grid, TextField, Button } from '@material-ui/core';

export default function FormularReference() {

    const navigate = useNavigate();

    const [reference, setReference] = useState({
        ReferenceId: 0,
        ReferenceTitlu: "",
        ReferenceData: "",
        ReferenceListaAutori: "",
        ArticleId: JSON.parse(sessionStorage.getItem("idArticle"))
    })

    const onChangeReference = e => {
        setReference({ ...reference, [e.target.name]: e.target.value });
    }

    const saveReference = async () => {
        if (!JSON.parse(sessionStorage.getItem("putScreen")))
            await post(routePostReference, reference, JSON.parse(sessionStorage.getItem("idArticle")));  
        else  
            await put(routePutReference, reference, reference.ArticleId, reference.ReferenceId);   

        navigate('/references');
        console.log("aici")
    }

    useEffect(() => {
        async function f(){
        if (JSON.parse(sessionStorage.getItem('putScreen'))) {  
            let data = await get(routeGetReferenceByArticol, JSON.parse(sessionStorage.getItem("idArticle")), JSON.parse(sessionStorage.getItem("idReference")));
            setReference(data);
        }
    }f()
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
                        id="ReferenceId"
                        name="ReferenceId"
                        label="Id reference"
                        fullWidth
                        disabled={true}
                        value={reference.ReferenceId}
                        onChange={e => onChangeReference(e)} />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        margin="dense"
                        id="ReferenceTitlu"
                        name="ReferenceTitlu"
                        label="Title reference"
                        fullWidth
                        value={reference.ReferenceTitlu}
                        onChange={e => onChangeReference(e)} />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        margin="dense"
                        id="ReferenceData"
                        name="ReferenceData"
                        label="Date reference"
                        fullWidth
                        value={reference.ReferenceData}
                        onChange={e => onChangeReference(e)} />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        margin="dense"
                        id="ReferenceListaAutori"
                        name="ReferenceListaAutori"
                        label="List of authors"
                        fullWidth
                        value={reference.ReferenceListaAutori}
                        onChange={e => onChangeReference(e)} />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        margin="dense"
                        id="ArticleId"
                        name="ArticleId"
                        label="Id article"
                        fullWidth
                        disabled={true}
                        value={reference.ArticleId}
                        onChange={e => onChangeReference(e)} />
                </Grid>
            </Grid>

            <br />

            <Button color="primary" variant='contained' startIcon={<SaveIcon />} onClick={() => saveReference()}>
                Save
            </Button>
        </div>
    )
}