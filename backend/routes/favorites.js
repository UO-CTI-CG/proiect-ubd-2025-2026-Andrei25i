import express from "express";
import db from "../db.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// GET all favorite ads
router.get("/", authMiddleware, async (req, res) => {
  const loggedUserId = req.user.userId;
  const { search, category, minPrice, maxPrice, sort } = req.query;

  let queryText = `
        SELECT
            ads.id,
            ads.title,
            ads.price,
            ads.image_url,
            ads.created_at AS ad_created_at,
            users.city AS ad_city,
            categories.name AS category_name,
            favorites.created_at AS favorited_at
        FROM 
            favorites
        INNER JOIN
            ads ON favorites.ad_id = ads.id
        LEFT JOIN
            users ON ads.user_id = users.id
        LEFT JOIN
            categories ON ads.category_id = categories.id
    `;

  const conditions = [];
  const params = [];

  params.push(loggedUserId);
  conditions.push(`favorites.user_id = $${params.length}`);

  if (search) {
    params.push(search);
    conditions.push(`ads.title ILIKE '%' || $${params.length} || '%'`);
  }

  if (category) {
    params.push(category);
    conditions.push(`ads.category_id = $${params.length}`);
  }

  if (minPrice) {
    params.push(minPrice);
    conditions.push(`ads.price >= $${params.length}`);
  }

  if (maxPrice) {
    params.push(maxPrice);
    conditions.push(`ads.price <= $${params.length}`);
  }

  queryText += ` WHERE ${conditions.join(" AND ")}`;

  const sortOptions = {
    price_asc: "ads.price ASC",
    price_desc: "ads.price DESC",
    date_desc: "ads.created_at DESC",
    date_asc: "ads.created_at ASC",
    name_asc: "LOWER(ads.title) ASC",
    name_desc: "LOWER(ads.title) DESC",
    favorited_date_desc: "favorites.created_at DESC",
    favorited_date_asc: "favorites.created_at ASC",
  };

  let orderByClause = sortOptions[sort] || sortOptions['favorited_date_desc'];
  queryText += ` ORDER BY ${orderByClause}`;

  try {
    const result = await db.query(queryText, params);
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
