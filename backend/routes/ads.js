import express from "express";
import db from "../db.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// GET all ads with filters and sorting
router.get("/", async (req, res) => {
  const { search, category, minPrice, maxPrice, sort} = req.query;

  let queryText = `
      SELECT 
          ads.id, ads.title, ads.description, ads.price, ads.image_url, ads.created_at,
          users.first_name, users.city,
          categories.name AS category_name
      FROM ads
      LEFT JOIN users ON ads.user_id = users.id
      LEFT JOIN categories ON ads.category_id = categories.id
    `;

    const conditions = [];
    const params = [];

    if (search) {
      params.push(search);
      conditions.push(`ads.title ILIKE '%' || $${params.length} || '%'`);
    }

    if (category) {
      params.push(category);
      conditions.push(`ads.category_id = $${params.length}`);
    }

    if (maxPrice) {
      params.push(maxPrice);
      conditions.push(`ads.price <= $${params.length}`);
    }

    if (minPrice) {
      params.push(minPrice);
      conditions.push(`ads.price >= $${params.length}`);
    }

    if (conditions.length > 0) {
      queryText += ` WHERE ${conditions.join(' AND ')}`;
    }

    const sortOptions = {
      'price_asc': 'ads.price ASC',
      'price_desc': 'ads.price DESC',
      'date_asc': 'ads.created_at ASC',
      'date_desc': 'ads.created_at DESC',
      'name_asc': 'LOWER(ads.title) ASC',
      'name_desc': 'LOWER(ads.title) DESC'
    };

    let orderByClause = sortOptions[sort] || sortOptions['date_desc'];
    queryText += ` ORDER BY ${orderByClause}`;

  try {
    const result = await db.query(queryText, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la preluarea anunțurilor" });
  }
});

// GET a specific ad
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

// POST an ad
router.post("/", authMiddleware, async (req, res) => {
  const loggedUserId = req.user.userId;

  const { title, description, price, image_url, category_id } = req.body;
  
  if (!title || !description || !price || !category_id) {
    return res.status(400).json({
      error: "Câmpurile titlu, descriere, preț și categorie sunt obligatorii.",
    });
  }

  try {
    const queryText = `
      INSERT INTO ads (title, description, price, image_url, user_id, category_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      title,
      description,
      price,
      image_url,
      loggedUserId,
      category_id,
    ];

    const result = await db.query(queryText, values);
    const newAd = result.rows[0];

    res.status(201).json(newAd)
  } catch (error) {
    console.error("Eroare la crearea anunțului:", error);
    res.status(500).json({ error: "Eroare internă a serverului" });
  }
});

// DELETE an ad
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const loggedUserId = req.user.userId;

  try {
    const checkOwnerQuery = `SELECT user_id FROM ads WHERE id = $1;`;
    const result = await db.query(checkOwnerQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Anunțul nu a fost găsit." });
    }

    const adOwnerId = result.rows[0].user_id;

    if (adOwnerId !== loggedUserId) {
      return res.status(403).json({ error: "Acțiune interzisă. Nu aveți permisiunea să ștergeți acest anunț" });
    }

    const deleteQuery = `DELETE FROM ads WHERE id = $1;`;
    await db.query(deleteQuery, [id]);

    res.status(200).json({ message: "Anunțul a foșt sters cu succes." });
  } catch (err) {
    console.error("Eroare la ștergerea anunțului.");
    res.status(500).json({ error: "Eroare internă a serverului." });
  }
});


// Edit an ad
router.put("/:id", authMiddleware, async(req, res) => {
  const { id } = req.params;
  const loggedUserId = req.user.userId;

  const { title, description, price, image_url, category_id } = req.body;

  if (!title || !description || !price || !image_url || !category_id) {
    return res.status(400).json({ error: "Toate câmpurile sunt obligatorii."});
  }

  try {
    const checkOwnerQuery = 'SELECT user_id FROM ads WHERE id = $1';
    const ownerResult = await db.query(checkOwnerQuery, [id]);

    if (ownerResult.rows.length === 0) {
      return res.status(404).json({ error: "Anunțul nu a fost găsit." });
    }

    const adOwnerId = ownerResult.rows[0].user_id;

    if (adOwnerId !== loggedUserId) {
      return res.status(403).json({ error: "Acțiune interzisă. Nu aveți permisiunea să editați acest anunț." });
    }

    const updateQuery = `
      UPDATE ads
      SET title = $1, description = $2, price = $3, image_url = $4, category_id = $5
      WHERE id = $6
      RETURNING *;
    `;

    const values = [title, description, price, image_url, category_id, id];
    const result = await db.query(updateQuery, values);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Eroare la actualizarea anunțului:", err);
    res.status(500).json({ error: "Eroare internă a serverului."});
  }
});

export default router;
