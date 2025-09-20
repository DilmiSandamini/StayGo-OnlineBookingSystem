$(document).ready(async function () {
    console.log("Booking History Page Loaded...");

    const backendUrl = "http://localhost:8080/api/v1/bookings";

    // ------------------ Helper: Get Auth Headers ------------------
    async function getAuthHeaders() {
        try {
            const cookie = await cookieStore.get("token");
            const token = cookie?.value;
            return token ? { Authorization: "Bearer " + token } : {};
        } catch (err) {
            console.error("Failed to get auth token:", err);
            return {};
        }
    }

    // ------------------ Helper: Get User ID from session ------------------
    function getUserId() {
        const userId = sessionStorage.getItem("userId");
        console.log("userID: "+ userId)
        if (!userId) throw new Error("Missing User ID in session");
        return userId;
    }

    // ------------------ Fetch Booking History ------------------
    async function bookingHistoryList() {
        try {
            const userId = getUserId();
            const headers = await getAuthHeaders();

            $.ajax({
                url: `${backendUrl}/user/${userId}`,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...headers
                },
                success: function (result) {
                    console.log("Booking history:", result);

                    const container = $("#booking-history-list");
                    container.empty();

                    if (result.data && result.data.length > 0) {
                        result.data.forEach(booking => {
                            const statusClass = booking.status === 'CONFIRMED'
                                ? 'success'
                                : booking.status === 'CANCELLED'
                                    ? 'danger'
                                    : 'warning';

                            container.append(`
                                <div class="card mb-3 shadow-sm">
                                    <div class="card-body">
                                        <h5 class="card-title">Business ID: ${booking.businessDetailId}</h5>
                                        <p class="card-text">
                                            <b>Check-In:</b> ${new Date(booking.checkInTime).toLocaleString()}<br>
                                            <b>Check-Out:</b> ${new Date(booking.checkOutTime).toLocaleString()}<br>
                                            <b>Rooms:</b> ${booking.roomCount} | <b>Guests:</b> ${booking.guestCount}<br>
                                            <b>Status:</b> 
                                            <span class="badge bg-${statusClass}">${booking.status}</span><br>
                                            <b>Total Price:</b> LKR ${booking.totalPrice}
                                        </p>
                                    </div>
                                </div>
                            `);
                        });
                    } else {
                        container.html("<p class='text-center text-muted'>No bookings found.</p>");
                    }
                },
                error: function (xhr) {
                    console.error("Error loading booking history:", xhr);
                    Swal.fire("Error", "Unable to load booking history!", "error");
                }
            });

        } catch (error) {
            console.error("Error:", error);
            Swal.fire("Error", error.message, "error");
        }
    }

    // ------------------ Initialize ------------------
    bookingHistoryList();
});
