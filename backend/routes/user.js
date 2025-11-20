import express from "express";
import db from "../db.js";
import authMiddleware from "../middleware/auth.js";
import bcrypt from "bcryptjs";

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
        .json({ error: "Utilizatorul nu a fost găsit sau nu există." });
    }

    const user = userResult.rows[0];

    const adsQuery = `
      SELECT id, title, price, image_url, created_at, city
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

// DELETE user
router.delete("/", authMiddleware, async (req, res) => {
  const loggedUserId = req.user.userId;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      error: "Parola este necesară pentru a confirma ștergerea contului.",
    });
  }

  try {
    const userQuery = "SELECT password_hash FROM users WHERE id = $1";
    const userResult = await db.query(userQuery, [loggedUserId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Utilizatorul nu a fost găsit." });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Parola incorectă. Ștergerea contului a eșuat." });
    }

    const deleteQuery = "DELETE FROM users WHERE id = $1;";
    await db.query(deleteQuery, [loggedUserId]);

    res
      .status(200)
      .json({ message: "Contul dumneavoastră a fost șters cu succes." });
  } catch (err) {
    console.error("Eroare la ștergerea contului:", err);
    res.status(500).json({ error: "Eroare internă a serverului." });
  }
});

// Update user data
router.put("/", authMiddleware, async (req, res) => {
  const loggedUserId = req.user.userId;
  const { first_name, last_name, email, phone_number, city } = req.body;
  const hasDataToUpdate =
    first_name || last_name || email || phone_number || city;

  if (!hasDataToUpdate) {
    return res.status(400).json({
      error:
        "Nu ați furnizat date noi pentru actualizare. Nicio acțiune nu a fost efectuată.",
    });
  }

  try {
    const currentUserQuery = "SELECT * FROM users WHERE id = $1";
    const currentUserResult = await db.query(currentUserQuery, [loggedUserId]);

    if (currentUserResult.rows.length === 0) {
      return res.status(404).json({ error: "Utilizatorul nu a fost găsit." });
    }

    const currentUser = currentUserResult.rows[0];

    if (email && email.toLowerCase() !== currentUser.email) {
      const emailCheckQuery = "SELECT id FROM users WHERE email = $1";
      const emailCheckResult = await db.query(emailCheckQuery, [
        email.toLowerCase(),
      ]);

      if (emailCheckResult.rows.length > 0) {
        return res.status(409).json({ error: "Acest email este deja utilizat de un alt cont." });
      }
    }

    const updatedUser = {
      first_name: first_name || currentUser.first_name,
      last_name: last_name || currentUser.last_name,
      email: email ? email.toLowerCase() : currentUser.email,
      phone_number: phone_number || currentUser.phone_number,
      city: city || currentUser.city,
    };

    const updateQuery = `
      UPDATE users
      SET
        first_name = $1,
        last_name = $2,
        email = $3,
        phone_number = $4,
        city = $5
      WHERE
        id = $6
      RETURNING id, first_name, last_name, email, phone_number, city;
    `;

    const values = [
      updatedUser.first_name,
      updatedUser.last_name,
      updatedUser.email,
      updatedUser.phone_number,
      updatedUser.city,
      loggedUserId,
    ];

    const result = await db.query(updateQuery, values);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Eroare la actualizarea profilului:", err);
    res.status(500).json({ error: "Eroare internă a serverului" });
  }
});

export default router;