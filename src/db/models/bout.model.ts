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
  nextBoutId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Bout extends Model<Ibout> implements Ibout {
  declare id: number;
  declare entry1Id: number | null;
  declare entry2Id: number | null;
  declare winnerId: number | null;
  declare categoryId: number;
  declare round: number;
  declare competitionId: number;
  declare nextBoutId: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Bout.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    entry1Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    entry2Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    winnerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    round: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    competitionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nextBoutId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "the ID of the Bout in the next round that this match's winner will enter",
    },
  },
  {
    sequelize,
    modelName: "bout",
    tableName: "bouts",
    timestamps: true,
  }
);

// Associations
Bout.belongsTo(Entry, { foreignKey: "entry1Id", as: "entry1" });
Bout.belongsTo(Entry, { foreignKey: "entry2Id", as: "entry2" });
Bout.belongsTo(Entry, { foreignKey: "winnerId", as: "winner" });
Bout.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Bout.belongsTo(Competition, { foreignKey: "competitionId", as: "competition" });
Bout.belongsTo(Bout, { foreignKey: "nextBoutId", as: "nextBout" });
Bout.hasMany(Bout, { foreignKey: "nextBoutId", as: "previousBouts" });

// Bootstrap: ensure column & FK exist without full alter
(async () => {
  // sync base model (create table if missing)
  await sequelize.sync({});

  const qi = sequelize.getQueryInterface();
  const tableDef = await qi.describeTable("bouts");

  if (!tableDef.nextBoutId) {
    // 1. Add column
    await qi.addColumn("bouts", "nextBoutId", {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "the ID of the Bout in the next round that this match's winner will enter",
    });

    // 2. Add FK constraint
    await qi.addConstraint("bouts", {
      fields: ["nextBoutId"],
      type: "foreign key",
      name: "fk_bouts_nextBoutId",
      references: { table: "bouts", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  }
})();
