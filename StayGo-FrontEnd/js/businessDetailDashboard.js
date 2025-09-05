$(document).ready(async function () {
    console.log("Business Detail Dashboard Ready ✅");
    const backendUrl = "http://localhost:8080";

    // ===== Image Preview =====
    const fileInputElem = document.getElementById("roomImages"); // form input id
    const preview = document.getElementById("preview"); // img tag in HTML

    fileInputElem.addEventListener("change", handleFiles);

    function handleFiles(e) {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            alert("Upload an image only!");
            fileInputElem.value = ""; // reset
            preview.style.display = "none";
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            preview.src = event.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }

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

    // ===== Load Business Details =====
    async function loadBusinessDetails() {
        const businessId = getBusinessIdFromQuery();
        if (!businessId) return;

        const headers = await getAuthHeaders();
        $.ajax({
            method: "GET",
            url: `${backendUrl}/api/v1/businessDetails/getByBusinessId`,
            headers,
            data: { businessId },
            success: function(response) {
                const container = $("#business-list").empty();
                if (!response.data || response.data.length === 0) {
                    container.append(`<p class="text-muted">No details found.</p>`);
                    return;
                }
                response.data.forEach(detail => {
                    container.append(`
                        <div class="col-md-4 mb-3">
                            <div class="card shadow-sm p-2">
                                <img src="${detail.roomImage ? backendUrl + '/' + detail.roomImage : '/images/default-logo.png'}" class="card-img-top" style="height:200px; object-fit:cover;">
                                <div class="card-body">
                                    <h5> ${detail.luxuryLevel}</h5>
                                    <p>Rooms: ${detail.roomsCount}</p>
                                    <p>Beds per room: ${detail.bedsCount}</p>
                                    <p>Price Per Day One Room (LKR): LKR ${detail.pricePerDay}</p>
                                    <p>Price Per Night One Room (LKR): LKR ${detail.pricePerNight}</p>
                                    <p>${detail.facilities || ""}</p>
                                </div>
                            </div>
                        </div>
                    `);
                });
            },
            error: function(xhr) {
                console.error(xhr.responseText);
                Swal.fire("Error", "Failed to load business details.", "error");
            }
        });
    }

    // ===== Add Business Details =====
    $("#add-business-form").on("submit", async function(e) {
        e.preventDefault();
        const businessId = getBusinessIdFromQuery();
        if (!businessId) return;

        const headers = await getAuthHeaders();
        const fileInput = $("#roomImages")[0];

        const formData = new FormData();
        formData.append("roomsCount", $("#roomsCount").val());
        formData.append("bedsCount", $("#bedsCount").val());
        formData.append("pricePerDay", $("#pricePerDay").val());
        formData.append("pricePerNight", $("#pricePerNight").val());
        formData.append("luxuryLevel", $("#luxuryLevel").val());
        formData.append("facilities", $("#roomDesc").val());
        formData.append("businessId", businessId);
        if (fileInput.files.length) formData.append("roomImage", fileInput.files[0]);

        $.ajax({
            method: "POST",
            url: `${backendUrl}/api/v1/businessDetails/create`,
            headers,
            processData: false,
            contentType: false,
            data: formData,
            success: function(response) {
                Swal.fire("Success!", "Business details added.", "success");
                $("#add-business-form")[0].reset();
                preview.style.display = "none"; // hide preview after submit
                loadBusinessDetails();
            },
            error: function(xhr) {
                console.error(xhr.responseText);
                Swal.fire("Error", xhr.responseJSON?.message || "Error creating details!", "error");
            }
        });
    });

    // ===== Reset Button =====
    $("#resetBtn").click(function(e){
        e.preventDefault();
        Swal.fire({
            title: "Reset form?",
            icon: "warning",
            showCancelButton: true
        }).then(result => {
            if(result.isConfirmed){
                $("#add-business-form")[0].reset();
                preview.style.display = "none"; // hide preview on reset
            }
        });
    });

    // ===== Initial Load =====
    loadBusinessDetails();
});
