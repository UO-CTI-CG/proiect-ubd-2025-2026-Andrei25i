import express from "express";
import db from "../db.js";

const router = express.Router();

// All ads
router.get("/", async (req, res) => {
  const queryText = `
        SELECT 
            ads.id, ads.title, ads.description, ads.price, ads.image_url, ads.created_at,
            users.first_name, users.city,
            categories.name AS category_name
        FROM ads
        LEFT JOIN users ON ads.user_id = users.id
        LEFT JOIN categories ON ads.category_id = categories.id
        ORDER BY ads.created_at DESC;
    `;

  try {
    const result = await db.query(queryText);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la preluarea anunțurilor" });
  }
});

// A specific ad
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const queryText = `
        SELECT 
            ads.id, ads.title, ads.description, ads.price, ads.image_url, ads.created_at,
            
            -- Seller details
            users.first_name, users.last_name, users.city, users.phone_number, users.email,
            
            -- Category details
            categories.name AS category_name
        FROM ads
        LEFT JOIN users ON ads.user_id = users.id
        LEFT JOIN categories ON ads.category_id = categories.id
        WHERE ads.id = $1;
    `;

  try {
    const result = await db.query(queryText, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Anunțul nu a fost găsit" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la preluarea anunțului" });
  }
});

export default router;
