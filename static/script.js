$(document).ready(function() {
    console.log("✅ script.js is loaded!");

    // Handle registration form submission (existing code)
    $("#register-form").submit(function(event) {
        event.preventDefault();

        $.ajax({
            url: "/register",
            type: "POST",
            data: $(this).serialize(),
            success: function(response) {
                window.location.href = "/login";
            },
            error: function() {
                alert("Registration failed. Try again.");
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
                <button class="btn btn-success btn-sm add-btn">Add</button>
                <button class="btn btn-danger btn-sm delete-btn">Delete</button>
            </td>
        </tr>`;

        $("#marksTable").append(newRow);
        console.log("✅ New row added to table!");
    });

    // ✅ Handle "Add" button click inside the new row
    $(document).on("click", ".add-btn", function() {
        console.log("➡️ Add button clicked inside table row!");

        let row = $(this).closest("tr");
        let name = row.find("td:eq(0)").text().trim();
        let subject = row.find("td:eq(1)").text().trim();
        let year = row.find("td:eq(2)").text().trim();
        let sem = row.find("td:eq(3)").text().trim();
        let marks = row.find("td:eq(4)").text().trim();

        if (!name || !subject || !year || !sem || !marks) {
            alert("⚠️ Please fill all fields before adding!");
            return;
        }

        console.log("📤 Sending AJAX request to /add_mark");
        $.ajax({
            url: "/add_mark",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ name, subject, year, sem, marks }),
            success: function(response) {
                console.log("✅ Record added successfully!", response);
                row.attr("data-id", response.id);
                row.find(".add-btn").removeClass("add-btn btn-success")
                                   .addClass("save-btn btn-primary")
                                   .text("Save");
                alert("✅ Record added successfully!");
            },
            error: function(xhr, status, error) {
                console.log("❌ AJAX Error:", error);
                alert("⚠️ Failed to add record!");
            }
        });
    });

    // ✅ Edit Record (AJAX)
    $(document).on("click", ".save-btn", function() {
        console.log("➡️ Save button clicked!");

        let row = $(this).closest("tr");
        let id = row.attr("data-id");
        let name = row.find("td:eq(0)").text().trim();
        let subject = row.find("td:eq(1)").text().trim();
        let year = row.find("td:eq(2)").text().trim();
        let sem = row.find("td:eq(3)").text().trim();
        let marks = row.find("td:eq(4)").text().trim();

        if (!id) {
            alert("⚠️ Error: Record ID is missing!");
            return;
        }

        console.log("📤 Sending AJAX request to update /edit_mark/" + id);
        $.ajax({
            url: `/edit_mark/${id}`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ name, subject, year, sem, marks }),
            success: function(response) {
                console.log("✅ Record updated successfully!", response);
                alert("✅ Record updated!");
            },
            error: function(xhr, status, error) {
                console.log("❌ AJAX Error:", xhr.responseText);
                alert("⚠️ Failed to update record!");
            }
        });
    });

    // ✅ Delete Record (AJAX)
    $(document).on("click", ".delete-btn", function() {
        console.log("➡️ Delete button clicked!");

        let row = $(this).closest("tr");
        let id = row.attr("data-id");

        if (!id) {
            row.remove();  // Remove unsaved rows without ID
            return;
        }

        console.log("📤 Sending AJAX request to delete /delete_mark/" + id);
        $.ajax({
            url: `/delete_mark/${id}`,
            method: "DELETE",
            success: function(response) {
                console.log("✅ Record deleted successfully!", response);
                row.remove();
                alert("✅ Record deleted!");
            },
            error: function(xhr, status, error) {
                console.log("❌ AJAX Error:", xhr.responseText);
                alert("⚠️ Failed to delete record!");
            }
        });
    });

    let sortAscending = true; // Track sorting direction

    // ✅ Sorting logic
    $("#sortMarks").click(function() {
        let rows = $("#marksTable tr").get();

        rows.sort(function(a, b) {
            let markA = parseInt($(a).find("td:eq(4)").text().trim(), 10) || 0;
            let markB = parseInt($(b).find("td:eq(4)").text().trim(), 10) || 0;

            return sortAscending ? markA - markB : markB - markA;
        });

        sortAscending = !sortAscending; // Toggle sort direction

        // ✅ Append sorted rows
        $.each(rows, function(index, row) {
            $("#marksTable").append(row);
        });

        // ✅ Update sorting icon
        let sortIcon = sortAscending ? "⬍" : "⬏";
        $("#sortMarks").html(`Marks ${sortIcon}`);

        console.log(`✅ Sorted Marks Column in ${sortAscending ? "Ascending" : "Descending"} Order`);
    });

    // ✅ Add New Row at the Top
    $("#addRow").click(function() {
        console.log("➡️ Add New Mark button clicked");

        let newRow = `<tr>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td>
                <button class="btn btn-success btn-sm add-btn">Add</button>
                <button class="btn btn-danger btn-sm delete-btn">Delete</button>
            </td>
        </tr>`;

        $("#marksTable").prepend(newRow);
        console.log("✅ New row added to the top of the table!");
    });

});
