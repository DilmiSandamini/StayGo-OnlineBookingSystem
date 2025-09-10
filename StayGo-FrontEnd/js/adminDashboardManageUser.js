$(document).ready(async function() {
    console.log("Admin Dashboard Manage Users is ready");

    const backendUrl = "http://localhost:8080";

    // --- Load all users and render in table ---
    async function loadAllUsers() {
    try {
        // Get token from cookies (assuming you're using JWT)
        const cookie = await cookieStore.get('token');
        const token = cookie?.value;

        if (!token) {
            console.error("No token found in cookies");
            return;
        }

        $.ajax({
            method: "GET",
            url: 'http://localhost:8080/api/v1/adminDashboardUserManage/getAllUsers',
            headers: { 'Authorization': 'Bearer ' + token },
            success: (response) => {
                const users = response.data; // APIResponse<List<UserDTO>>
                const usersTable = $("#UsersTableBody");
                usersTable.empty();

                if (!users || users.length === 0) {
                    usersTable.html('<tr><td colspan="9">No clients found.</td></tr>');
                    $("#totalUsers").text(0);
                    return;
                }

                users.forEach(user => {
                    const statusBadge = user.status.toLowerCase() === 'active'
                        ? `<span class="badge bg-success">${user.status}</span>`
                        : `<span class="badge bg-danger">${user.status}</span>`;

                    usersTable.append(`
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.fullName}</td>
                            <td>${user.email}</td>
                            <td>${user.username}</td>
                            <td>${user.role}</td>
                            <td>${statusBadge}</td>
                            <td>${new Date(user.createdAt).toLocaleString()}</td>
                            <td>${new Date(user.updatedAt).toLocaleString()}</td>
                            <td>
                                <button class="btn btn-info btn-sm" onClick="viewUser('${user.id}')">View</button>
                                <button class="btn btn-warning btn-sm edit-user-btn" data-id="${user.id}">Edit</button>
                                ${user.status.toLowerCase() === 'active'
                                    ? `<button class="btn btn-danger btn-sm" onClick="deactivateUser('${user.id}')">Deactivate</button>`
                                    : `<button class="btn btn-success btn-sm" onClick="activateUser('${user.id}')">Activate</button>`
                                }
                            </td>
                        </tr>
                    `);
                });

                $("#totalUsers").text(users.length);
            },
            error: (error) => {
                console.error("Error fetching users:", error);
                $("#UsersTableBody").html('<tr><td colspan="9">Error loading users.</td></tr>');
                alert("Error fetching users: " + error.responseText);
            }
        });
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

// --- Call this function on page load ---
$(document).ready(() => {
    loadAllUsers();
});

$("#addUserForm").on("submit", async function (event) {
    event.preventDefault();

    const password = $("#password").val();
    const confirmPassword = $("#confirm-password").val();

    // --- Password match check ---
    if (password !== confirmPassword) {
        // Focus the confirm password field
        $("#confirm-password").focus();
        alert("Passwords do not match.");
        return;
    }

    const user = {
        fullName: $("#fullName").val(),
        email: $("#email").val(),
        username: $("#username").val(),
        password: password,
        role: "CLIENT", // force CLIENT role
        userStatus: "Active"
    };

    // --- Validate required fields ---
    if (!user.fullName || !user.email || !user.username || !user.password) {
        alert("All fields are required.");
        return;
    }

   // Get token from cookie
    const cookie = await cookieStore.get('token');
    const token = cookie?.value;

    if (!token) {
        alert("No auth token found! Please login again.");
        return;
    }

    // Ajax POST request
    $.ajax({
        url: "http://localhost:8080/api/v1/adminDashboardUserManage/admin/saveuser",
        type: "POST",
        contentType: "application/json",
        headers: { 'Authorization': 'Bearer ' + token },  // <<< important
        data: JSON.stringify(user),
        success: function (response) {
            if (response.code === 200) {
                alert("Client added successfully!");
                const modalEl = document.getElementById('user-add-modal');
                const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                modalInstance.hide();
                $("#addUserForm")[0].reset();
                loadAllUsers();
            } else {
                alert("Failed to add client: " + response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            alert("Error occurred while adding client. Status: " + xhr.status);
        }
    });

    });

});