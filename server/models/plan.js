"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Plan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Plan.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Plan.init(
    {
      userId: DataTypes.INTEGER,
      judulBelajar: DataTypes.STRING,
      aiFeedback: DataTypes.TEXT,
      quizzes: DataTypes.JSONB
    },
    {
      sequelize,
      modelName: "Plan"
    }
  );
  return Plan;
};
