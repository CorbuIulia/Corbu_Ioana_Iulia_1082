import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import mysql from 'mysql2/promise';
import { DB_USERNAME, DB_PASSWORD } from './Const.js';
import db from './dbConfig.js';



import fs from 'fs';
'use strict';

// IMPORT ENTITATI
import Article from './entities/Article.js'
import Reference from './entities/Reference.js'
import LikeOperator from './Operators.js'



let app = express();
let router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);

//----------------creare conexiune baza de date--------------------
let conn;

mysql.createConnection({
    user: DB_USERNAME,
    password: DB_PASSWORD
})
    .then(connection => {
        conn = connection;
        return connection.query("CREATE DATABASE IF NOT EXISTS Examen");
    })
    .then(() => {
        return conn.end();
    })
    .catch(err => {
        console.log(err);
    });
//-------------------sfarsit creare conexiune baza de date-------------------

//----------legatura one to many intre cele doua entitati----------------
Article.hasMany(Reference, { as: "References", foreignKey: "ArticleId" });
Reference.belongsTo(Article, { foreignKey: "ArticleId" });
//---------sfarsit legatura one to many intre cele doua entitati------------

//--------------------GET---------------------------------

//afisare articole impreuna cu referintele aferente  (afisare toti parintii cu toti copiii aferenti)
async function getArticlesFull() {
    return await Article.findAll({ include: ["References"] });
}
router.route('/getArticleFull').get(async (req, res) => {
    try {
        return res.json(await getArticleFull());
    }
    catch (err) {
        console.log(err.message);
    }
})


//afisare doar articole, fara referintele lor   (afisare toti parintii, fara copiii lor)
async function getArticles() {
    return await Article.findAll();
}
router.route('/getArticles').get(async (req, res) => {
    try {
        return res.json(await getArticles());
    }
    catch (err) {
        console.log(err.message);
    }
})

//afisare articol cu un anumit id    (afisare parinte dupa id)
async function getArticleById(id) {
    return await Article.findOne(
        {
            where: id ? { ArticleId: id } : undefined
        }
    );
}
router.route('/getArticleById/:id').get(async (req, res) => {
    try {
        return res.json(await getArticleById(req.params.id));
    }
    catch (err) {
        console.log(err.message);
    }
})


//afisare referinte ale unui anumit articol    (afisare toti copiii unui parinte)
async function getReferencesByArticle(idArticle) {
    if (!(await getArticleById(idArticle))) {
        console.log("Nu s-a gasit articolul!");
        return;
    }
    return await Reference.findAll({
        include: [{ model: Article, attributes: ["ArticleTitlu"], where: idArticle ? { ArticleId: idArticle } : undefined }]
    });
}
router.route('/getReferencesByArticle/:idArticle').get(async (req, res) => {
    try {
        return res.json(await getReferencesByArticle(req.params.idArticle));
    }
    catch (err) {
        console.log(err.message);
    }
})

//afisare o anumita referinta dintr-un articol   (afisare doar un copil al parintelui)
async function getReferenceByArticle(idArticle, idReference) {
    if (!(await getArticleById(idArticle))) {
        console.log("Nu s-a gasit articolul!");
        return;
    }
    return await Reference.findOne(
        {
            include: [{ model: Article, attributes: ["ArticleTitlu"], where: idArticle ? { ArticleId: idArticle } : undefined }],
            where: idReference ? { ReferenceId: idReference } : undefined
        }
    )
}
router.route('/getReferenceByArticle/:idArticle/:idReference').get(
    async (req, res) => {
        try {
            return res.json(await getReferenceByArticle(req.params.idArticle, req.params.idReference));
        } catch (err) {
            console.log(err.message);
        }
    }
)

// FILTRARE

//afisare toate articolele unde titlul contine CEVA si/sau rezumatul contine ALTCEVA   (afisare parinti filtrati dupa 2 campuri)
async function getArticlesFilter(filterQuery) {
    let whereClause = {};

    if (filterQuery.titlu)
        whereClause.ArticleTitlu = { [LikeOperator]: `%${filterQuery.titlu}%` };
    if (filterQuery.rezumat)
        whereClause.ArticleRezumat = { [LikeOperator]: `%${filterQuery.rezumat}%` };

    return await Article.findAll({
        where: whereClause
    })
}
router.route('/getArticlesFilter').get(async (req, res) => {
    try {
        return res.json(await getArticlesFilter(req.query));
    }
    catch (err) {
        console.log(err.message);
    }
})

// SORTARE

//afisare articole sortate descrescator dupa data   (afisare parinti - sortare)
async function getArticlesSortateDupaData() {
    return await Article.findAll({
        order: [
            ["ArticleData", "DESC"]
        ]
    });
}
router.route('/getArticlesSortateDupaData').get(async (req, res) => {
    try {
        return res.json(await getArticlesSortateDupaData());
    }
    catch (err) {
        console.log(err.message);
    }
})

//export sub forma de json
async function exportArticlesFull() {
    if (!fs.existsSync("./exported"))
        fs.mkdirSync("./exported")
    fs.writeFileSync("./exported/articles_full.json", JSON.stringify(await getArticlesFull()));
}
router.route('/exportArticlesFull').get(async (req, res) => {
    try {
        await exportArticlesFull();
        res.download("./exported/articles_full.json", "downloadArticlesFull.json");
    } catch (err) {
        console.log(err.message);
    }
})
//-----------------SFARSIT GET------------------------

//----------------POST----------------------------------- 

//adaugare articol      (adaugare parinte)
async function createArticle(article) {
    return await Article.create(article);
}
router.route('/addArticle').post(async (req, res) => {
    try {
        return res.status(201).json(await createArticle(req.body));
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error_message: "Internal server error! Could not insert article!" });
    }
})

//adaugare referinta pentru un anumit articol         (adaugare copil la parinte)
async function createReference(reference, idArticle) {
    if (!(await getArticleById(idArticle))) {
        console.log("Nu s-a gasit articolul");
        return;
    }
    reference.ArticleId = idArticle;
    return await Reference.create(reference);
}
router.route('/addReference/:idArticle').post(async (req, res) => {
    try {
        return res.status(201).json(await createReference(req.body, req.params.idArticle));
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error_message: "Internal server error! Could not insert reference!" });
    }
})
//--------------SFARSIT POST-------------------------------

//---------------------PUT--------------------

//update articol   (update parinte)
async function updateArticle(updatedArticle, idArticle) {
    if (parseInt(idArticle) !== updatedArticle.ArticleId) {
        console.log("ID diferit intre id ruta si id body");
        return;
    }
    let article = await getArticleById(idArticle);
    if (!article) {
        console.log("Nu exista articolul cu acest id");
        return;
    }

    return await article.update(updatedArticle);
}
router.route("/updateArticle/:idArticle").put(async (req, res) => {
    try {
        return res.json(await updateArticle(req.body, req.params.idArticle));
    } catch (err) {
        console.log(err.message);
    }
})

//update referinta a unui articol       (update copil al unui anumit parinte)
async function updateReference(updatedReference, idArticle, idReference) {
    if (parseInt(idReference) !== updatedReference.ReferenceId) {
        console.log("ID referinta diferit intre id ruta si id body");
        return;
    }

    let article = await getArticleById(idArticle);
    if (!article) {
        console.log("Nu exista articolul cu acest id");
        return;
    }

    let reference = await getReferenceByArticle(idArticle, idReference);
    if (!reference) {
        console.log("Nu exista referinta cu acest id pentru acest articol");
        return;
    }

    return await reference.update(updatedReference);
}
router.route("/updateReference/:idArticle/:idReference").put(async (req, res) => {
    try {
        return res.json(await updateReference(req.body, req.params.idArticle, req.params.idReference));
    } catch (err) {
        console.log(err.message);
    }
})
//-------------------SFARSIT PUT-------------------

//-----------------DELETE-------------------------

//sterge articol - implicit se sterg si referintele aferente     (delete parinte)
async function deleteArticle(idArticle) {
    let articleToBeDeleted = await getArticleById(idArticle);

    if (!articleToBeDeleted) {
        console.log("Nu exista articolul cu acest id");
        return;
    }

    return await articleToBeDeleted.destroy();
}
router.route("/deleteArticle/:idArticle").delete(async (req, res) => {
    try {
        return res.json(await deleteArticle(req.params.idArticle));
    } catch (err) {
        console.log(err.message);
    }
})

//stergere referinta a unui anumit articol specific     (stergere copil al unui parinte)
async function deleteReference(idArticle, idReference) {

    let article = await getArticleById(idArticle);
    if (!article) {
        console.log("Nu exista articolul cu acest id");
        return;
    }

    let referenceToBeDeleted = await getReferenceByArticle(idArticle, idReference);

    if (!referenceToBeDeleted) {
        console.log("Nu exista referinta cu acest id la acest articol");
        return;
    }

    return await referenceToBeDeleted.destroy();
}
router.route("/deleteReference/:idArticle/:idReference").delete(async (req, res) => {
    try {
        return res.json(await deleteReference(req.params.idArticle, req.params.idReference));
    } catch (err) {
        console.log(err.message);
    }
})
//-----------------SFARSIT DELETE----------------



let port = process.env.PORT || 8000;
app.listen(port, async () => {
    await db.sync({ alter: true });
    console.log("Baza de date sincronizata cu succes!");
});
console.log("API is running at " + port);