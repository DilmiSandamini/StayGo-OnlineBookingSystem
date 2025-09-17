// === Profile picture preview ===
$('#profile-pic').on('change', function () {
    const [file] = this.files;
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            $('#profile-edit-preview').attr('src', e.target.result);
            $('#profile-preview').attr('src', e.target.result);
            $('#user-profile-pic').attr('src', e.target.result);
            localStorage.setItem("profileImage", e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// === Load saved profile picture ===
$(document).ready(function () {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
        $('#profile-preview').attr('src', savedImage);
        $('#profile-edit-preview').attr('src', savedImage);
        $('#user-profile-pic').attr('src', savedImage);
    }
});

// === Helper for auth headers ===
async function getAuthHeaders() {
    const cookie = await cookieStore.get("token");
    const token = cookie?.value;
    return token ? { "Authorization": "Bearer " + token } : {};
}

// === Load personal details from backend ===
$(document).ready(async function () {
    try {
        const headers = await getAuthHeaders();
        const res = await fetch("http://localhost:8080/api/v1/auth/me", { headers });
        if (!res.ok) throw new Error("Failed to fetch user");

        const result = await res.json();
        const user = result.data;

        if (user) {
            $('#full-name').text(user.fullName);
            $('#email').text(user.email);
            $('#username').text(user.username);
            $('#user-name').text(user.username); // top-right dropdown

            // Fill edit inputs
            $('#full-name-input').val(user.fullName);
            $('#email-input').val(user.email);
            $('#username-input').val(user.username);
        }
    } catch (err) {
        console.error("Error loading user details", err);
        Swal.fire('Error', 'Failed to load user details', 'error');
    }
});

// === Toggle to edit mode ===
$('#edit-details-btn').click(function () {
    $('#details-view-mode').hide();
    $('#details-edit-mode').show();
});

// === Cancel edit ===
$('#cancel-edit-btn').click(function () {
    $('#details-edit-mode').hide();
    $('#details-view-mode').show();
});

// === Save changes ===
$('#save-details-btn').click(async function () {
    const headers = await getAuthHeaders();
    const body = {
        fullName: $('#full-name-input').val(),
        email: $('#email-input').val(),
        username: $('#username-input').val()
    };

    try {
        const res = await fetch("http://localhost:8080/api/v1/auth/me", {
            method: "PUT",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error("Failed to update");

        // Update view mode
        $('#full-name').text(body.fullName);
        $('#email').text(body.email);
        $('#username').text(body.username);
        $('#user-name').text(body.username);

        $('#details-edit-mode').hide();
        $('#details-view-mode').show();

        Swal.fire('Success', 'Your details have been updated!', 'success');

    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to update details', 'error');
    }

    
});



