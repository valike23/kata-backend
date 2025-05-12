import { DataTypes, Model } from "sequelize";
import sequelize from "..";

export interface Iclub {
    id?: number;
    clubName?: string;
    flag?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Club extends Model {
    declare id: number;
    declare clubName: string;
    declare flag: string;

}

Club.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true

    },
    clubName:{
        type: DataTypes.STRING,
        allowNull: false,
        

    },
    flag:{
        type: DataTypes.STRING,
        allowNull: false,
    }

   
},{sequelize, modelName: 'club'});


Club.sync();