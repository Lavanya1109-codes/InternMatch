const express = require("express");

const db = require("../db");

const authenticateToken =
    require("../middleware/auth");

const router = express.Router();



/* APPLY */

router.post(

    "/",

    authenticateToken,

    (req, res) => {

        const studentId =
            req.user.id;

        const {
            internship_id
        } = req.body;


        if (!internship_id) {

            return res.status(400).json({

                message:
                "Internship ID required"

            });

        }


        const sql = `

            INSERT INTO applications

            (internship_id, student_id)

            VALUES (?, ?)

        `;


        db.query(

            sql,

            [
                internship_id,
                studentId
            ],

            (err, result) => {

                if (err) {

                    if (
                        err.code ===
                        "ER_DUP_ENTRY"
                    ) {

                        return res.status(400).json({

                            message:
                            "Already applied"

                        });

                    }


                    console.log(err);

                    return res.status(500).json({

                        message:
                        "Application failed"

                    });

                }


                res.json({

                    message:
                    "Application submitted successfully",

                    applicationId:
                    result.insertId

                });

            }

        );

    }

);



/* STUDENT APPLICATIONS */

router.get(

    "/my",

    authenticateToken,

    (req, res) => {

        const studentId =
            req.user.id;


        const sql = `

            SELECT

                applications.id,

                applications.status,

                applications.applied_at,

                internships.id
                AS internship_id,

                internships.title,

                internships.location,

                internships.work_mode,

                companies.company_name

            FROM applications

            JOIN internships

            ON applications.internship_id =
            internships.id

            JOIN companies

            ON internships.company_id =
            companies.id

            WHERE applications.student_id = ?

            ORDER BY applications.applied_at DESC

        `;


        db.query(

            sql,

            [studentId],

            (err, results) => {

                if (err) {

                    return res.status(500).json({

                        message:
                        "Database error"

                    });

                }


                res.json(results);

            }

        );

    }

);



/* UPDATE STATUS */

router.put(

    "/:id/status",

    authenticateToken,

    (req, res) => {

        const applicationId =
            req.params.id;

        const { status } =
            req.body;


        const allowedStatus = [

            "Applied",

            "Under Review",

            "Shortlisted",

            "Interview",

            "Selected",

            "Rejected"

        ];


        if (
            !allowedStatus.includes(status)
        ) {

            return res.status(400).json({

                message:
                "Invalid status"

            });

        }


        const sql = `

            UPDATE applications

            SET status = ?

            WHERE id = ?

        `;


        db.query(

            sql,

            [
                status,
                applicationId
            ],

            (err) => {

                if (err) {

                    return res.status(500).json({

                        message:
                        "Status update failed"

                    });

                }


                res.json({

                    message:
                    "Status updated"

                });

            }

        );

    }

);


module.exports = router;
