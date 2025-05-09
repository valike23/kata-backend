import { DataTypes, Model } from "sequelize";
import sequelize from "..";
import { Entry } from "./entry.model";
import { Category } from "./category.model";
import { Competition } from "./competition.model";

export interface Ibout {
    id?: number;
    entry1Id?: number;
    entry2Id?: number;
    winnerId?: number;
    categoryId?: number;
    round?: number;
    competitionId?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Bout extends Model {
    declare id: number;
    declare entry1Id: number;
    declare entry2Id: number;
    declare winnerId: number | null;
    declare categoryId: number;
    declare round: number;
    declare competitionId: number;
}

Bout.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    entry1Id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    entry2Id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    winnerId: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    categoryId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    round: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    competitionId: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, { sequelize, modelName: 'bout' });

Bout.belongsTo(Entry, { foreignKey: "entry1Id", as: "entry1" });
Bout.belongsTo(Entry, { foreignKey: "entry2Id", as: "entry2" });
Bout.belongsTo(Entry, { foreignKey: "winnerId", as: "winner" });
Bout.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Bout.belongsTo(Competition, { foreignKey: "competitionId", as: "competition" });

Bout.sync();