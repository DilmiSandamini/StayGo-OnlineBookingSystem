$(document).ready(function () {
    const backendUrl = "http://localhost:8080";

    // --- Get JWT Token ---
    async function getAuthHeaders() {
        const cookie = await cookieStore.get("token");
        const token = cookie?.value;
        return token ? { Authorization: "Bearer " + token } : {};
    }

    // --- Load Business Details (with optional status filter) ---
    async function loadBusinessDetails(page = 0, size = 10, status = null) {
        const headers = await getAuthHeaders();

        let url = `${backendUrl}/api/v1/adminDashboardBusinessDetailManage/getAllBusinessDetails?page=${page}&size=${size}`;
        if (status) {
            url += `&status=${status}`; // pass filter param
        }

        $.ajax({
            url: url,
            method: "GET",
            headers,
            success: function (response) {
                const pageData = response?.data || {};
                const details = pageData?.content || [];

                // Update Total Rooms count (only for all load, not filters)
                if (!status) {
                    $("#totalRooms").text(pageData.totalElements || 0);
                    loadActiveInactiveCounts(headers);
                }

                renderBusinessDetails(details);
            },
            error: function () {
                Swal.fire("Error", "Failed to load business details.", "error");
            }
        });
    }

    // --- Load Active & Inactive Counts ---
    function loadActiveInactiveCounts(headers) {
        $.ajax({
            url: `${backendUrl}/api/v1/adminDashboardBusinessDetailManage/countActiveRooms`,
            method: "GET",
            headers,
            success: function (response) {
                $("#activeRooms").text(response.data || 0);
            }
        });

        $.ajax({
            url: `${backendUrl}/api/v1/adminDashboardBusinessDetailManage/countInactiveRooms`,
            method: "GET",
            headers,
            success: function (response) {
                $("#inactiveRooms").text(response.data || 0);
            }
        });
    }

    // --- Render Table Rows ---
    function renderBusinessDetails(details) {
        const tbody = $("#RoomsTableBody").empty();

        if (!details.length) {
            tbody.html(`<tr><td colspan="14" class="text-center text-muted">No Business Details Found</td></tr>`);
            return;
        }

        details.forEach(d => {
            // ✅ Normalize status to lowercase for comparison
            const statusNormalized = (d.status || "").toLowerCase();
            const statusBadge = statusNormalized === "active"
                ? `<span class="badge bg-success">Active</span>`
                : `<span class="badge bg-danger">Inactive</span>`;

            tbody.append(`
                <tr>
                    <td>${d.businessDetailId}</td>
                    <td>${d.luxuryLevel || "-"}</td>
                    <td>${d.roomsCount || 0}</td>
                    <td>${d.bedsCount || 0}</td>
                    <td>${d.guestCount || 0}</td>
                    <td>${d.pricePerDay || 0}</td>
                    <td>${d.pricePerNight || 0}</td>
                    <td>${statusBadge}</td>
                    <td>${d.roomImage ? `<img src="${backendUrl}/${d.roomImage}" width="60" height="60" style="object-fit:cover"/>` : "-"}</td>
                    <td>${d.facilities || "-"}</td>
                    <td>${d.businessId || "-"}</td>
                    <td>${d.createdAt ? new Date(d.createdAt).toLocaleString() : "-"}</td>
                    <td>${d.updatedAt ? new Date(d.updatedAt).toLocaleString() : "-"}</td>
                    <td>
                        <button class="btn btn-warning btn-sm edit-room" data-id="${d.businessDetailId}">Edit</button>
                        <button class="btn btn-danger btn-sm delete-room" data-id="${d.businessDetailId}">Delete</button>
                    </td>
                </tr>
            `);
        });
    }

    // --- Button Click Handlers ---
    $("#roomCount").on("click", function () {
        loadBusinessDetails(0, 10); // all rooms
    });

    $("#activeRoomCount").on("click", function () {
        loadBusinessDetails(0, 10, "Active"); // only active
    });

    $("#InactiveRoomCount").on("click", function () {
        loadBusinessDetails(0, 10, "Inactive"); // only inactive
    });

    // --- Initial Load ---
    loadBusinessDetails(0, 10);
});
