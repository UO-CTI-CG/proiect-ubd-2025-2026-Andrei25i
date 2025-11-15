import { rateLimit } from 'express-rate-limit';

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {error: "Prea multe încercări de autentificare. Încercați din nou mai târziu."}
});

export default authLimiter;