const express = require("express");
const router = express.Router();
const PlanController = require("../controllers/PlanController");

// CRUD Plan
router.post("/", PlanController.createPlan); // Create Plan
router.get("/", PlanController.getAllPlans); // Get all Plans

// Endpoint untuk AI Feedback
router.put("/:id/feedback", PlanController.createAIFeedbackPlan); // Generate AI feedback

module.exports = router;
