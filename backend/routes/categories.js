import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  const { sort } = req.query;
  const sortOptions = {
    name_asc: "name ASC",
    name_desc: "name DESC",
    id_asc: "id ASC",
    id_desc: "id DESC",
  };

  const orderByClause = sortOptions[sort] || "id ASC";

  const queryText = `
      SELECT * FROM categories
      ORDER BY ${orderByClause};
    `;

  try {
    const result = await db.query(queryText);
    res.json(result.rows);
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Eroare la preluarea categoriilor" });
  }
});

// GET a specific category
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const categoryQuery = `
            SELECT id, name FROM categories
            WHERE id = $1;
        `;
    const categoryResult = await db.query(categoryQuery, [id]);

    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ error: "Categoria nu a fost găsită" });
    }

    const category = categoryResult.rows[0];
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la preluarea categoriei" });
  }
});

export default router;
