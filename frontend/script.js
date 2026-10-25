/* =====================================================
   INTERNMATCH
   FRONTEND + BACKEND CONNECTION
===================================================== */


const API_URL = "http://localhost:5000/api";


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        checkLoginStatus();

        loadInternships();

    }
);



/* =====================================================
   LOGIN MODAL
===================================================== */

function openLoginModal() {

    document.getElementById(
        "loginModal"
    ).style.display = "flex";

}


function closeLoginModal() {

    document.getElementById(
        "loginModal"
    ).style.display = "none";

}



/* =====================================================
   REGISTER MODAL
===================================================== */

function openRegisterModal() {

    closeLoginModal();

    document.getElementById(
        "registerModal"
    ).style.display = "flex";

}


function closeRegisterModal() {

    document.getElementById(
        "registerModal"
    ).style.display = "none";

}



/* =====================================================
   REGISTER
===================================================== */

async function registerUser() {

    const name =
        document.getElementById(
            "registerName"
        ).value.trim();


    const email =
        document.getElementById(
            "registerEmail"
        ).value.trim();


    const password =
        document.getElementById(
            "registerPassword"
        ).value;


    const message =
        document.getElementById(
            "registerMessage"
        );


    if (!name || !email || !password) {

        message.innerText =
            "Please fill all fields.";

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/auth/register`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name,
                        email,
                        password,
                        role: "student"

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            message.innerText =
                data.message;

            return;

        }


        message.innerText =
            "Registration successful!";


        document.getElementById(
            "registerName"
        ).value = "";


        document.getElementById(
            "registerEmail"
        ).value = "";


        document.getElementById(
            "registerPassword"
        ).value = "";


        setTimeout(
            () => {

                closeRegisterModal();

                openLoginModal();

            },
            1000
        );


    }
    catch (error) {

        console.error(error);

        message.innerText =
            "Cannot connect to server.";

    }

}



/* =====================================================
   LOGIN
===================================================== */

async function loginUser() {

    const email =
        document.getElementById(
            "loginEmail"
        ).value.trim();


    const password =
        document.getElementById(
            "loginPassword"
        ).value;


    const message =
        document.getElementById(
            "loginMessage"
        );


    if (!email || !password) {

        message.innerText =
            "Enter email and password.";

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/auth/login`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        email,
                        password

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            message.innerText =
                data.message;

            return;

        }


        localStorage.setItem(
            "token",
            data.token
        );


        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );


        closeLoginModal();

        updateLoginUI();

        loadApplications();

        alert(
            "Login successful!"
        );

    }
    catch (error) {

        console.error(error);

        message.innerText =
            "Server connection failed.";

    }

}



/* =====================================================
   LOGIN STATUS
===================================================== */

function checkLoginStatus() {

    const token =
        localStorage.getItem(
            "token"
        );


    if (token) {

        updateLoginUI();

        loadApplications();

    }

}



/* =====================================================
   UPDATE UI
===================================================== */

function updateLoginUI() {

    const userData =
        localStorage.getItem(
            "user"
        );


    if (!userData) {
        return;
    }


    const user =
        JSON.parse(userData);


    const loginButton =
        document.getElementById(
            "loginButton"
        );


    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (loginButton) {

        loginButton.innerText =
            user.name;

    }


    if (logoutButton) {

        logoutButton.style.display =
            "inline-block";

    }

}



/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    localStorage.removeItem(
        "token"
    );


    localStorage.removeItem(
        "user"
    );


    alert(
        "Logged out successfully."
    );


    location.reload();

}



/* =====================================================
   LOAD INTERNSHIPS
===================================================== */

async function loadInternships(
    search = "",
    location = ""
) {

    try {

        const url =
            `${API_URL}/internships?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}`;


        const response =
            await fetch(url);


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message
            );

        }


        displayInternships(data);

    }
    catch (error) {

        console.error(error);

        document.getElementById(
            "internshipContainer"
        ).innerHTML = `

            <div class="loading">

                Unable to load internships.

                <br><br>

                Make sure the backend
                and MySQL are running.

            </div>

        `;

    }

}



/* =====================================================
   DISPLAY INTERNSHIPS
===================================================== */

function displayInternships(
    internships
) {

    const container =
        document.getElementById(
            "internshipContainer"
        );


    container.innerHTML = "";


    if (internships.length === 0) {

        container.innerHTML = `

            <div class="loading">

                No internships found.

            </div>

        `;

        return;

    }


    internships.forEach(
        internship => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "internship-card";


            card.dataset.match =
                calculateMatch(
                    internship.skills
                );


            card.innerHTML = `

                <div class="company-name">

                    ${escapeHTML(
                        internship.company_name
                    )}

                    <span class="verified">

                        ✓ Verified

                    </span>

                </div>


                <h3>

                    ${escapeHTML(
                        internship.title
                    )}

                </h3>


                <p>
                    📍 ${escapeHTML(
                        internship.location || "India"
                    )}
                </p>


                <p>
                    💼 ${escapeHTML(
                        internship.work_mode || "Not specified"
                    )}
                </p>


                <p>
                    💰 ${escapeHTML(
                        internship.stipend || "Not specified"
                    )}
                </p>


                <p>
                    ⏱ ${escapeHTML(
                        internship.duration || "Not specified"
                    )}
                </p>


                <p>
                    🛠 ${escapeHTML(
                        internship.skills || "Not specified"
                    )}
                </p>


                <div class="match">

                    <strong>

                        Your Match:
                        ${calculateMatch(
                            internship.skills
                        )}%

                    </strong>


                    <div class="match-bar">

                        <div
                            class="match-fill"
                            style="
                            width:${calculateMatch(
                                internship.skills
                            )}%
                            ">
                        </div>

                    </div>

                </div>


                <p>

                    Deadline:
                    ${
                        internship.deadline ||
                        "Not specified"
                    }

                </p>


                <div class="card-buttons">

                    <button
                        onclick="
                        applyInternship(
                            ${internship.id}
                        )">

                        Apply Now

                    </button>


                    <button
                        class="save-btn"
                        onclick="
                        saveInternship(
                            ${internship.id}
                        )">

                        ♡ Save

                    </button>


                    <button
                        class="details-btn"
                        onclick="
                        viewInternship(
                            ${internship.id}
                        )">

                        View

                    </button>

                </div>

            `;


            container.appendChild(card);

        }
    );

}



/* =====================================================
   SEARCH
===================================================== */

function searchInternships() {

    const search =
        document.getElementById(
            "searchInput"
        ).value;


    const location =
        document.getElementById(
            "locationFilter"
        ).value;


    loadInternships(
        search,
        location
    );

}



/* =====================================================
   DOMAIN SEARCH
===================================================== */

function selectDomain(domain) {

    document.getElementById(
        "searchInput"
    ).value = domain;


    document.getElementById(
        "internships"
    ).scrollIntoView({
        behavior: "smooth"
    });


    searchInternships();

}



/* =====================================================
   APPLY
===================================================== */

async function applyInternship(
    internshipId
) {

    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        alert(
            "Please login before applying."
        );


        openLoginModal();

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/applications`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        internship_id:
                            internshipId

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message
            );

            return;

        }


        alert(
            "Application submitted successfully!"
        );


        loadApplications();

    }
    catch (error) {

        console.error(error);

        alert(
            "Application failed."
        );

    }

}



/* =====================================================
   LOAD APPLICATIONS
===================================================== */

async function loadApplications() {

    const token =
        localStorage.getItem(
            "token"
        );


    const container =
        document.getElementById(
            "applicationsContainer"
        );


    if (!token) {

        container.innerHTML = `

            <p>
                Login to view your applications.
            </p>

        `;

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/applications/my`,
                {

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message
            );

        }


        displayApplications(data);

    }
    catch (error) {

        console.error(error);

        container.innerHTML = `

            <p>
                Unable to load applications.
            </p>

        `;

    }

}



/* =====================================================
   DISPLAY APPLICATIONS
===================================================== */

function displayApplications(
    applications
) {

    const container =
        document.getElementById(
            "applicationsContainer"
        );


    container.innerHTML = "";


    if (applications.length === 0) {

        container.innerHTML = `

            <p>
                You have not applied
                for any internship yet.
            </p>

        `;

        return;

    }


    applications.forEach(
        application => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "application-card";


            card.innerHTML = `

                <h3>

                    ${escapeHTML(
                        application.title
                    )}

                </h3>


                <p>

                    ${escapeHTML(
                        application.company_name
                    )}

                </p>


                <p>

                    📍 ${escapeHTML(
                        application.location || ""
                    )}

                </p>


                <p>

                    Status:

                    <strong>

                        ${escapeHTML(
                            application.status
                        )}

                    </strong>

                </p>


                <div class="application-tracker">

                    ${tracker(
                        application.status,
                        "Applied"
                    )}

                    ${tracker(
                        application.status,
                        "Under Review"
                    )}

                    ${tracker(
                        application.status,
                        "Shortlisted"
                    )}

                    ${tracker(
                        application.status,
                        "Interview"
                    )}

                    ${tracker(
                        application.status,
                        "Selected"
                    )}

                </div>

            `;


            container.appendChild(card);

        }
    );

}



/* =====================================================
   TRACKER
===================================================== */

function tracker(
    currentStatus,
    status
) {

    const statuses = [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Selected"
    ];


    const current =
        statuses.indexOf(
            currentStatus
        );


    const item =
        statuses.indexOf(
            status
        );


    return `

        <span
            class="${
                item <= current
                    ? "active"
                    : ""
            }">

            ${status}

        </span>

    `;

}



/* =====================================================
   SAVE
===================================================== */

async function saveInternship(
    internshipId
) {

    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        alert(
            "Please login to save internships."
        );


        openLoginModal();

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/saved/${internshipId}`,
                {

                    method: "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        alert(
            data.message
        );

    }
    catch (error) {

        console.error(error);

        alert(
            "Unable to save internship."
        );

    }

}



/* =====================================================
   VIEW DETAILS
===================================================== */

async function viewInternship(
    id
) {

    try {

        const response =
            await fetch(
                `${API_URL}/internships/${id}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message
            );

            return;

        }


        alert(`

${data.title}

Company:
${data.company_name}

Location:
${data.location}

Work Mode:
${data.work_mode}

Duration:
${data.duration}

Stipend:
${data.stipend}

Required Skills:
${data.skills}

Deadline:
${data.deadline}

Description:
${data.description}

        `);

    }
    catch (error) {

        console.error(error);

    }

}



/* =====================================================
   SORT
===================================================== */

function sortInternships() {

    const select =
        document.getElementById(
            "sortSelect"
        );


    const container =
        document.getElementById(
            "internshipContainer"
        );


    const cards =
        Array.from(
            container.children
        );


    if (
        select.value ===
        "match"
    ) {

        cards.sort(
            (a, b) => {

                return (
                    Number(
                        b.dataset.match
                    ) -
                    Number(
                        a.dataset.match
                    )
                );

            }
        );

    }


    cards.forEach(
        card =>
            container.appendChild(card)
    );

}



/* =====================================================
   SMART MATCH
===================================================== */

function calculateMatch(
    internshipSkills
) {

    const userData =
        localStorage.getItem(
            "user"
        );


    if (!userData) {

        return 0;

    }


    /*
       Demo student skills.
       Later this can come directly
       from student_profiles table.
    */

    const studentSkills = [

        "html",
        "css",
        "javascript",
        "java",
        "sql"

    ];


    if (!internshipSkills) {

        return 0;

    }


    const skills =
        internshipSkills
            .toLowerCase()
            .split(",")
            .map(
                skill =>
                    skill.trim()
            );


    let matched = 0;


    skills.forEach(
        skill => {

            if (
                studentSkills.some(
                    studentSkill =>
                        skill.includes(
                            studentSkill
                        ) ||
                        studentSkill.includes(
                            skill
                        )
                )
            ) {

                matched++;

            }

        }
    );


    if (skills.length === 0) {

        return 0;

    }


    return Math.round(
        (
            matched /
            skills.length
        ) * 100
    );

}



/* =====================================================
   SECURITY
===================================================== */

function escapeHTML(
    value
) {

    if (!value) {
        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
