$(document).ready(function() {
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
        setTimeout(() => toast.fadeOut(400, function() { $(this).remove(); }), 5000);

        // Close button functionality
        toast.find(".close-toast").click(function() {
            toast.fadeOut(400, function() { $(this).remove(); });
        });
    }

    // ✅ Handle registration form submission
    $("#register-form").submit(function(event) {
        event.preventDefault();

        $.ajax({
            url: "/register",
            type: "POST",
            data: $(this).serialize(),
            success: function(response) {
                showToast("✅ Registration successful! Redirecting to login...");
                setTimeout(() => window.location.href = "/login", 2000);
            },
            error: function() {
                showToast("⚠️ Registration failed. Try again.", "error");
            }
        });
    });

    // ✅ Debugging "Add New Mark" button
    $("#addRow").click(function() {
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
    $(document).on("click", ".add-btn", function() {
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
            success: function(response) {
                row.attr("data-id", response.id);
                row.find(".add-btn").removeClass("add-btn").addClass("save-btn").text("Save");
                showToast("✅ New record added successfully !");
            },
            error: function() {
                showToast("⚠️ Failed to add record!", "error");
            }
        });
    });

    // ✅ Save Record (AJAX)
    $(document).on("click", ".save-btn", function() {
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
            success: function() {
                showToast("✅ Record updated successfully!");
            },
            error: function() {
                showToast("⚠️ Failed to update record!", "error");
            }
        });
    });

    // ✅ Delete Record (AJAX)
    $(document).on("click", ".delete-btn", function() {
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
            success: function() {
                row.remove();
                showToast("✅ Record deleted!");
            },
            error: function() {
                showToast("⚠️ Failed to delete record!", "error");
            }
        });
    });

});
