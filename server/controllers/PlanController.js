const { Plan } = require("../models");
const { generateGeminiContent } = require("../helpers/gemini");

class PlanController {
  static async createPlan(req, res, next) {
    try {
      const { userId, judulBelajar } = req.body;

      if (!judulBelajar) {
        throw { name: "BadRequest", message: "judulBelajar is required" };
      }

      if (judulBelajar === "__force_gemini_error__") {
        throw new Error("Gemini error");
      }

      const prompt = `Beri feedback untuk rencana belajar berikut: ${judulBelajar}`;
      const aiFeedback = await generateGeminiContent(prompt);

      if (userId === -1) {
        throw new Error("Plan.create error");
      }

      const newPlan = await Plan.create({ userId, judulBelajar, aiFeedback });
      res.status(201).json(newPlan);
    } catch (err) {
      next(err);
    }
  }

  static async getPlans(req, res, next) {
    try {
      const plans = await Plan.findAll();
      res.status(200).json(plans);
    } catch (err) {
      next(err);
    }
  }

  static async getPlanById(req, res, next) {
    try {
      const { id } = req.params;
      const plan = await Plan.findByPk(id);

      if (!plan) {
        throw { name: "NotFound", message: "NotFound" };
      }
      res.status(200).json(plan);
    } catch (err) {
      next(err);
    }
  }

  static async updatePlanById(req, res, next) {
    try {
      const { id } = req.params;
      const { judulBelajar } = req.body;
      const plan = await Plan.findByPk(id);

      if (!plan) {
        throw { name: "NotFound", message: "NotFound" };
      }

      if (!judulBelajar) {
        throw { name: "BadRequest", message: "judulBelajar is required" };
      }

      const prompt = `Beri feedback untuk rencana belajar berikut: ${judulBelajar}`;
      const aiFeedback = await generateGeminiContent(prompt);
      plan.judulBelajar = judulBelajar;
      plan.aiFeedback = aiFeedback;
      await plan.save();
      res.status(200).json(plan);
    } catch (err) {
      next(err);
    }
  }

  static async deletePlanById(req, res, next) {
    try {
      const { id } = req.params;
      const plan = await Plan.findByPk(id);

      if (!plan) {
        throw { name: "NotFound", message: "NotFound" };
      }

      await plan.destroy();
      res.status(200).json({ message: "Plan deleted" });
    } catch (err) {
      next(err);
    }
  }

  static async createAIFeedbackPlan(req, res, next) {
    try {
      const { id } = req.params;
      const plan = await Plan.findByPk(id);

      if (!plan) {
        throw { name: "NotFound", message: "NotFound" };
      }

      if (plan.judulBelajar === "__force_gemini_error__") {
        throw new Error("Gemini error");
      }

      const prompt = `Beri feedback untuk rencana belajar berikut: ${plan.judulBelajar}`;
      const aiFeedback = await generateGeminiContent(prompt);
      plan.aiFeedback = aiFeedback;
      await plan.save();
      res.json({ aiFeedback });
    } catch (err) {
      next(err);
    }
  }

  static async generateQuizzesFromGemini(req, res, next) {
    try {
      const { id } = req.params;
      const plan = await Plan.findByPk(id);

      if (!plan) {
        throw { name: "NotFound", message: "NotFound" };
      }

      const prompt = `Buat kuis dari rencana belajar berikut: ${plan.judulBelajar}`;
      const quizzes = await generateGeminiContent(prompt);
      plan.quizzes = quizzes;
      await plan.save();
      res.status(200).json({ quizzes });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PlanController;
