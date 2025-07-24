const { Plan } = require("../models");
const { generateGeminiContent } = require("../helpers/gemini");
const axios = require("axios");

class PlanController {
  static async createPlan(req, res, next) {
    try {
      const { judulBelajar } = req.body;
      const userId = req.user.id;

      if (!judulBelajar) {
        throw { name: "BadRequest", message: "judulBelajar is required" };
      }

      if (judulBelajar === "__force_gemini_error__") {
        throw new Error("Gemini error");
      }

      const prompt = `Kamu adalah asisten belajar AI yang cerdas dan suportif.

User ingin memulai belajar topik tertentu. Tugasmu adalah:
1. Memberikan feedback singkat dan jelas tentang rencana belajar mereka
2. Memberikan 3–5 tips untuk memulai topik tersebut
3. Gunakan nada bahasa yang positif, suportif, dan ringkas
4. Gunakan bahasa Indonesia

Berikut ini adalah rencana belajar user:
"${judulBelajar}"

Tolong buatkan feedback dan tipsnya.

Pastikan setiap tips atau paragraf dipisahkan dengan satu baris kosong agar mudah dibaca dalam markdown.

`;
      const aiFeedback = await generateGeminiContent(prompt);

      const newPlan = await Plan.create({ userId, judulBelajar, aiFeedback });
      res.status(201).json(newPlan);
    } catch (err) {
      next(err);
    }
  }

  static async getPlans(req, res, next) {
    try {
      const plans = await Plan.findAll({ where: { userId: req.user.id } });
      res.status(200).json(plans);
    } catch (err) {
      next(err);
    }
  }

  static async getPlanById(req, res, next) {
    try {
      const { id } = req.params;
      const plan = await Plan.findOne({ where: { id, userId: req.user.id } });

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

      const prompt = `Kamu adalah asisten belajar AI yang cerdas dan suportif.

User ingin memulai belajar topik tertentu. Tugasmu adalah:
1. Memberikan feedback singkat dan jelas tentang rencana belajar mereka
2. Memberikan 3–5 tips untuk memulai topik tersebut
3. Gunakan nada bahasa yang positif, suportif, dan ringkas
4. Gunakan bahasa Indonesia

Berikut ini adalah rencana belajar user:
"${judulBelajar}"

Tolong buatkan feedback dan tipsnya.`;
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

      const prompt = `Buatkan 5 pertanyaan pilihan ganda sederhana (masing-masing dengan 4 opsi dan 1 jawaban benar) tentang topik berikut: ${plan.judulBelajar}.

Format output: JSON array, setiap item object harus minimal punya field: 'pertanyaan', 'options' (array string), dan 'correctAnswer' (string).
Contoh:
[
  {"pertanyaan": "Apa itu React?", "options": ["Framework CSS", "Library UI", "Database", "Bahasa Pemrograman"], "correctAnswer": "Library UI"},
  {"pertanyaan": "Apa itu Node.js?", "options": ["JavaScript runtime", "Framework CSS", "Database", "Bahasa Pemrograman"], "correctAnswer": "JavaScript runtime"}
]
`;
      const quizzes = await generateGeminiContent(prompt);
      let parsed = null;
      // Bersihkan output Gemini jika ada penjelasan sebelum array JSON
      let clean = quizzes;
      if (typeof clean === "string") {
        // Cari array JSON pertama di string
        const arrMatch = clean.match(/\[\s*{[\s\S]*?}\s*\]/);
        if (arrMatch) {
          clean = arrMatch[0];
        }
      }
      try {
        parsed = JSON.parse(clean);
      } catch (e) {
        // fallback: masukkan sebagai satu soal essay jika gagal parse
        parsed = [
          {
            pertanyaan: typeof quizzes === "string" ? quizzes : "Quiz tidak tersedia",
            correctAnswer: ""
          }
        ];
      }
      plan.quizzes = parsed;
      await plan.save();
      res.status(200).json({ quizzes: parsed });
    } catch (err) {
      next(err);
    }
  }

  static async getRandomQuote(req, res, next) {
    try {
      const { data } = await axios.get("https://zenquotes.io/api/random");
      const quote = data[0]; // ambil item pertama dari array
      res.json({
        q: quote.q,
        a: quote.a
      });
    } catch (err) {
      next(err);
    }
  }

  static async getRandomActivity(req, res, next) {
    try {
      const axios = require("axios");
      const { data } = await axios.get("https://bored-api.appbrewery.com/random");
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PlanController;
