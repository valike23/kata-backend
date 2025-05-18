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
  nextBoutId?: number | null;     // ← new
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
  declare nextBoutId: number | null;  // ← new
}

Bout.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  entry1Id: {
    type: DataTypes.INTEGER,
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
  },
  // NEW FIELD: which bout the winner should advance into
  nextBoutId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "the ID of the Bout in the next round that this match's winner will enter"
  }
}, {
  sequelize,
  modelName: 'bout',
  timestamps: true
});

// existing associations
Bout.belongsTo(Entry, { foreignKey: "entry1Id", as: "entry1" });
Bout.belongsTo(Entry, { foreignKey: "entry2Id", as: "entry2" });
Bout.belongsTo(Entry, { foreignKey: "winnerId", as: "winner" });
Bout.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Bout.belongsTo(Competition, { foreignKey: "competitionId", as: "competition" });

// self-referential associations
Bout.belongsTo(Bout, { foreignKey: "nextBoutId", as: "nextBout" });
Bout.hasMany(Bout,  { foreignKey: "nextBoutId", as: "previousBouts" });

// Sync (in development you can use alter rather than force)
(async () => {
  await sequelize.sync({ force: true });
})();
