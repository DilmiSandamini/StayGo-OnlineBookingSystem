$(document).ready(function () {
    const backendUrl = "http://localhost:8080";
    let currentPage = 0;
    const pageSize = 10;

    async function getAuthHeaders() {
        const cookie = await cookieStore.get("token");
        const token = cookie?.value;
        return token ? { Authorization: "Bearer " + token } : {};
    }

    // --- Generic loader ---
    async function loadBusinesses(url, statsSelector, emptyMsg, isActiveFilter = null, page = 0, size = 10) {
        const headers = await getAuthHeaders();
        $.ajax({
            url: `${backendUrl}${url}?page=${page}&size=${size}`,
            method: "GET",
            headers,
            success: function (response) {
                const pageData = response?.data || {};
                const businesses = pageData?.content || [];
                renderBusinesses(businesses, statsSelector, emptyMsg, isActiveFilter);
                $(statsSelector).text(pageData.totalElements || 0);
            },
            error: function () {
                Swal.fire("Error", "Failed to load businesses.", "error");
            }
        });
    }

    // --- Render table ---
    function renderBusinesses(businesses, statsSelector, emptyMsg, isActiveFilter) {
        const tbody = $("#BusinessTableBody").empty();
        if (!businesses.length) {
            tbody.html(`<tr><td colspan="14" class="text-center text-muted">${emptyMsg}</td></tr>`);
            $(statsSelector).text(0);
            return;
        }

        businesses.forEach(b => {
            const statusBadge = b.businessStatus?.toLowerCase() === "active" 
                ? `<span class="badge bg-success">${b.businessStatus}</span>` 
                : `<span class="badge bg-danger">${b.businessStatus}</span>`;

            let actionBtns = `
                <button class="btn btn-warning btn-sm me-1 edit-business" data-id="${b.businessId}">Edit</button>
            `;

            if (isActiveFilter === true || b.businessStatus?.toLowerCase() === "active") {
                actionBtns += `<button class="btn btn-danger btn-sm" onClick="deactivateBusiness('${b.businessId}')">Deactivate</button>`;
            } else {
                actionBtns += `<button class="btn btn-success btn-sm" onClick="activateBusiness('${b.businessId}')">Activate</button>`;
            }

            tbody.append(`
                <tr>
                    <td>${b.businessId}</td>
                    <td>${b.businessName}</td>
                    <td>${b.contactNumber1}</td>
                    <td>${b.contactNumber2 || "-"}</td>
                    <td>${b.businessEmail}</td>
                    <td>${b.businessAddress}</td>
                    <td>${b.businessCategory}</td>
                    <td>${b.businessLogo ? `<img src="${backendUrl}/${b.businessLogo}" width="60" height="60" style="object-fit:cover"/>` : "-"}</td>
                    <td>${b.businessDescription || "-"}</td>
                    <td>${statusBadge}</td>
                    <td>${b.userId || "-"}</td>
                    <td>${b.createdAt ? new Date(b.createdAt).toLocaleString() : "-"}</td>
                    <td>${b.updatedAt ? new Date(b.updatedAt).toLocaleString() : "-"}</td>
                    <td>${actionBtns}</td>
                </tr>
            `);
        });
    }

    // --- Loaders ---
    function loadAllBusinesses(page = 0, size = 10) {
        loadBusinesses("/api/v1/adminDashboardBusinessManage/getAllBusinesses", "#totalBusiness", "No businesses found", null, page, size);
    }
    function loadAllActiveBusinesses(page = 0, size = 10) {
        loadBusinesses("/api/v1/adminDashboardBusinessManage/getAllActiveBusinesses", "#activeBusiness", "No active businesses found", true, page, size);
    }
    function loadAllInactiveBusinesses(page = 0, size = 10) {
        loadBusinesses("/api/v1/adminDashboardBusinessManage/getAllInactiveBusinesses", "#inactiveBusiness", "No inactive businesses found", false, page, size);
    }

    // --- Button binds ---
    $("#businessCount").click(() => { currentPage = 0; loadAllBusinesses(currentPage, pageSize); });
    $("#activeBusinessCount").click(() => { currentPage = 0; loadAllActiveBusinesses(currentPage, pageSize); });
    $("#InactiveBusinessCount").click(() => { currentPage = 0; loadAllInactiveBusinesses(currentPage, pageSize); });

    // --- Add Business ---
    $("#saveBusinessBtn").click(async () => {
    const headers = await getAuthHeaders();
    const formData = new FormData();

    formData.append("businessName", $("#businessName").val());
    formData.append("contactNumber1", $("#contactNumber1").val());
    formData.append("contactNumber2", $("#contactNumber2").val());
    formData.append("businessEmail", $("#businessEmail").val());
    formData.append("businessAddress", $("#businessAddress").val());
    formData.append("businessCategory", $("#businessCategory").val());
    formData.append("businessDescription", $("#businessDescription").val());
    formData.append("userId", $("#userId").val());

    const logoFile = $("#businessLogo")[0].files[0];
    if (logoFile) {
        formData.append("businessLogo", logoFile);
    }

    $.ajax({
        url: `${backendUrl}/api/v1/adminDashboardBusinessManage/admin/saveBusiness`,
        method: "POST",
        headers,
        processData: false,
        contentType: false,
        data: formData,
        success: function () {
            Swal.fire("Success", "Business added successfully", "success");
            $("#addBusinessModal").modal('hide');
            loadAllBusinesses(currentPage, pageSize);
            $("#addBusinessForm")[0].reset(); // clear form
        },
        error: function () {
            Swal.fire("Error", "Failed to add business", "error");
        }
    });
});
    // --- Initial load ---
    loadAllBusinesses(currentPage, pageSize );
});
