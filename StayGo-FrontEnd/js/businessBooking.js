$(document).ready(async function () {
    console.log("Business Booking Page Ready ✅");

    const backendUrl = "http://localhost:8080";

    function getParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            businessId: params.get("businessId"),
            detailId: params.get("detailId")
        };
    }

    async function getAuthHeaders() {
        const cookie = await cookieStore.get("token");
        const token = cookie?.value;
        return token ? { Authorization: "Bearer " + token } : {};
    }

    // ==== Load Room Info ====
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
                                    <p>Rooms: ${d.roomsCount}</p>
                                    <p>Beds: ${d.bedsCount}</p>
                                    <p>Day Price: LKR ${d.pricePerDay}</p>
                                    <p>Night Price: LKR ${d.pricePerNight}</p>
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

    // ==== Submit Booking ====
    $("#bookingForm").on("submit", async function (e) {
        e.preventDefault();
        const { detailId } = getParams();
        const headers = await getAuthHeaders();

        // Get userId from sessionStorage
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
            Swal.fire("Error", "You must login before booking!", "error");
            return;
        }

        // ✅ Validate check-in and check-out dates
        const checkInDate = new Date($("#checkInDate").val());
        const checkOutDate = new Date($("#checkOutDate").val());
        if (checkInDate >= checkOutDate) {
            Swal.fire("Error", "Check-in date must be before check-out date", "error");
            return;
        }

        const payload = {
            userId: parseInt(userId, 10),
            businessDetailId: parseInt(detailId, 10),
            bookingTime: $("#bookingTime").val(),  // DAY / NIGHT / BOTH
            checkInTime: $("#checkInDate").val() + "T12:00:00",
            checkOutTime: $("#checkOutDate").val() + "T10:00:00",
            roomCount: parseInt($("#roomCount").val(), 10),
        };

        $.ajax({
            method: "POST",
            url: `${backendUrl}/api/v1/bookings/create`,
            headers: { ...headers, "Content-Type": "application/json" },
            data: JSON.stringify(payload),
            success: function (res) {
                Swal.fire("Success", "Your booking has been placed!", "success")
                    .then(() => {
                        window.location.href = "/pages/clientDashboard.html";
                    });
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                const msg = xhr.responseJSON?.message || "Failed to create booking";
                Swal.fire("Error", msg, "error");
            }
        });
    });

    // Initial Load
    await loadRoomInfo();
});
