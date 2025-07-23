const express = require("express");
const router = express.Router();
const PlanController = require("../controllers/PlanController");
const authentication = require("../middleware/authentication");

router.use(authentication);

// CRUD Plan
router.post("/", PlanController.createPlan);
router.get("/", PlanController.getPlans);
router.get("/:id", PlanController.getPlanById);
router.put("/:id", PlanController.updatePlanById);
router.delete("/:id", PlanController.deletePlanById);

// Endpoint untuk AI Feedback
// Generate AI feedback
router.put("/:id/feedback", PlanController.createAIFeedbackPlan);
// Genereate quizzes otomatis dari Gemini
router.post("/:id/generate-quizzes", PlanController.generateQuizzesFromGemini);

module.exports = router;
