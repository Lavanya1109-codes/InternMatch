const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const authRoutes = require("./routes/auth");
const internshipRoutes = require("./routes/internships");
const applicationRoutes = require("./routes/applications");
const savedRoutes = require("./routes/saved");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());

app.use(express.json());


/* ================= FRONTEND ================= */

// Frontend files are directly inside D:\SE
app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);


/* ================= API ROUTES ================= */

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/internships",
    internshipRoutes
);

app.use(
    "/api/applications",
    applicationRoutes
);

app.use(
    "/api/saved",
    savedRoutes
);


/* ================= TEST ================= */

app.get(
    "/api/test",
    (req, res) => {

        res.json({
            message:
                "InternMatch Backend Working Successfully"
        });

    }
);


/* ================= HOME ================= */

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "../frontend/index.html"
            )
        );

    }
);


/* ================= SERVER ================= */

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    () => {

        console.log(
            "================================"
        );

        console.log(
            "     INTERNMATCH SERVER"
        );

        console.log(
            "================================"
        );

        console.log(
            `http://localhost:${PORT}`
        );

    }
);
