import { DataTypes, Model } from "sequelize";
import sequelize from "..";

export interface IKata {
    id?: number; 
    name: string;
}
  
export class Kata extends Model {
    declare id?: number;
    declare name: string;

}


Kata.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true

    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        

    }
   
},{sequelize, modelName: 'kata'});


Kata.sync();