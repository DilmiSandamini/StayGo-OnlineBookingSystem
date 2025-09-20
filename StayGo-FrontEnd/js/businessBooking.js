$(document).ready(function () {
    console.log("Business Booking Page Ready ✅");

    const backendUrl = "http://localhost:8080";
    let roomDetails = null;
    let lastBooking = null;
    let availableRooms = 0;

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
                roomDetails = d;

                $("#roomInfo").html(`
                    <div class="room-card">
                        <img src="${d.roomImage ? backendUrl + '/' + d.roomImage : '/images/default-room.png'}" alt="Room Image" class="room-img">
                        <div class="room-details">
                            <h5 class="room-title">${d.luxuryLevel}</h5>
                            <p><strong>Rooms count:</strong> ${d.roomsCount}</p>
                            <p><strong>Beds per room:</strong> ${d.bedsCount}</p>
                            <p><strong>Guests allowed:</strong> ${d.guestCount}</p>
                            <p><strong>Price Per Day:</strong> LKR ${d.pricePerDay}</p>
                            <p><strong>Price Per Night:</strong> LKR ${d.pricePerNight}</p>
                            ${d.facilities ? `<div class="facilities">${d.facilities.split(',').map(f => `<span>${f.trim()}</span>`).join('')}</div>` : ''}
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

    // Fetch available rooms
    async function fetchAvailableRooms(detailId, checkIn, checkOut) {
        const headers = await getAuthHeaders();
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: `${backendUrl}/api/v1/businessDetails/available`,
                headers,
                data: { businessDetailId: detailId, checkIn: checkIn, checkOut: checkOut },
                success: function (res) {
                    availableRooms = res.data || 0;
                    $("#availableRooms").text(availableRooms);

                    const currentCount = parseInt($("#roomCount").val(), 10);
                    if (currentCount > availableRooms) {
                        $("#roomCount").val(availableRooms);
                        Swal.fire("Notice", "Room count adjusted to available limit", "info");
                    }
                    resolve(availableRooms);
                },
                error: function (xhr) {
                    console.error(xhr.responseText);
                    Swal.fire("Error", "Failed to fetch available rooms", "error");
                    reject();
                }
            });
        });
    }

    // Trigger availability check when dates change
    $(document).on("change", "#checkInDate, #checkOutDate", async function () {
        const { detailId } = getParams();
        const checkIn = $("#checkInDate").val();
        const checkOut = $("#checkOutDate").val();
        if (checkIn && checkOut) {
            await fetchAvailableRooms(detailId, checkIn, checkOut);
        }
    });

    // Handle booking time radio -> hidden input
    $(document).on("change", ".booking-time-radio", function () {
        const value = $(this).val();
        $("#bookingTime").val(value).trigger("change");
    });

    // Payment selection
    $(document).on("click", ".payment-btn", function () {
        $(".payment-btn").removeClass("active");
        $(this).addClass("active");
        $("#paymentMethod").val($(this).data("value"));
        updateBookingSummary();
    });

    // Calculate total price
    function calculateTotalPrice() {
        if (!roomDetails) return 0;
        const checkIn = $("#checkInDate").val();
        const checkOut = $("#checkOutDate").val();
        const bookingTime = $("#bookingTime").val();
        const roomCount = parseInt($("#roomCount").val(), 10) || 0;

        if (!checkIn || !checkOut || !bookingTime || !roomCount) return 0;

        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        const days = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));

        let pricePerRoom = 0;
        if (bookingTime === "DAY") pricePerRoom = roomDetails.pricePerDay;
        else if (bookingTime === "NIGHT") pricePerRoom = roomDetails.pricePerNight;
        else if (bookingTime === "BOTH") pricePerRoom = roomDetails.pricePerDay + roomDetails.pricePerNight;

        return pricePerRoom * roomCount * days;
    }

    // Update booking summary
    function updateBookingSummary() {
    const checkIn = $("#checkInDate").val();
    const checkOut = $("#checkOutDate").val();
    const bookingTime = $("#bookingTime").val();
    const roomCount = $("#roomCount").val();
    const guestCount = $("#guestCount").val();
    const paymentMethod = $("#paymentMethod").val();
    const totalPrice = calculateTotalPrice();

    let summaryHtml = "";
    if (checkIn || checkOut || bookingTime || roomCount || paymentMethod || lastBooking) {
        const booking = lastBooking || {};
        summaryHtml = `
            <div class="booking-card">
                <strong>Booking Details:</strong>
                <p>Name: ${$("#firstName").val() || booking.firstName || "-"} ${$("#lastName").val() || booking.lastName || "-"}</p>
                <p>Email: ${$("#email").val() || booking.email || "-"}</p>
                <p>Phone: ${$("#phoneNumber").val() || booking.phoneNumber || "-"}</p>
                <p>Address: ${$("#address").val() || booking.address || "-"}</p>
                <p>Check-In Date: ${checkIn || booking.checkInDate || "-"}</p>
                <p>Check-Out Date: ${checkOut || booking.checkOutDate || "-"}</p>
                <p>Booking Time: ${bookingTime || booking.bookingTime || "-"}</p>
                <p>Room Count: ${roomCount || booking.roomCount || "-"}</p>
                <p>Guest Count: ${guestCount || booking.guestCount || "-"}</p>
                <p><strong>Total Price: LKR ${totalPrice || booking.totalPrice || 0}</strong></p>
            </div>
        `;
    }

    $("#bookingSummary").html(summaryHtml);
}


    // Update summary on form input/change
    $(document).on("input change", "#bookingForm input, #bookingForm select", function () {
        updateBookingSummary();
    });

    // Room count controls
    $("#increaseRoom").on("click", function () {
        let val = parseInt($("#roomCount").val(), 10);
        if (val < availableRooms) {
            $("#roomCount").val(val + 1).trigger("change");
        } else {
            Swal.fire("Limit Reached", "No more available rooms!", "warning");
        }
    });
    $("#decreaseRoom").on("click", function () {
        let val = parseInt($("#roomCount").val(), 10);
        if (val > 1) $("#roomCount").val(val - 1).trigger("change");
    });

    // Guest count controls
    $("#increaseGuest").on("click", function () {
        let val = parseInt($("#guestCount").val(), 10);
        if (roomDetails && val < roomDetails.guestCount) {
            $("#guestCount").val(val + 1).trigger("change");
        } else {
            Swal.fire("Limit Reached", "Guest count cannot exceed allowed limit!", "warning");
        }
    });
    $("#decreaseGuest").on("click", function () {
        let val = parseInt($("#guestCount").val(), 10);
        if (val > 1) $("#guestCount").val(val - 1).trigger("change");
    });

    // Submit booking
    $("#bookingForm").on("submit", async function (e) {
        e.preventDefault();
        const { detailId } = getParams();
        const headers = await getAuthHeaders();
        const userId = sessionStorage.getItem("userId");

        if (!userId) {
            Swal.fire("Error", "You must login before booking!", "error");
            return;
        }

        const checkInDate = $("#checkInDate").val();
        const checkOutDate = $("#checkOutDate").val();
        if (new Date(checkInDate) >= new Date(checkOutDate)) {
            Swal.fire("Error", "Check-in date must be before check-out date", "error");
            return;
        }

        const requestedRooms = parseInt($("#roomCount").val(), 10);
        if (requestedRooms > availableRooms) {
            Swal.fire("Error", "Selected rooms exceed available rooms!", "error");
            return;
        }

        const requestedGuests = parseInt($("#guestCount").val(), 10);
        if (roomDetails && requestedGuests > roomDetails.guestCount) {
            Swal.fire("Error", `Guest count exceeds allowed limit! Max allowed: ${roomDetails.guestCount}`, "error");
            return;
        }

        const totalPrice = calculateTotalPrice();

        const payload = {
            userId: parseInt(userId, 10),
            businessDetailId: parseInt(detailId, 10),
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            email: $("#email").val(),
            phoneNumber: $("#phoneNumber").val(),
            address: $("#address").val(),
            bookingTime: $("#bookingTime").val(),
            checkInTime: checkInDate + "T12:00:00",
            checkOutTime: checkOutDate + "T12:00:00",
            roomCount: parseInt($("#roomCount").val(), 10),
            guestCount: parseInt($("#guestCount").val(), 10),
            totalPrice: totalPrice
        };

        $.ajax({
            method: "POST",
            url: `${backendUrl}/api/v1/bookings/create`,
            headers: { ...headers, "Content-Type": "application/json" },
            data: JSON.stringify(payload),
            success: function (res) {
                Swal.fire("Success", "Your booking has been placed!", "success").then(() => {
                    lastBooking = {
                        firstName: $("#firstName").val(),
                        lastName: $("#lastName").val(),
                        email: $("#email").val(),
                        phoneNumber: $("#phoneNumber").val(),
                        address: $("#address").val(),
                        checkInDate: checkInDate,
                        checkOutDate: checkOutDate,
                        bookingTime: $("#bookingTime").val(),
                        roomCount: $("#roomCount").val(),
                        guestCount: $("#guestCount").val(),
                        totalPrice: totalPrice
                    };

                    updateBookingSummary();

                    $("#bookingForm")[0].reset();
                    $("#paymentMethod").val("");
                    $(".payment-btn").removeClass("active");
                    $("#bookingTime").val(""); // clear hidden booking time
                });
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
