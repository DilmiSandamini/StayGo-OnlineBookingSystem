$(document).ready(async function () {
    console.log("Business Dashboard Ready ✅");

    const backendUrl = "http://localhost:8080"; // Backend Base URL

    // ===== Helper: Token & UserID =====
    async function getAuthHeaders() {
        const cookie = await cookieStore.get("token");
        const token = cookie?.value;
        return token ? { Authorization: "Bearer " + token } : {};
    }

    function getUserId() {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("User ID not found. Please log in again.");
            throw new Error("Missing User ID");
        }
        return userId;
    }

    // ===== Load User Businesses =====
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

                    response.data.forEach((b) => {
                        container.append(`
                            <div class="col-md-4 mb-3">
                                <div class="card shadow-sm p-2">
                                    <img src="${backendUrl}${b.businessLogo}" 
                                         alt="Business Logo" 
                                         class="img-fluid mb-2" 
                                         style="max-height:150px; object-fit:contain;">
                                    <h5>${b.businessName}</h5>
                                    <p>${b.businessDescription || "No description provided"}</p>
                                    <p>${b.businessAddress}, ${b.businessAreaPostalCode}</p>
                                    <p>${b.businessEmail} | ${b.contactNumber1}</p>
                                </div>
                            </div>
                        `);
                    });
                },
                error: function (xhr) {
                    console.error("Error fetching user businesses:", xhr.responseText);
                    alert("Failed to load businesses. Please try again.");
                },
            });
        } catch (e) {
            console.error(e.message);
        }
    }

    // ===== Add Business =====
    $("#addBusinessButton").click(async function (e) {
        e.preventDefault();

        try {
            const headers = await getAuthHeaders();
            const userId = getUserId();

            const fileInput = $("#fileElem")[0];
            if (!fileInput.files.length) {
                alert("Please upload a business logo.");
                return;
            }

            const formData = new FormData($("#add-business-form")[0]);
            formData.append("businessStatus", "ACTIVE");
            formData.append("userId", userId);

            $.ajax({
                method: "POST",
                url: `${backendUrl}/api/v1/business/create`,
                headers,
                processData: false,
                contentType: false,
                data: formData,
                success: function (response) {
                    alert(response.message || "Business created!");
                    $("#Business-add-modal").modal("hide");
                    $("#add-business-form")[0].reset();
                    $("#preview").hide();
                    loadAllBusinesses();
                },
                error: function (xhr) {
                    console.error(xhr.responseText);
                    alert(xhr.responseJSON?.message || "Error creating business!");
                },
            });
        } catch (e) {
            console.error(e.message);
        }
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

    // Initial load
    loadAllBusinesses();
});
