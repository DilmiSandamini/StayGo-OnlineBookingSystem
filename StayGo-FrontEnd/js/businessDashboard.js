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
                                <img src="${b.businessLogo ? backendUrl + '/' + b.businessLogo : '/images/default-logo.png'}" class="card-img-top" style="height:200px; object-fit:cover;">
                                <div class="card-body">
                                    <h5>${b.businessName}</h5>
                                    <p>${b.businessDescription || "No description provided"}</p>
                                    <p>${b.businessAddress}, ${b.businessAreaPostalCode || ""}</p>
                                    <p>${b.businessEmail} | ${b.contactNumber1}</p>
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

    // ===== Image Preview =====
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

$(document).on("click", ".business-card", function() {
    const businessId = $(this).data("id");
    if (!businessId) return;

    // Redirect with businessId in query params
    window.location.href = `/pages/businessDetailDashborad.html?businessId=${businessId}`;
});