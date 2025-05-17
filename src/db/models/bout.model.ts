// models/bout.model.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "..";
import { Entry } from "./entry.model";
import { Category } from "./category.model";
import { Competition } from "./competition.model";

export interface Ibout {
  id?: number;
  entry1Id?: number | null;
  entry2Id?: number | null;
  winnerId?: number | null;
  categoryId?: number;
  round?: number;
  competitionId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Bout extends Model {
  declare id: number;
  declare entry1Id: number | null;
  declare entry2Id: number | null;
  declare winnerId: number | null;
  declare categoryId: number;
  declare round: number;
  declare competitionId: number;
}

Bout.init({
  id: {
    type: DataTypes.INTEGER,      // ← must be INTEGER for SQLite autoincrement
    autoIncrement: true,
    primaryKey: true
  },
  entry1Id: {
    type: DataTypes.INTEGER,      // ← allowNull so you can seed future rounds/byes
    allowNull: true
  },
  entry2Id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  winnerId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  round: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  competitionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'bout',
  timestamps: true
});

Bout.belongsTo(Entry, { foreignKey: "entry1Id", as: "entry1" });
Bout.belongsTo(Entry, { foreignKey: "entry2Id", as: "entry2" });
Bout.belongsTo(Entry, { foreignKey: "winnerId", as: "winner" });
Bout.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Bout.belongsTo(Competition, { foreignKey: "competitionId", as: "competition" });

// If you’re in development you can force-recreate the table:


(async ()=>{
await Bout.sync({ force: true });
})()
