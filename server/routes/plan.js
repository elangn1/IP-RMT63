const express = require("express");
const router = express.Router();
const PlanController = require("../controllers/PlanController");

// CRUD Plan
router.post("/", PlanController.createPlan);
router.get("/", PlanController.getPlans);
router.get("/:id", PlanController.getPlanById);
router.put("/:id", PlanController.updatePlanById);
router.delete("/:id", PlanController.deletePlanById);

// Endpoint untuk AI Feedback
// Generate AI feedback
router.put("/:id/feedback", PlanController.createAIFeedbackPlan);

module.exports = router;
