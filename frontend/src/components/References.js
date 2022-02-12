import { useState, useEffect } from 'react';
import { get, remove } from '../Calls.js';
import { useNavigate } from 'react-router-dom';
import { routeGetReferencesByArticle, routeDeleteReference } from '../ApiRoutes';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Button, Paper, Table, TableBody, TableCell, TableRow, TableContainer, TableHead, IconButton } from "@material-ui/core";

export default function TabelReferences() {

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [needToUpdate, setNeedToUpdate] = useState(false)

    useEffect( () => {
        async function f(){
        let data = await get(routeGetReferencesByArticle, JSON.parse(sessionStorage.getItem("idArticle")));
        setRows(data);
        }f()
    }, [needToUpdate]);

    useEffect( () => {
        async function f(){
        sessionStorage.setItem("putScreen", "");
        sessionStorage.setItem("idReference", "");
        }f()
    }, [])

    const goToFormularModificareReference = (idRef) => {
        sessionStorage.setItem("putScreen", true);
        sessionStorage.setItem("idReference", idRef);
        navigate('/formularReference');
    }

    const deleteReference = async (idRef, index) => {
        await remove(routeDeleteReference, JSON.parse(sessionStorage.getItem("idArticle")), idRef);

        rows.splice(index, 1);
        setRows(rows);
        setNeedToUpdate(!needToUpdate);
    }

    const goToFormularAdaugareReference = () => {
        sessionStorage.setItem("putScreen", "false");
        navigate('/formularReference');
    }

    return (
        <div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Reference</TableCell>
                            <TableCell align="center">Title reference</TableCell>
                            <TableCell align="center">Date reference</TableCell>
                            <TableCell align="center">List of authors</TableCell>
                            <TableCell align="center">Id article</TableCell>
                            <TableCell align="center">Actions reference</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.ReferenceId}>
                                <TableCell component="th" scope="row">
                                    {row.ReferenceId}
                                </TableCell>
                                <TableCell align="center">{row.ReferenceTitlu}</TableCell>
                                <TableCell align="center">{row.ReferenceData}</TableCell>
                                <TableCell align="center">{row.ReferenceListaAutori}</TableCell>
                                <TableCell align="center">{row.ArticleId}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => goToFormularModificareReference(row.ReferenceId)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => deleteReference(row.ReferenceId, index)}>
                                        <DeleteIcon color="secondary" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
            <Button color="primary" variant='contained' startIcon={<AddIcon />} onClick={() => goToFormularAdaugareReference()}>
                Add reference
            </Button>
            <br />
            <br />
            <Button color="primary" variant='contained' onClick={() => navigate('/')}>
                Back to articles
            </Button>
        </div >
    )
}
