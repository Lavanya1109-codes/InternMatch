const express =
    require("express");

const bcrypt =
    require("bcryptjs");

const jwt =
    require("jsonwebtoken");

const db =
    require("../db");


const router =
    express.Router();



/* ================= REGISTER ================= */

router.post(
    "/register",
    async (req, res) => {

        try {

            const {
                name,
                email,
                password,
                role
            } = req.body;


            if (
                !name ||
                !email ||
                !password
            ) {

                return res.status(400).json({

                    message:
                        "All fields are required"

                });

            }


            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            const sql = `

                INSERT INTO users
                (name, email, password, role)

                VALUES (?, ?, ?, ?)

            `;


            db.query(

                sql,

                [
                    name,
                    email,
                    hashedPassword,
                    role || "student"
                ],

                (error, result) => {

                    if (error) {

                        console.log(error);

                        return res.status(400).json({

                            message:
                                "Email already exists"

                        });

                    }


                    res.json({

                        message:
                            "Registration successful",

                        userId:
                            result.insertId

                    });

                }

            );

        }
        catch (error) {

            console.log(error);

            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);



/* ================= LOGIN ================= */

router.post(
    "/login",
    (req, res) => {

        const {
            email,
            password
        } = req.body;


        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                message:
                    "Email and password required"

            });

        }


        const sql = `

            SELECT *
            FROM users

            WHERE email = ?

        `;


        db.query(

            sql,

            [email],

            async (
                error,
                results
            ) => {

                if (error) {

                    return res.status(500).json({

                        message:
                            "Database error"

                    });

                }


                if (
                    results.length === 0
                ) {

                    return res.status(401).json({

                        message:
                            "Invalid email or password"

                    });

                }


                const user =
                    results[0];


                const valid =
                    await bcrypt.compare(

                        password,

                        user.password

                    );


                if (!valid) {

                    return res.status(401).json({

                        message:
                            "Invalid email or password"

                    });

                }


                const token =
                    jwt.sign(

                        {
                            id: user.id,
                            role: user.role
                        },

                        process.env.JWT_SECRET,

                        {
                            expiresIn: "1d"
                        }

                    );


                res.json({

                    message:
                        "Login successful",

                    token,

                    user: {

                        id: user.id,

                        name: user.name,

                        email: user.email,

                        role: user.role

                    }

                });

            }

        );

    }
);


module.exports =
    router;
