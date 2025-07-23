const { Plan } = require("../models");
const { generateGeminiContent } = require("../helpers/gemini");

class PlanController {
  static async createPlan(req, res, next) {
    try {
      const { userId, judulBelajar } = req.body;
      // Generate AI feedback
      const prompt = `Beri feedback untuk rencana belajar berikut: ${judulBelajar}`;
      const aiFeedback = await generateGeminiContent(prompt);

      // Create Plan langsung dengan aiFeedback
      const newPlan = await Plan.create({ userId, judulBelajar, aiFeedback });
      res.status(201).json(newPlan);
    } catch (err) {
      next(err);
    }
  }

  static async getAllPlans(req, res, next) {
    try {
      const plans = await Plan.findAll();
      res.status(200).json(plans);
    } catch (err) {
      next(err);
    }
  }

  static async createAIFeedbackPlan(req, res, next) {
    try {
      const { id } = req.params;
      const plan = await Plan.findByPk(id);
      if (!plan) throw { name: "NotFound" };

      const prompt = `Beri feedback untuk rencana belajar berikut: ${plan.judulBelajar}`;
      const aiFeedback = await generateGeminiContent(prompt);
      //   console.log(plan.judulBelajar, aiFeedback, "<=== AI Feedback");
      plan.aiFeedback = aiFeedback;
      await plan.save();

      res.json({ aiFeedback });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PlanController;
