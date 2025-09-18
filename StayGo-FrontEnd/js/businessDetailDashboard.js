const backendUrl = "http://localhost:8080";

// ===== Helper Functions =====
async function getAuthHeaders() {
    const cookie = await cookieStore.get("token");
    const token = cookie?.value;
    return token ? { Authorization: "Bearer " + token } : {};
}

function getBusinessIdFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("businessId");
}

// ===== Global Load Function =====
async function loadBusinessDetails() {
    const businessId = getBusinessIdFromQuery();
    if (!businessId) return;

    const headers = await getAuthHeaders();
    $.ajax({
        method: "GET",
        url: `${backendUrl}/api/v1/businessDetails/getByBusinessId`,
        headers,
        data: { businessId },
        success: function (response) {
            const container = $("#business-list").empty();
            if (!response.data || response.data.length === 0) {
                container.append(`<p class="text-muted">No details found.</p>`);
                return;
            }
            response.data.forEach(detail => {
                container.append(`
                    <div class="col-md-4 mb-3">
                        <div class="card shadow-sm p-2">
                            <img src="${detail.roomImage ? backendUrl + '/' + detail.roomImage : '/images/default-logo.png'}" 
                                class="card-img-top" style="height:200px; object-fit:cover;">
                            <div class="position-absolute p-2 top-0 end-0 m-2 d-flex gap-2">
                                <button class="btn btn-sm btn-primary edit-business" data-id="${detail.businessDetailId}" title="Edit">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button class="btn btn-sm btn-danger delete-business" data-id="${detail.businessDetailId}" title="Delete">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                            <div class="card-body">
                                <h5>${detail.luxuryLevel}</h5>
                                <p>Rooms: ${detail.roomsCount}</p>
                                <p>Beds per room: ${detail.bedsCount}</p>
                                <p>Guest Count per room: ${detail.guestCount}</p>
                                <p>Price Per Day One Room : LKR ${detail.pricePerDay}</p>
                                <p>Price Per Night One Room : LKR ${detail.pricePerNight}</p>
                                <p>${detail.facilities || ""}</p>
                                <h3 class="badge w-50 p-3 bg-${detail.status === 'ACTIVE' ? 'success' : 'danger'} business-detail-status">
                                    ${detail.status}
                                </h3>
                            </div>
                        </div>
                    </div>
                `);
            });
        },
        error: function (xhr) {
            console.error(xhr.responseText);
            Swal.fire("Error", "Failed to load business details.", "error");
        }
    });
}

$(document).ready(async function () {
    console.log("Business Detail Dashboard Ready ✅");

    // ===== Image Preview (Add Form) =====
    const fileInputElem = document.getElementById("roomImages");
    const preview = document.getElementById("preview");

    fileInputElem.addEventListener("change", handleFiles);

    function handleFiles(e) {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            alert("Upload an image only!");
            fileInputElem.value = "";
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

    // ===== Add Business Details =====
    $("#add-business-form").on("submit", async function (e) {
        e.preventDefault();
        const businessId = getBusinessIdFromQuery();
        if (!businessId) return;

        const headers = await getAuthHeaders();
        const fileInput = $("#roomImages")[0];

        const formData = new FormData();
        formData.append("roomsCount", $("#roomsCount").val());
        formData.append("bedsCount", $("#bedsCount").val());
        formData.append("guestCount", $("#guestCount").val());
        formData.append("pricePerDay", $("#pricePerDay").val());
        formData.append("pricePerNight", $("#pricePerNight").val());
        formData.append("luxuryLevel", $("#luxuryLevel").val());
        formData.append("status", "ACTIVE");
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
            success: function () {
                Swal.fire("Success!", "Business details added.", "success");
                $("#add-business-form")[0].reset();
                preview.style.display = "none";
                loadBusinessDetails();
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                Swal.fire("Error", xhr.responseJSON?.message || "Error creating details!", "error");
            }
        });
    });

    // ===== Reset Button =====
    $("#resetBtn").click(function (e) {
        e.preventDefault();
        Swal.fire({
            title: "Reset form?",
            icon: "warning",
            showCancelButton: true
        }).then(result => {
            if (result.isConfirmed) {
                $("#add-business-form")[0].reset();
                preview.style.display = "none";
            }
        });
    });

    // ===== Initial Load =====
    loadBusinessDetails();
});

// ===== Handle Edit Click =====
$(document).on("click", ".edit-business", async function () {
    const detailId = $(this).data("id");
    const headers = await getAuthHeaders();

    $.ajax({
        method: "GET",
        url: `${backendUrl}/api/v1/businessDetails/getById`,
        headers,
        data: { businessDetailId: detailId },
        success: function (response) {
            const d = response.data;
            $("#editBusinessDetailId").val(d.businessDetailId);
            $("#editLuxuryLevel").val(d.luxuryLevel);
            $("#editRoomsCount").val(d.roomsCount);
            $("#editBedsCount").val(d.bedsCount);
            $("#editGuestCount").val(d.guestCount);
            $("#editPricePerDay").val(d.pricePerDay);
            $("#editPricePerNight").val(d.pricePerNight);
            $("#editRoomDesc").val(d.facilities);
            $("#editStatus").val(d.status);

            if (d.roomImage) {
                $("#editPreview").attr("src", backendUrl + "/" + d.roomImage).show();
            } else {
                $("#editPreview").hide();
            }

            $("#Business-edit-modal").modal("show");
        },
        error: function (xhr) {
            console.error(xhr.responseText);
            Swal.fire("Error", "Failed to fetch details for editing.", "error");
        }
    });
});

// ===== Reset with SweetAlert =====
    $("#resetBtn").click(function (e) {
        e.preventDefault();
        Swal.fire({
            title: "Are you sure?",
            text: "This will clear all form data!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, reset it!",
            background: "rgba(0,0,0,0.9)",
            color: "#fff"
        }).then(result => {
            if (result.isConfirmed) {
                $("#add-business-form")[0].reset();
                $("#preview").hide();
                Swal.fire({
                    title: "Form Reset!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                    background: "rgba(0,0,0,0.9)",
                    color: "#fff"
                });
            }
        });
    });

// ===== Handle Update Submit =====
$("#edit-business-form").on("submit", async function (e) {
    e.preventDefault();
    const headers = await getAuthHeaders();

    const detailId = $("#editBusinessDetailId").val();
    const businessId = getBusinessIdFromQuery();
    const formData = new FormData();
    formData.append("businessDetailId", detailId);
    formData.append("businessId", businessId);
    formData.append("luxuryLevel", $("#editLuxuryLevel").val());
    formData.append("roomsCount", $("#editRoomsCount").val());
    formData.append("bedsCount", $("#editBedsCount").val());
    formData.append("guestCount", $("#editGuestCount").val());
    formData.append("pricePerDay", $("#editPricePerDay").val());
    formData.append("pricePerNight", $("#editPricePerNight").val());
    formData.append("facilities", $("#editRoomDesc").val());
    formData.append("status", $("#editStatus").val());

    const fileInput = $("#editRoomImage")[0];
    if (fileInput.files.length) {
        formData.append("roomImage", fileInput.files[0]);
    }

    $.ajax({
        method: "PUT",
        url: `${backendUrl}/api/v1/businessDetails/update/${detailId}`,
        headers,
        processData: false,
        contentType: false,
        data: formData,
        success: function () {
            Swal.fire("Updated!", "Business detail updated successfully.", "success");
            $("#Business-edit-modal").modal("hide");
            loadBusinessDetails();
        },
        error: function (xhr) {
            console.error(xhr.responseText);
            Swal.fire("Error", xhr.responseJSON?.message || "Failed to update details.", "error");
        }
    });
});

// ===== Edit Image Preview =====
$("#editRoomImage").on("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
        alert("Upload an image only!");
        $(this).val("");
        $("#editPreview").hide();
        return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
        $("#editPreview").attr("src", event.target.result).show();
    };
    reader.readAsDataURL(file);
});
