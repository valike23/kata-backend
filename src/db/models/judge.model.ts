import { DataTypes, Model } from "sequelize";
import sequelize from "..";


  export interface Ijudge {
    id?: number;
    judgeName?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export class Judge extends Model {
    declare id: number;
    declare judgeName: string;
    declare password: string;
}


Judge.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true

    },
    judgeName:{
        type: DataTypes.STRING,
        allowNull: false,
        

    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        

    }
},{sequelize, modelName: 'judge'});

Judge.sync();