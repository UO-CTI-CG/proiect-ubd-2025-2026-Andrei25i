import express from "express";
import db from "../db.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendPasswordResetEmail } from "../utils/emailService.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, phone_number, password, city } = req.body;

    if (!first_name || !last_name || !email || !phone_number || !password || !city ) {
        return res.status(400).json({ error: "Toate câmpurile marcate sunt obligatorii." })
    }

    try {
        const checkUserQuery = `SELECT * FROM users WHERE email = $1`;
        const existingUser = await db.query(checkUserQuery, [email]);

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: "Acest email este deja înregistrat." });
        }

        const salt = await bcryptjs.genSalt(10);
        const passwordHash = await bcryptjs.hash(password, salt);

        const insertUserQuery = `
            INSERT INTO users (first_name, last_name, email, phone_number, password_hash, city)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, email, first_name, last_name, created_at;
        `;

        const newUser = await db.query(insertUserQuery, [
            first_name,
            last_name,
            email.toLowerCase(),
            phone_number,
            passwordHash,
            city
        ]);

        res.status(201).json({
            message: "Utilizator creat cu succes!",
            user: newUser.rows[0]
        });
    } catch (err) {
        console.error("Eroare la înregistrare:", err);
        res.status(500).json({ error: "Eroare internă a serverului." });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email-ul și parola sunt obligatorii." });
    }

    try {
        const queryText = `SELECT * FROM users WHERE email = $1`;
        const userResult = await db.query(queryText, [email.toLowerCase()]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: "Email sau parolă incorectă." });
        }

        const user = userResult.rows[0];
        const isMatch = await bcryptjs.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: "Email sau parolă incorectă." });
        }

        const payload = {
            userId: user.id
        };

        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(
            payload,
            secret,
            { expiresIn: '8h' }
        );

        res.status(200).json({
            token: token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Eroare la login:", err);
        res.status(500).json({ error: "Eroare internă a serverului." });
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(200).json({ message: `Un link de resetare a parolei a fost trimis la adresa de email.`, email });
        }

        const user = userResult.rows[0];

        const payload = { userId: user.id };
        const resetSecret = process.env.JWT_RESET_SECRET;
        const resetToken = jwt.sign(
            payload,
            resetSecret,
            { expiresIn: '15m' }
        );

        await sendPasswordResetEmail(user, resetToken);
        return res.status(200).json({ message: `Un link de resetare a parolei a fost trimis la adresa de email.`, email });    
    } catch (err) {
        console.error("Eroare la forgot-password:", err);
        res.status(500).json({ error: "Eroare internă a serverului." });
    }
});

router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ error: "Token-ul și noua parolă sunt necesare." });
    }

    try {
        const resetSecret = process.env.JWT_RESET_SECRET;
        const payload = jwt.verify(token, resetSecret);
        const { userId } = payload;
        const salt = await bcryptjs.genSalt(10);
        const passwordHash = await bcryptjs.hash(newPassword, salt);

        await db.query(
            `UPDATE users SET password_hash = $1 WHERE id = $2`,
            [passwordHash, userId]
        );

        res.status(200).json({ message: "Parola a fost resetată cu succes." });
    } catch (err) {
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Link-ul de resetare este invalid sau a expirat." });
        }
        
        console.error("Eroare la reset-password:", err);
        res.status(500).json({ error: "Eroare internă a serverului" });
    }
});

export default router;