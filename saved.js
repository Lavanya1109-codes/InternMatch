const express = require("express");
const router = express.Router();

const db = require("../db");
const auth = require("../middleware/auth");

// Save internship
router.post("/:internshipId", auth, (req, res) => {
    const studentId = req.user.id;
    const internshipId = req.params.internshipId;

    const sql = `
        INSERT INTO saved_internships (student_id, internship_id)
        VALUES (?, ?)
    `;

    db.query(sql, [studentId, internshipId], (err) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.json({
                    message: "Already saved"
                });
            }

            return res.status(500).json({
                message: "Failed to save internship",
                error: err.message
            });
        }

        res.json({
            message: "Internship saved successfully"
        });
    });
});

// Get saved internships
router.get("/my", auth, (req, res) => {
    const studentId = req.user.id;

    const sql = `
        SELECT 
            saved_internships.id,
            internships.id AS internship_id,
            internships.title,
            internships.location,
            internships.work_mode,
            internships.duration,
            internships.stipend,
            companies.company_name
        FROM saved_internships
        JOIN internships
            ON saved_internships.internship_id = internships.id
        JOIN companies
            ON internships.company_id = companies.id
        WHERE saved_internships.student_id = ?
    `;

    db.query(sql, [studentId], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to load saved internships",
                error: err.message
            });
        }

        res.json(results);
    });
});

module.exports = router;