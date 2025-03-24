import { DataTypes, Model } from "sequelize";
import sequelize from "..";
import { Category } from "./category.model";

export interface Icompetition{
    id?: number;
    competitionName?: string;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
    active?: boolean
}
export class Competition extends Model {
    declare id: number;
    declare competitionName: string;
    declare image: string;
    declare active: boolean;
}

Competition.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true

    },
    competitionName:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true

    },
    image:{
        type: DataTypes.STRING,
        allowNull: true,

    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
 
},{sequelize, modelName: 'competition'});


Competition.hasMany(Category);
//Competition.hasMany(Entry);
Competition.sync();