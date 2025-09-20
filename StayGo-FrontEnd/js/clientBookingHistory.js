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
                                        <span id="booking-badge-${booking.bookingId}" 
                                            class="badge bg-${statusClass}">
                                            ${booking.status}
                                        </span><br>
                                        <b>Total Price:</b> LKR ${booking.totalPrice}
                                    </p>
                                    ${booking.status === 'PENDING' ? `
                                        <button class="btn btn-sm btn-danger reject-booking" 
                                                data-id="${booking.bookingId}">
                                            <i class="bi bi-x-circle"></i> Reject
                                        </button>
                                    ` : ''}
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

    // Reject Booking
    $(document).on("click", ".reject-booking", async function () {
        const bookingId = $(this).data("id");
        const headers = await getAuthHeaders();

        Swal.fire({
            title: "Reject this booking?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, reject",
            cancelButtonText: "Cancel"
        }).then(result => {
            if (!result.isConfirmed) return;

            $.ajax({
                url: `${backendUrl}/reject/${bookingId}`,
                method: "PUT",
                headers,
                success: function () {
                    Swal.fire("Rejected!", "Your booking has been cancelled.", "success");

                    // Update badge dynamically
                    const badge = $(`#booking-badge-${bookingId}`);
                    badge.removeClass("bg-success bg-warning")
                        .addClass("bg-danger")
                        .text("CANCELLED");

                    // Remove button after rejection
                    $(`button.reject-booking[data-id=${bookingId}]`).remove();
                },
                error: function (xhr) {
                    Swal.fire("Error", xhr.responseJSON?.message || "Failed to reject booking", "error");
                }
            });
        });
    });


    // ------------------ Initialize ------------------
    bookingHistoryList();
});
