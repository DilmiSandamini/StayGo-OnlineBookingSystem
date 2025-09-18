$(document).ready(async function () {
    console.log("✅ Admin Dashboard Manage Users is ready");

    const backendUrl = "http://localhost:8080";
    let currentPage = 0;
    const pageSize = 10;

    // --- Helper: Get JWT Token ---
    async function getToken() {
        if (window.cookieStore) {
            const cookie = await cookieStore.get("token");
            return cookie?.value;
        }
        // fallback
        const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
        return match ? match[2] : null;
    }

    // --- Generic renderPagination ---
    function renderPagination(totalPages, loaderFunction) {
        let paginationContainer = $("#paginationContainer");
        if (!paginationContainer.length) {
            $(".content").append('<div id="paginationContainer" class="mt-3"></div>');
            paginationContainer = $("#paginationContainer");
        }

        paginationContainer.empty();

        const prevDisabled = currentPage === 0 ? "disabled" : "";
        const nextDisabled = currentPage + 1 === totalPages ? "disabled" : "";

        paginationContainer.append(
            `<button class="btn btn-secondary me-2" ${prevDisabled} id="prevPage">Previous</button>`
        );
        paginationContainer.append(`<span class="me-2">Page ${currentPage + 1} of ${totalPages}</span>`);
        paginationContainer.append(
            `<button class="btn btn-secondary" ${nextDisabled} id="nextPage">Next</button>`
        );

        $("#prevPage").click(() => {
            if (currentPage > 0) {
                currentPage--;
                loaderFunction(currentPage, pageSize);
            }
        });

        $("#nextPage").click(() => {
            if (currentPage + 1 < totalPages) {
                currentPage++;
                loaderFunction(currentPage, pageSize);
            }
        });
    }

    // --- Table Renderer ---
    function renderUsers(users, statsSelector, emptyMessage, loaderFunction, isActiveFilter = null) {
        const usersTable = $("#UsersTableBody");
        usersTable.empty();

        if (!users || users.length === 0) {
            usersTable.html(`<tr><td colspan="9">${emptyMessage}</td></tr>`);
            $(statsSelector).text(0);
            return;
        }

        users.forEach((user) => {
            const statusBadge =
                user.status?.toLowerCase() === "active"
                    ? `<span class="badge bg-success">${user.status}</span>`
                    : `<span class="badge bg-danger">${user.status}</span>`;

            let actionBtns = `
                <button class="btn btn-info btn-sm" onClick="viewUser('${user.id}')">View</button>
                <button class="btn btn-warning btn-sm edit-user-btn" data-id="${user.id}">Edit</button>            `;

            if (isActiveFilter === true) {
                actionBtns += `<button class="btn btn-danger btn-sm" onClick="deactivateUser('${user.id}')">Deactivate</button>`;
            } else if (isActiveFilter === false) {
                actionBtns += `<button class="btn btn-success btn-sm" onClick="activateUser('${user.id}')">Activate</button>`;
            } else {
                actionBtns +=
                    user.status?.toLowerCase() === "active"
                        ? `<button class="btn btn-danger btn-sm" onClick="deactivateUser('${user.id}')">Deactivate</button>`
                        : `<button class="btn btn-success btn-sm" onClick="activateUser('${user.id}')">Activate</button>`;
            }

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
                    <td>${actionBtns}</td>
                </tr>
            `);
        });
    }

    // --- Loader Template ---
    async function loadUsers(url, statsSelector, emptyMsg, loaderFunction, isActiveFilter = null, page = 0, size = 10) {
        try {
            const token = await getToken();
            if (!token) {
                console.error("❌ No token found in cookies");
                return;
            }

            $.ajax({
                method: "GET",
                url: `${backendUrl}${url}?page=${page}&size=${size}`,
                headers: { Authorization: "Bearer " + token },
                success: (response) => {
                    const pageData = response?.data || {};
                    const users = pageData?.content || [];

                    renderUsers(users, statsSelector, emptyMsg, loaderFunction, isActiveFilter);

                    $(statsSelector).text(pageData.totalElements || 0);
                    renderPagination(pageData.totalPages || 1, loaderFunction);
                },
                error: (error) => {
                    console.error("Error fetching users:", error);
                    $("#UsersTableBody").html(`<tr><td colspan="9">Error loading users.</td></tr>`);
                },
            });
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    }

    // --- Specific Loaders ---
    function loadAllUsers(page, size) {
        loadUsers(
            "/api/v1/adminDashboardUserManage/getAllUsers",
            "#totalUsers",
            "No users found.",
            loadAllUsers,
            null,
            page,
            size
        );
    }

    function loadAllClientUsers(page, size) {
        loadUsers(
            "/api/v1/adminDashboardUserManage/getAllClientUsers",
            "#clientUsers",
            "No client users found.",
            loadAllClientUsers,
            null,
            page,
            size
        );
    }

    function loadAllBusinessUsers(page, size) {
        loadUsers(
            "/api/v1/adminDashboardUserManage/getAllBusinessUsers",
            "#businessUsers",
            "No business users found.",
            loadAllBusinessUsers,
            null,
            page,
            size
        );
    }

    function loadAllActiveUsers(page, size) {
        loadUsers(
            "/api/v1/adminDashboardUserManage/getAllActiveUsers",
            "#activeUsers",
            "No active users found.",
            loadAllActiveUsers,
            true,
            page,
            size
        );
    }

    function loadAllInactiveUsers(page, size) {
        loadUsers(
            "/api/v1/adminDashboardUserManage/getAllInactiveUsers",
            "#inactiveUsers",
            "No inactive users found.",
            loadAllInactiveUsers,
            false,
            page,
            size
        );
    }

    // --- Button Binds ---
    $("#userCount").click(() => {
        currentPage = 0;
        loadAllUsers(currentPage, pageSize);
    });

    $("#clientCount").click(() => {
        currentPage = 0;
        loadAllClientUsers(currentPage, pageSize);
    });

    $("#businessCount").click(() => {
        currentPage = 0;
        loadAllBusinessUsers(currentPage, pageSize);
    });

    $("#activeUserCount").click(() => {
        currentPage = 0;
        loadAllActiveUsers(currentPage, pageSize);
    });

    $("#InactiveUserCount").click(() => {
        currentPage = 0;
        loadAllInactiveUsers(currentPage, pageSize);
    });

    // --- Initial Load ---
    loadAllUsers(currentPage, pageSize);

    // --- Dummy functions (implement properly later) ---
    window.viewUser = function (id) {
        alert("View user " + id);
    };
    window.activateUser = function (id) {
        alert("Activate user " + id);
    };
    window.deactivateUser = function (id) {
        alert("Deactivate user " + id);
    };

    // --- Edit User ---
    $(document).on('click', '.edit-user-btn', function() {
    const userId = $(this).data('id');
    editUser(userId);
    });
    window.editUser = function (id) {
    const row = $(`#UsersTableBody tr`).filter(function () {
        return $(this).find("td:first").text() == id;
    });

    $("#editUserId").val(id);
    $("#editFullName").val(row.find("td:nth-child(2)").text());
    $("#editEmail").val(row.find("td:nth-child(3)").text());
    $("#editUsername").val(row.find("td:nth-child(4)").text());
    // $("#editRole").val(row.find("td:nth-child(5)").text());
    $("#editStatus").val(row.find("td:nth-child(6)").text().toLowerCase());

    $("#editUserModal").modal("show");
};


    // --- Save Edited User ---
    $("#editUserForm").off("submit").on("submit", async function (e) {
        e.preventDefault();

        const id = $("#editUserId").val();
        const userData = {
            fullName: $("#editFullName").val(),
            email: $("#editEmail").val(),
            username: $("#editUsername").val(),
            // role: $("#editRole").val(),
            status: $("#editStatus").val()
        };

        const token = await getToken();

        $.ajax({
            method: "PUT",
            url: `${backendUrl}/api/v1/adminDashboardUserManage/updateUser/${id}`,
            headers: { Authorization: "Bearer " + token },
            contentType: "application/json",
            data: JSON.stringify(userData),
            success: function () {
                Swal.fire({
                    icon: "success",
                    title: "User updated successfully!",
                    timer: 1500,
                    showConfirmButton: false
                });
                $("#editUserModal").modal("hide");
                loadAllUsers(currentPage, pageSize);
            },
            error: function (err) {
                console.error("❌ Error updating user:", err);
                Swal.fire("Error", "Failed to update user", "error");
            }
        });
    });

    // --- Deactivate ---
    window.deactivateUser = async function (id) {
        const token = await getToken();
        Swal.fire({
            title: "Are you sure?",
            text: "You want to deactivate this user?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, deactivate"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    method: "PUT",
                    url: `${backendUrl}/api/v1/adminDashboardUserManage/deactivateUser/${id}`,
                    headers: { Authorization: "Bearer " + token },
                    success: function () {
                        Swal.fire("Deactivated!", "User has been deactivated.", "success");
                        loadAllUsers(currentPage, pageSize);
                    },
                    error: function () {
                        Swal.fire("Error", "Failed to deactivate user.", "error");
                    }
                });
            }
        });
    };

    // --- Activate ---
    window.activateUser = async function (id) {
        const token = await getToken();
        Swal.fire({
            title: "Are you sure?",
            text: "You want to activate this user?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, activate"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    method: "PUT",
                    url: `${backendUrl}/api/v1/adminDashboardUserManage/activateUser/${id}`,
                    headers: { Authorization: "Bearer " + token },
                    success: function () {
                        Swal.fire("Activated!", "User has been activated.", "success");
                        loadAllUsers(currentPage, pageSize);
                    },
                    error: function () {
                        Swal.fire("Error", "Failed to activate user.", "error");
                    }
                });
            }
        });
    };

    // --- Initial Load ---
    loadAllUsers(currentPage, pageSize);

    // Add New User
$("#addUserForm").off("submit").on("submit", async function (e) {
    e.preventDefault();

    const registerData = {
        fullName: $("#fullName").val(),
        email: $("#email").val(),
        username: $("#username").val(),
        password: $("#password").val(),
        confirmPassword: $("#confirm-password").val(),
        role: $("#role").val()
    };

    if(registerData.password !== registerData.confirmPassword){
        Swal.fire("Error", "Passwords do not match", "error");
        return;
    }

    const token = await getToken();

    $.ajax({
        method: "POST",
        url: `${backendUrl}/api/v1/adminDashboardUserManage/admin/saveuser`,
        headers: { Authorization: "Bearer " + token },
        contentType: "application/json",
        data: JSON.stringify(registerData),
        success: function () {
            Swal.fire({
                icon: "success",
                title: "User added successfully!",
                timer: 1500,
                showConfirmButton: false
            });
            $("#user-add-modal").modal("hide");
            $("#addUserForm")[0].reset();
            loadAllUsers(currentPage, pageSize); // refresh table
        },
        error: function (err) {
            console.error("❌ Error adding user:", err);
            Swal.fire("Error", "Failed to add user", "error");
        }
    });
});

$(document).ready(function() {
    $("#searchInput").on("keyup", function() {
        const value = $(this).val().toLowerCase();

        $("#UsersTableBody tr").filter(function() {
            $(this).toggle(
                $(this).text().toLowerCase().indexOf(value) > -1
            );
        });
    });
});

});
