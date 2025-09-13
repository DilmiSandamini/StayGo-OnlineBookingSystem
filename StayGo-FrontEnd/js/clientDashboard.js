$(document).ready(async function () {
    console.log("Client Dashboard Ready ✅");
    const backendUrl = "http://localhost:8080";

    async function getAuthHeaders() {
        const cookie = await cookieStore.get("token");
        const token = cookie?.value;
        return token ? { Authorization: "Bearer " + token } : {};
    }

    // Load businesses (optionally filtered by category)
    async function loadBusinesses(category = null) {
        const headers = await getAuthHeaders();
        let url = `${backendUrl}/api/v1/business/getAll`;
        if (category) {
            url += `?category=${category}`;
        }

        $.ajax({
            url: url,
            method: "GET",
            headers,
            success: function (response) {
                const container = $("#businessContainer").empty();

                if (!response.data || response.data.length === 0) {
                    container.html("<p class='text-muted'>No businesses available for this category.</p>");
                    return;
                }

                response.data.forEach(b => {
                    // === ADD THIS CHECK ===
                    if (b.businessStatus === "INACTIVE") {
                        return; // Skip inactive businesses
                    }

                    const card = `
                        <div class="col-md-4 mb-4">
                            <div class="card business-card" data-id="${b.businessId}">
                                <img src="${b.businessLogo ? backendUrl + '/' + b.businessLogo : '/images/default-logo.png'}" class="business-logo card-img-top" alt="Business Logo">
                                <div class="card-body">
                                    <h5 class="card-title">${b.businessName}</h5>
                                    <p class="card-text">${b.businessDescription || "No description available"}</p>
                                    <span class="badge bg-primary">${b.businessCategory}</span>
                                    <span class="badge bg-success">${b.businessStatus}</span>
                                </div>
                            </div>
                        </div>
                    `;
                    container.append(card);
                });

                // Add section title (category name)
                if (category) {
                    container.prepend(`<h4 class="mb-3 w-100">${category}</h4>`);
                }
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                $("#businessContainer").html("<p class='text-danger'>Failed to load businesses.</p>");
            }
        });
    }

    // Category card click → load related businesses
    $(document).on("click", ".property-item", function () {
        const category = $(this).find("p").text().trim(); // Hotels, Villas, etc.
        loadBusinesses(category);
    });

    // Business card click → open detail dashboard
    $(document).on("click", ".business-card", function () {
    const businessId = $(this).data("id");
    window.location.href = `/pages/clientDisplayDetailDashboard.html?businessId=${businessId}`;
});

    // // Initial load → show all
    // loadBusinesses();
});
