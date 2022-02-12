import db from '../dbConfig.js';
import Sequelize from 'sequelize';

const Reference = db.define("Reference", {
    ReferenceId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ReferenceTitlu: {
        type: Sequelize.STRING,
        validate: {
            len: {
                args: [5, 100],
                msg: "Titlu referinta trb sa aiba intre 5 si 100 caractere!"
            }
        },
        allowNull: false
    },
    ReferenceData: {
        type: Sequelize.DATEONLY,
        validate: {
            isDate: {
                msg: "Data referinta nu respecta formatul YYYY-MM-DD!"
            }
        },
        allowNull: false
    },
    ReferenceListaAutori: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ArticleId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

export default Reference;