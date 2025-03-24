import { DataTypes, Model } from "sequelize";
import sequelize from "..";
import { Club } from "./club.model";
import { Competition } from "./competition.model";
import { Category } from "./category.model";

export interface Ientry {
    id?: number;
    name?: string;
    categoryName?: string;
    clubName?: string;
    flag?: string;
    categoryId?: string;
    clubId?: number;
    competitionId?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Entry extends Model {
    declare id: number;
    declare name: string;
    declare categoryId: number;
    declare clubId: number;
    declare competitionId: number;

}

Entry.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true

    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        

    },
    categoryId:{
        type: DataTypes.BIGINT,
        

    }, 
     competitionId:{
      type: DataTypes.BIGINT,
      

  },
    clubId:{
        type: DataTypes.BIGINT,
        

    }
   
},{sequelize, modelName: 'entry'});
Entry.belongsTo(Club, { foreignKey: "clubId", as: "club" });
Entry.belongsTo(Competition, { foreignKey: "competitionId", as: "competition" });
Entry.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Entry.sync();