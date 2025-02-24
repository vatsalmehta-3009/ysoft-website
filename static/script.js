$(document).ready(function () {
    console.log("✅ script.js is loaded!");

    // Function to show toast messages
    function showToast(message, type = "success") {
        let toast = $(`
            <div class="toast-message ${type}">
                <span>${message}</span>
                <button class="close-toast">&times;</button>
            </div>
        `);

        $("#toast-container").append(toast);

        // Auto-close after 5 seconds
        setTimeout(() => toast.fadeOut(400, function () { $(this).remove(); }), 5000);

        // Close button functionality
        toast.find(".close-toast").click(function () {
            toast.fadeOut(400, function () { $(this).remove(); });
        });
    }

    $("#login-form").submit(function (event) {
        event.preventDefault();

        let email = $("#email").val().trim();
        let password = $("#password").val().trim();

        $.ajax({
            url: "/login",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ email, password }),
            success: function (response) {
                console.log("✅ Login successful!", response);
                window.location.href = "/";  // Redirect to home
            },
            error: function (xhr) {
                console.log("❌ Login failed:", xhr.responseText);
                alert("⚠️ Incorrect email or password. Please try again.");
            }
        });
    });

    // ✅ Handle registration form submission
    $("#register-form").submit(function (event) {
        event.preventDefault();

        $.ajax({
            url: "/register",
            type: "POST",
            data: $(this).serialize(),
            success: function (response) {
                window.location.href = "/login";
            },
            error: function () {
                alert("Registration failed. Try again.");
            }
        });
    });

    // ✅ Debugging "Add New Mark" button
    $("#addRow").click(function () {
        console.log("➡️ Add New Mark button clicked");

        let newRow = `<tr>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td>
                <button class="custom-btn add-btn">Add</button>
                <button class="custom-btn delete-btn">Delete</button>
            </td>
        </tr>`;

        $("#marksTable").append(newRow);
    });

    // ✅ Handle "Add" button click inside the new row
    $(document).on("click", ".add-btn", function () {
        console.log("➡️ Add button clicked inside table row!");

        let row = $(this).closest("tr");
        let name = row.find("td:eq(0)").text().trim();
        let subject = row.find("td:eq(1)").text().trim();
        let year = row.find("td:eq(2)").text().trim();
        let sem = row.find("td:eq(3)").text().trim();
        let marks = row.find("td:eq(4)").text().trim();

        if (!name || !subject || !year || !sem || !marks) {
            showToast("⚠️ Please fill all fields for adding records!", "error");
            return;
        }

        $.ajax({
            url: "/add_mark",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ name, subject, year, sem, marks }),
            success: function (response) {
                console.log("✅ Record added successfully!", response);
                row.attr("data-id", response.id);
                row.find(".add-btn").removeClass("add-btn btn-success")
                    .addClass("save-btn btn-primary")
                    .text("Save");
                alert("✅ Record added successfully!");
            },
            error: function (xhr, status, error) {
                console.log("❌ AJAX Error:", error);
                alert("⚠️ Failed to add record!");
            }
        });
    });

    // ✅ Edit Record (AJAX)
    $(document).on("click", ".save-btn", function () {
        console.log("➡️ Save button clicked!");

        let row = $(this).closest("tr");
        let id = row.attr("data-id");
        let name = row.find("td:eq(0)").text().trim();
        let subject = row.find("td:eq(1)").text().trim();
        let year = row.find("td:eq(2)").text().trim();
        let sem = row.find("td:eq(3)").text().trim();
        let marks = row.find("td:eq(4)").text().trim();

        if (!id) {
            showToast("⚠️ Error: Record ID is missing!", "error");
            return;
        }

        $.ajax({
            url: `/edit_mark/${id}`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ name, subject, year, sem, marks }),
            success: function (response) {
                console.log("✅ Record updated successfully!", response);
                alert("✅ Record updated!");
            },
            error: function (xhr, status, error) {
                console.log("❌ AJAX Error:", xhr.responseText);
                alert("⚠️ Failed to update record!");
            }
        });
    });

    // ✅ Delete Record (AJAX)
    $(document).on("click", ".delete-btn", function () {
        console.log("➡️ Delete button clicked!");

        let row = $(this).closest("tr");
        let id = row.attr("data-id");

        if (!id) {
            row.remove();
            showToast("✅ Row removed!");
            return;
        }

        $.ajax({
            url: `/delete_mark/${id}`,
            method: "DELETE",
            success: function (response) {
                console.log("✅ Record deleted successfully!", response);
                row.remove();
                showToast("✅ Record deleted!");
            },
            error: function (xhr, status, error) {
                console.log("❌ AJAX Error:", xhr.responseText);
                alert("⚠️ Failed to delete record!");
            }
        });
    });

    let sortAscending = true; // Track sorting direction

    // ✅ Sorting logic
    $("#sortMarks").click(function () {
        let rows = $("#marksTable tr").get();

        rows.sort(function (a, b) {
            let markA = parseInt($(a).find("td:eq(4)").text().trim(), 10) || 0;
            let markB = parseInt($(b).find("td:eq(4)").text().trim(), 10) || 0;

            return sortAscending ? markA - markB : markB - markA;
        });

        sortAscending = !sortAscending; // Toggle sort direction

        // ✅ Append sorted rows
        $.each(rows, function (index, row) {
            $("#marksTable").append(row);
        });

        // ✅ Update sorting icon
        let sortIcon = sortAscending ? "⬍" : "⬏";
        $("#sortMarks").html(`Marks ${sortIcon}`);

        console.log(`✅ Sorted Marks Column in ${sortAscending ? "Ascending" : "Descending"} Order`);
    });

});
