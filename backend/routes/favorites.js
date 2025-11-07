import express from "express";
import db from "../db.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// GET all favorite ads
router.get("/", authMiddleware, async (req, res) => {
  const loggedUserId = req.user.userId;

  const queryText = `
        SELECT
            ads.id,
            ads.title,
            ads.price,
            ads.image_url,
            ads.created_at,
            users.city AS ad_city,
            categories.name AS category_name
        FROM 
            favorites
        INNER JOIN
            ads ON favorites.ad_id = ads.id
        LEFT JOIN
            users ON ads.user_id = users.id
        LEFT JOIN
            categories ON ads.category_id = categories.id
        WHERE
            favorites.user_id = $1
        ORDER BY
            favorites.created_at DESC;
    `;

  try {
    const result = await db.query(queryText, [loggedUserId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Eroare la preluarea favoritelor:", err);
    res.status(500).json({ error: "Eroare internă a serverului." });
  }
});

// Add an ad to favorites
router.post("/:adId", authMiddleware, async (req, res) => {
  const { adId } = req.params;
  const loggedUserId = req.user.userId;

  const queryText = `
        INSERT INTO favorites (user_id, ad_id)
        VALUES ($1, $2)
        RETURNING *;
    `;

  try {
    const result = await db.query(queryText, [loggedUserId, adId]);

    res.status(201).json({
      message: "Anunț adăugat la favorite cu succes.",
      favorite: result.rows[0],
    });
  } catch (err) {
    console.error("Eroare la adaugare la favorite:", err);
    res.status(500).json({ error: "Eroare internă a serverului" });
  }
});

// DELETE an ad from favorites
router.delete("/:adId", authMiddleware, async (req, res) => {
  const { adId } = req.params;
  const loggedUserId = req.user.userId;

  const queryText = `
    DELETE FROM favorites
    WHERE user_id = $1 AND ad_id = $2
    RETURNING *;
  `;

  try {
    const result = await db.query(queryText, [loggedUserId, adId]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Anunțul de la favorite nu a fost găsit." });
    }

    res.status(200).json({
      message: "Anunț a fost șters de la favorite cu succes.",
      deletedFavorite: result.rows[0],
    });
  } catch (err) {
    console.error("Eroare la ștergerea de la favorite:", err);
    res.status(500).json({ error: "Eroare internă a serverului" });
  }
});

export default router;
