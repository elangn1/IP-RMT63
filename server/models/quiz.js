"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    static associate(models) {
      Quiz.belongsTo(models.Plan, { foreignKey: "planId" });
    }
  }
  Quiz.init(
    {
      planId: DataTypes.INTEGER,
      pertanyaan: DataTypes.STRING,
      correctAnswer: DataTypes.STRING,
      userAnswer: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Quiz"
    }
  );
  return Quiz;
};
