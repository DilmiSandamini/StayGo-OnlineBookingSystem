$(document).ready(function () {
    console.log("Business Booking Page Ready ✅");

    const backendUrl = "http://localhost:8080";

    // Get query params
    function getParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            businessId: params.get("businessId"),
            detailId: params.get("detailId")
        };
    }

    // Get JWT token from cookie
    async function getAuthHeaders() {
        const cookie = await cookieStore.get("token");
        const token = cookie?.value;
        return token ? { Authorization: "Bearer " + token } : {};
    }

    // Load Room Info
    async function loadRoomInfo() {
        const { detailId } = getParams();
        if (!detailId) return;

        const headers = await getAuthHeaders();
        $.ajax({
            method: "GET",
            url: `${backendUrl}/api/v1/businessDetails/getById`,
            headers,
            data: { businessDetailId: detailId },
            success: function (res) {
                const d = res.data;
                $("#roomInfo").html(`
                    <div class="card shadow-sm">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img src="${d.roomImage ? backendUrl + '/' + d.roomImage : '/images/default-room.png'}"
                                     class="img-fluid rounded-start" style="height:220px; object-fit:cover;">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="fw-bold">${d.luxuryLevel}</h5>
                                    <p>Rooms count: ${d.roomsCount}</p>
                                    <p>Beds per room: ${d.bedsCount}</p>
                                    <p>Price Per Day One Room : LKR ${d.pricePerDay}</p>
                                    <p>Price Per Night One Room : LKR ${d.pricePerNight}</p>
                                    <p>${d.facilities || ""}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                Swal.fire("Error", "Failed to load room details", "error");
            }
        });
    }

    // Submit Booking
    $("#bookingForm").on("submit", async function (e) {
        e.preventDefault();
        const { detailId } = getParams();
        const headers = await getAuthHeaders();

        const userId = sessionStorage.getItem("userId");
        if (!userId) {
            Swal.fire("Error", "You must login before booking!", "error");
            return;
        }

        const checkInDate = new Date($("#checkInDate").val());
        const checkOutDate = new Date($("#checkOutDate").val());

        if (checkInDate >= checkOutDate) {
            Swal.fire("Error", "Check-in date must be before check-out date", "error");
            return;
        }

        const payload = {
            userId: parseInt(userId, 10),
            businessDetailId: parseInt(detailId, 10),
            bookingTime: $("#bookingTime").val(),
            checkInTime: $("#checkInDate").val()  + "T12:00:00",
            checkOutTime: $("#checkOutDate").val() + "T12:00:00",
            roomCount: parseInt($("#roomCount").val(), 10)
        };

        $.ajax({
            method: "POST",
            url: `${backendUrl}/api/v1/bookings/create`,
            headers: { ...headers, "Content-Type": "application/json" },
            data: JSON.stringify(payload),
            success: function (res) {
                Swal.fire("Success", "Your booking has been placed!", "success")
                    .then(() => window.location.href = "/pages/clientDashboard.html");
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                const msg = xhr.responseJSON?.message || "Failed to create booking";
                Swal.fire("Error", msg, "error");
            }
        });
    });

    // Initial load
    loadRoomInfo();
});
