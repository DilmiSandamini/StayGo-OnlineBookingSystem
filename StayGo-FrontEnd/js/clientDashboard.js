$(document).ready(async function () {
    console.log("Client Dashboard Ready ✅");
    const backendUrl = "http://localhost:8080";

    // ===== Helper: Get JWT Headers =====
    async function getAuthHeaders() {
        const cookie = await cookieStore.get("token");
        const token = cookie?.value;
        return token ? { Authorization: "Bearer " + token } : {};
    }

    // ===== Load Businesses =====
    async function loadBusinesses(category = null) {
        const headers = await getAuthHeaders();
        let url = `${backendUrl}/api/v1/business/getAll`;
        if (category) {
            url += `?category=${encodeURIComponent(category)}`;
        }

        $.ajax({
            url: url,
            method: "GET",
            headers,
            success: function (response) {
                const container = $("#businessContainer").empty();

                if (!response.data || response.data.length === 0) {
                    container.html("<p class='text-muted'>No businesses available.</p>");
                    return;
                }

                // Optionally add category title
                if (category) {
                    container.append(`<h4 class="mb-3 w-100">${category}</h4>`);
                }

                response.data.forEach(b => {
                    // Skip inactive businesses
                    if (b.businessStatus === "INACTIVE") return;

                    const card = `
                        <div class="col-md-4 mb-4">
                            <div class="card business-card" data-id="${b.businessId}" style="cursor:pointer;">
                                <img src="${b.businessLogo ? backendUrl + '/' + b.businessLogo : '/images/default-logo.png'}" 
                                     class="business-logo card-img-top" alt="Business Logo" style="height:200px; object-fit:cover;">
                                <div class="card-body">
                                    <h5 class="card-title">${b.businessName}</h5>
                                    <h6>${b.businessAddress}</h6>
                                    <span class="badge bg-primary">${b.businessCategory}</span>
                                    <span class="badge bg-success">${b.businessStatus}</span>
                                </div>
                            </div>
                        </div>
                    `;
                    container.append(card);
                });
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                $("#businessContainer").html("<p class='text-danger'>Failed to load businesses.</p>");
            }
        });
    }

    // ===== Category Click =====
    $(document).on("click", ".property-item", function () {
        const category = $(this).data("category") || $(this).find("p").text().trim();

        if (category === "ALL" || category === "All Places") {
            loadBusinesses(); // load all businesses
        } else {
            loadBusinesses(category);
        }
    });

    // ===== Business Card Click =====
    $(document).on("click", ".business-card", function () {
        const businessId = $(this).data("id");
        window.location.href = `/pages/clientDisplayDetailDashboard.html?businessId=${businessId}`;
    });

    // ===== Initial Load: All Businesses =====
    loadBusinesses(); // No category → loads all
});
