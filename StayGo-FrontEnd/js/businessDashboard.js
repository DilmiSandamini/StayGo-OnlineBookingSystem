$(document).ready(async function () {
    console.log("Business Dashboard Ready ✅");

    const backendUrl = "http://localhost:8080";

    async function getAuthHeaders() {
        const cookie = await cookieStore.get("token");
        const token = cookie?.value;
        return token ? { Authorization: "Bearer " + token } : {};
    }

    function getUserId() {
        const userId = sessionStorage.getItem("userId");
        if (!userId) throw new Error("Missing User ID");
        return userId;
    }

    // ===== Load all businesses =====
    async function loadAllBusinesses() {
        try {
            const userId = getUserId();
            const headers = await getAuthHeaders();

            $.ajax({
                method: "GET",
                url: `${backendUrl}/api/v1/business/getAllThisUserBusinesses`,
                headers,
                data: { userId },
                success: function (response) {
                    const container = $("#business-list").empty();

                    if (!response.data || response.data.length === 0) {
                        container.append(`<p class="text-muted">No businesses found.</p>`);
                        return;
                    }

                    response.data.forEach(b => {
                        container.append(`
                            <div class="col-md-4 mb-3">
                                <div class="card shadow-sm p-2 business-card" data-id="${b.businessId}" style="cursor:pointer;">
                                    <img src="${b.businessLogo ? backendUrl + '/' + b.businessLogo : '/images/default-logo.png'}" 
                                         class="card-img-top business-logo" style="height:200px; object-fit:cover;">
                                    <div class="position-absolute p-2 top-0 end-0 m-2 d-flex gap-2">
                                        <button class="btn btn-sm btn-primary edit-business" data-id="${b.businessId}" title="Edit">
                                            <i class="bi bi-pencil-square"></i>
                                        </button>
                                        <button class="btn btn-sm btn-danger delete-business" data-id="${b.businessId}" title="Delete">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                    <div class="card-body">
                                        <h5 class="business-name">${b.businessName}</h5>
                                        <p class="business-desc">${b.businessDescription || "No description provided"}</p>
                                        <p class="business-address">${b.businessAddress}, ${b.businessAreaPostalCode || ""}</p>
                                        <p class="business-email">${b.businessEmail} | ${b.contactNumber1}</p>
                                        <div class="d-flex">
                                            <h3 class="badge w-50 p-3 bg-${b.businessStatus === 'ACTIVE' ? 'success' : 'danger'} business-status">
                                                ${b.businessStatus}
                                            </h3>
                                            <button class="btn btn-primary w-50 mt-2 m-lg-2 p-2 view-details">View Details</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `);
                    });
                },
                error: function(xhr) {
                    console.error(xhr.responseText);
                    Swal.fire("Error", "Failed to load businesses.", "error");
                }
            });
        } catch (e) {
            console.error(e.message);
        }
    }

    // ===== Add Business =====
    $("#add-business-form").on("submit", async function (e) {
        e.preventDefault();

        try {
            const headers = await getAuthHeaders();
            const userId = getUserId();
            const fileInput = $("#fileElem")[0];

            if (!fileInput.files.length) {
                alert("Please upload a business logo.");
                return;
            }

            const formData = new FormData();
            formData.append("businessName", $("#business-name").val());
            formData.append("contactNumber1", $("#business-contact1").val());
            formData.append("contactNumber2", $("#business-contact2").val());
            formData.append("businessEmail", $("#business-email").val());
            formData.append("businessAddress", $("#business-address").val());
            formData.append("businessCategory", $("#business-category").val());
            formData.append("businessDescription", $("#business-description").val());
            formData.append("businessStatus", "ACTIVE");
            formData.append("userId", userId);
            formData.append("logo", fileInput.files[0]);

            $.ajax({
                method: "POST",
                url: `${backendUrl}/api/v1/business/create`,
                headers,
                processData: false,
                contentType: false,
                data: formData,
                success: function(response) {
                    Swal.fire("Success!", response.message || "Business created!", "success");
                    $("#Business-add-modal").modal("hide");
                    $("#add-business-form")[0].reset();
                    $("#preview").hide();
                    loadAllBusinesses();
                },
                error: function(xhr) {
                    console.error(xhr.responseText);
                    Swal.fire("Error", xhr.responseJSON?.message || "Error creating business!", "error");
                }
            });

        } catch (e) {
            console.error(e.message);
        }
    });

// ===== Edit Business (open modal and fill form) =====
$(document).on("click", ".edit-business", function () {
    const card = $(this).closest(".business-card");
    const businessId = card.data("id");

    const emailAndPhone = card.find(".business-email").text().split("|");
    const email = emailAndPhone[0]?.trim() || "";
    const contact1 = emailAndPhone[1]?.trim() || "";

    $("#edit-business-id").val(businessId);
    $("#edit-business-name").val(card.find(".business-name").text().trim());
    $("#edit-business-description").val(card.find(".business-desc").text().trim());
    $("#edit-business-address").val(card.find(".business-address").text().trim());
    $("#edit-business-email").val(email);
    $("#edit-business-contact1").val(contact1);

    $("#Business-edit-modal").modal("show");
    $("#edit-fileElem").val("");
});

// ===== Save Business Update =====
$("#edit-business-form").on("submit", async function (e) {
    e.preventDefault();

    try {
        const headers = await getAuthHeaders();
        const businessId = $("#edit-business-id").val();
        const card = $(`.business-card[data-id='${businessId}']`);

        const formData = new FormData();
        formData.append("businessId", businessId);
        formData.append("businessName", $("#edit-business-name").val());
        formData.append("businessDescription", $("#edit-business-description").val());
        formData.append("businessAddress", $("#edit-business-address").val());
        formData.append("businessEmail", $("#edit-business-email").val());
        formData.append("contactNumber1", $("#edit-business-contact1").val());

        const fileInput = $("#edit-fileElem")[0];
        if (fileInput.files.length > 0) {
            formData.append("logo", fileInput.files[0]);
        }

        $.ajax({
            method: "PUT",
            url: `${backendUrl}/api/v1/business/update/${businessId}`,
            headers,
            processData: false,
            contentType: false,
            data: formData,
            success: function (response) {
                Swal.fire("Updated!", response.message || "Business updated successfully!", "success");
                $("#Business-edit-modal").modal("hide");

                // Update DOM card
                card.find(".business-name").text($("#edit-business-name").val());
                card.find(".business-desc").text($("#edit-business-description").val());
                card.find(".business-address").text($("#edit-business-address").val());
                card.find(".business-email").text(
                    `${$("#edit-business-email").val()} | ${$("#edit-business-contact1").val()} | ${$("#edit-business-contact2").val()}`
                );

                if (fileInput.files.length > 0) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        card.find(".business-logo").attr("src", e.target.result);
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                }
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                Swal.fire("Error", xhr.responseJSON?.message || "Error updating business!", "error");
            },
        });
    } catch (e) {
        console.error(e.message);
    }
});

// ===== Deactivate Business =====
$(document).on("click", ".delete-business", async function () {
    const businessId = $(this).data("id");
    const card = $(this).closest(".business-card");
    const headers = await getAuthHeaders();

    Swal.fire({
        title: "Are you sure?",
        text: "This will deactivate the business!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, deactivate it!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method: "PUT",
                url: `${backendUrl}/api/v1/business/deactivate/${businessId}`,
                headers,
                success: function (response) {
                    Swal.fire("Deactivated!", response.message || "Business deactivated successfully.", "success");

                    // Update status badge in UI
                    card.find(".business-status")
                        .removeClass("bg-success")
                        .addClass("bg-danger")
                        .text("INACTIVE");
                },
                error: function (xhr) {
                    console.error(xhr.responseText);
                    Swal.fire("Error", xhr.responseJSON?.message || "Failed to deactivate business.", "error");
                }
            });
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

    // ===== Image Preview (Add) =====
    const dropArea = document.getElementById("drop-area");
    const fileInputElem = document.getElementById("fileElem");
    const preview = document.getElementById("preview");

    dropArea.addEventListener("click", () => fileInputElem.click());
    fileInputElem.addEventListener("change", handleFiles);

    function handleFiles(e) {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            alert("Upload an image only!");
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            preview.src = event.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }

    // ===== Initial Load =====
    loadAllBusinesses();
});

// ===== View Details button click =====
$(document).on("click", ".business-card .view-details", function(e) {
    e.stopPropagation();
    const businessId = $(this).closest(".business-card").data("id");
    if (!businessId) return;
    window.location.href = `/pages/businessDetailDashborad.html?businessId=${businessId}`;
});
