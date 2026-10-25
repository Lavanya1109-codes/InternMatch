const express =
    require("express");

const db =
    require("../db");


const router =
    express.Router();



/* ================= GET INTERNSHIPS ================= */

router.get(
    "/",
    (req, res) => {

        const search =
            req.query.search || "";


        const location =
            req.query.location || "";


        const searchValue =
            `%${search}%`;


        const locationValue =
            `%${location}%`;


        const sql = `

            SELECT

                internships.id,

                internships.title,

                internships.description,

                internships.location,

                internships.work_mode,

                internships.duration,

                internships.stipend,

                internships.skills,

                internships.deadline,

                companies.company_name,

                companies.verified

            FROM internships

            JOIN companies

            ON internships.company_id =
               companies.id

            WHERE internships.verified = TRUE

            AND (

                internships.title LIKE ?

                OR internships.skills LIKE ?

                OR companies.company_name LIKE ?

            )

            AND internships.location LIKE ?

            ORDER BY
                internships.created_at DESC

        `;


        db.query(

            sql,

            [
                searchValue,
                searchValue,
                searchValue,
                locationValue
            ],

            (error, results) => {

                if (error) {

                    console.log(error);

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



/* ================= GET ONE ================= */

router.get(
    "/:id",
    (req, res) => {

        const id =
            req.params.id;


        const sql = `

            SELECT

                internships.*,

                companies.company_name,

                companies.description
                AS company_description,

                companies.verified

            FROM internships

            JOIN companies

            ON internships.company_id =
               companies.id

            WHERE internships.id = ?

        `;


        db.query(

            sql,

            [id],

            (error, results) => {

                if (error) {

                    return res.status(500).json({

                        message:
                            "Database error"

                    });

                }


                if (
                    results.length === 0
                ) {

                    return res.status(404).json({

                        message:
                            "Internship not found"

                    });

                }


                res.json(
                    results[0]
                );

            }

        );

    }
);


module.exports =
    router;
