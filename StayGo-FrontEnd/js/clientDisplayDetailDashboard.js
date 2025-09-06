$(document).ready(async function () {
    console.log("Client Display Detail Dashboard Ready ✅");

    const backendUrl = "http://localhost:8080";

    // ===== Helper Functions =====
    function getBusinessIdFromQuery() {
        const params = new URLSearchParams(window.location.search);
        return params.get("businessId");
    }

    async function getAuthHeaders() {
        const cookie = await cookieStore.get("token");
        const token = cookie?.value;
        return token ? { Authorization: "Bearer " + token } : {};
    }

    // ===== Load Business Info =====
    async function loadBusinessInfo() {
        const businessId = getBusinessIdFromQuery();
        if (!businessId) return;

        const headers = await getAuthHeaders();
        $.ajax({
            method: "GET",
            url: `${backendUrl}/api/v1/business/getById`,
            headers,
            data: { businessId },
            success: function (response) {
                const b = response.data;
                $("#businessHeader").html(`
                    <div class="row g-3 align-items-center">
                        <div class="col-md-4 text-center">
                            <img src="${b.businessLogo ? backendUrl + '/' + b.businessLogo : '/images/default-logo.png'}"
                                class="img-fluid rounded shadow-sm" style="max-height:220px; object-fit:cover;">
                        </div>
                        <div class="col-md-8">
                            <h3 class="text-primary fw-bold">${b.businessName}</h3>
                            <p><i class="bi bi-geo-alt"></i> ${b.businessAddress}</p>
                            <p><i class="bi bi-envelope"></i> ${b.businessEmail} | <i class="bi bi-telephone"></i> ${b.contactNumber1}</p>
                        </div>
                    </div>
                `);
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                Swal.fire("Error", "Failed to load business info.", "error");
            }
        });
    }

    // ===== Load Business Room Details =====
    async function loadRoomDetails() {
        const businessId = getBusinessIdFromQuery();
        if (!businessId) return;

        const headers = await getAuthHeaders();
        $.ajax({
            method: "GET",
            url: `${backendUrl}/api/v1/businessDetails/getByBusinessId`,
            headers,
            data: { businessId },
            success: function (response) {
                const container = $("#room-list").empty();
                if (!response.data || response.data.length === 0) {
                    container.append(`<p class="text-muted">No rooms available for this business.</p>`);
                    return;
                }
                response.data.forEach(detail => {
                    container.append(`
                        <div class="col-md-4 mb-4">
                            <div class="card shadow-sm h-100">
                                <img src="${detail.roomImage ? backendUrl + '/' + detail.roomImage : '/images/default-room.png'}"
                                     class="card-img-top" style="height:200px; object-fit:cover;">
                                <div class="card-body">
                                    <h5 class="fw-bold">${detail.luxuryLevel}</h5>
                                    <p>Rooms: ${detail.roomsCount}</p>
                                    <p>Beds per room: ${detail.bedsCount}</p>
                                    <p>Day Price: LKR ${detail.pricePerDay}</p>
                                    <p>Night Price: LKR ${detail.pricePerNight}</p>
                                    <p>${detail.facilities || ""}</p>
                                    <button class="btn btn-sm btn-primary" onclick="window.location.href='/pages/businessBooking.html?businessId=${businessId}&detailId=${detail.businessDetailId}'">Processe To Booking</button>
                                </div>
                            </div>
                        </div>
                    `);
                });
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                Swal.fire("Error", "Failed to load room details.", "error");
            }
        });
    }

    // ===== Initial Load =====
    await loadBusinessInfo();
    await loadRoomDetails();
});
