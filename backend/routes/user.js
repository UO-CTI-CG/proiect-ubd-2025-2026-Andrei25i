import express from "express";
import db from "../db.js";

const router = express.Router();

// GET user details with their ads
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const userQuery = `
        SELECT id, first_name, last_name, email, phone_number, city, created_at 
        FROM users
        WHERE id = $1;
    `;

    const userResult = await db.query(userQuery, [id]);

    if (userResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Utilizatorul nu a fost găsit sau nu există" });
    }

    const user = userResult.rows[0];

    const adsQuery = `
        SELECT id, title, price, image_url, created_at
        FROM ads
        WHERE user_id = $1
        ORDER BY created_at DESC;
    `;

    const adsResult = await db.query(adsQuery, [id]);

    const response = {
      ...user,
      ads: adsResult.rows,
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la preluarea profilului" });
  }
});

export default router;
