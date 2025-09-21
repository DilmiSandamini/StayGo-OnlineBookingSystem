// ==============================
// Handle Payment Button (Card / COD)
// ==============================
$(document).on("click", "#payNowBtn", async function () {
    const paymentMethod = $("input[name='payment-method']:checked").val();
    if (!paymentMethod) {
        Swal.fire("Error", "Please select a payment method", "error");
        return;
    }

    const total = calculateTotalPrice();
    if (!lastBooking) {
        Swal.fire("Error", "Please complete booking first!", "error");
        return;
    }

    if (paymentMethod === "card") {
        // --- PayHere Card Flow ---
        const payment = {
            sandbox: true,
            merchant_id: "YOUR_MERCHANT_ID", // replace with real merchant id
            return_url: `${window.location.origin}/infomation-pages/success.html`,
            cancel_url: `${window.location.origin}/infomation-pages/cancel.html`,
            notify_url: `${backendUrl}/api/v1/payments/notify`,
            order_id: "BOOKING_" + Date.now(),
            items: "StayGo Room Booking",
            amount: total.toFixed(2),
            currency: "LKR",
            first_name: lastBooking.firstName,
            last_name: lastBooking.lastName,
            email: lastBooking.email,
            phone: lastBooking.phoneNumber,
            address: lastBooking.address,
            city: "Matara",
            country: "Sri Lanka"
        };

        payhere.startPayment(payment);

        // Callback: success
        payhere.onCompleted = async function (orderId) {
            const token = (await cookieStore.get("token"))?.value;

            const paymentData = {
                bookingId: lastBooking.bookingId, // backend booking id
                userId: lastBooking.userId,
                totalAmount: total,
                paymentMethod: "Card",
                paymentStatus: "Paid"
            };

            $.ajax({
                url: `${backendUrl}/api/v1/payments/savePayment`,
                type: "POST",
                contentType: "application/json",
                headers: { Authorization: "Bearer " + token },
                data: JSON.stringify(paymentData),
                success: function () {
                    Swal.fire("Success", "Payment successful!", "success");
                },
                error: function (xhr) {
                    console.error("Error saving payment:", xhr.responseText);
                    Swal.fire("Error", "Payment failed to save!", "error");
                }
            });
        };
    } else if (paymentMethod === "cod") {
        // --- COD Flow ---
        const token = (await cookieStore.get("token"))?.value;

        const paymentData = {
            bookingId: lastBooking.bookingId,
            userId: lastBooking.userId,
            totalAmount: total,
            paymentMethod: "Cash on Delivery",
            paymentStatus: "Pending"
        };

        $.ajax({
            url: `${backendUrl}/api/v1/payments/savePayment`,
            type: "POST",
            contentType: "application/json",
            headers: { Authorization: "Bearer " + token },
            data: JSON.stringify(paymentData),
            success: function () {
                Swal.fire("Success", "Booking confirmed with COD!", "success");
            },
            error: function (xhr) {
                console.error("Error saving COD payment:", xhr.responseText);
                Swal.fire("Error", "COD Payment failed to save!", "error");
            }
        });
    }
});
