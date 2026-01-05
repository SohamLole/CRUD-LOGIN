console.log("Script loaded");

function loadTenants() {
  fetch("/tenants", {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then(res => {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "index.html";
      return;
    }
    return res.json();
  })
  .then(data => {
    if (!data) return;

    const tbody = document.querySelector("#tenantTable tbody");
    tbody.innerHTML = "";

    data.forEach(t => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${t.id}</td>
            <td>${t.fname}</td>
            <td>${t.mname}</td>
            <td>${t.lname}</td>
            <td>${t.bdate}</td>
            <td>${t.paddress}</td>
        `;

        const actionsTd = document.createElement("td");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => openEditModal(t));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteTenant(t.id));

        actionsTd.append(editBtn, deleteBtn);
        row.appendChild(actionsTd);

        tbody.appendChild(row);
    });

  });
}

document.addEventListener("DOMContentLoaded", () => {

    const signupBtn = document.getElementById("signupBtn");
    const loginBtn = document.getElementById("loginBtn");
    const signupSubmit = document.getElementById("signupSubmit");
    const loginSubmit = document.getElementById("loginSubmit");

    if (signupSubmit) signupSubmit.addEventListener("click", signup);
    if (loginSubmit) loginSubmit.addEventListener("click", login);

    if (signupBtn) signupBtn.addEventListener("click", showSignup);
    if (loginBtn) loginBtn.addEventListener("click", showLogin);

    function showSignup() {
        document.getElementById("sign").style.display = "block";
        document.getElementById("log").style.display = "none";
    }

    function showLogin() {
        document.getElementById("sign").style.display = "none";
        document.getElementById("log").style.display = "block";
    }

    function signup() {
        const email = document.getElementById("s_email").value;
        const password = document.getElementById("s_password").value;

        fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.text())
        .then(data => {
            if (data.includes("Signup successful")) {
                alert("Signup done ✅\nPlease verify your email before login.");
                document.getElementById("s_email").value = "";
                document.getElementById("s_password").value = "";
                showLogin();
            } else {
                alert(data);
            }
        });
    }

    function login() {
        fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: document.getElementById("l_email").value,
                password: document.getElementById("l_password").value
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem("token", data.token);
                window.location.href = "dashboard.html";
            } else {
                alert(data);
            }
        });
    }


    const form = document.getElementById("personalInfo");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

                const fname = document.getElementById("f_name").value;
                const mname = document.getElementById("m_name").value;
                const lname = document.getElementById("l_name").value;
                const bdate = document.getElementById("b_date").value;
                const paddress = document.getElementById("p_address").value;

            fetch("/formsubmit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fname, mname, lname, bdate, paddress })
            })
            .then(res => res.text())
            .then(data => {
                alert(data);
                if (data.includes("successful")){ 
                    form.reset();
                    loadTenants();}
            });
    
        });
    }
    
    if (document.getElementById("tenantTable")) {
        loadTenants();   
    }


    window.openEditModal = function (tenant) {
        document.getElementById("edit_id").value = tenant.id;
        document.getElementById("edit_fname").value = tenant.fname;
        document.getElementById("edit_mname").value = tenant.mname;
        document.getElementById("edit_lname").value = tenant.lname;
        document.getElementById("edit_bdate").value = tenant.bdate;
        document.getElementById("edit_paddress").value = tenant.paddress;

        document.getElementById("editModal").style.display = "block";
    };

    window.closeModal = function () {
        document.getElementById("editModal").style.display = "none";
    };

    window.updateTenant = function () {
        const id = document.getElementById("edit_id").value;

        fetch(`/tenants/${id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({
            fname: edit_fname.value,
            mname: edit_mname.value,
            lname: edit_lname.value,
            bdate: edit_bdate.value,
            paddress: edit_paddress.value
            })
        })
        .then(res => res.text())
        .then(msg => {
            alert(msg);
            closeModal();
            loadTenants();
        });
    };

    window.deleteTenant = function (id) {
        if (!confirm("Are you sure?")) return;

        fetch(`/tenants/${id}`, {
            method: "DELETE",
            headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
        .then(res => res.text())
        .then(msg => {
            alert(msg);
            loadTenants();
        });
    };


    const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                localStorage.removeItem("token");
                window.location.href = "index.html";
            });
        }

});
