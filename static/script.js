$(document).ready(function () {
    console.log("✅ script.js is loaded!");

    // >>>>  PAGINATION START
    let rowsPerPage = parseInt($("#rowsPerPage").val()); // Default rows per page
    let currentPage = 1;
    let totalRows = $("#marksTable tr").length;
    let totalPages = Math.ceil(totalRows / rowsPerPage);

    function showPage(page) {
        let start = (page - 1) * rowsPerPage;
        let end = start + rowsPerPage;

        $("#marksTable tr").hide().slice(start, end).show();
        $("#pageInfo").text(`Page ${page} of ${totalPages}`);

        $("#prevPage").prop("disabled", page === 1);
        $("#nextPage").prop("disabled", page === totalPages);
    }

    $("#prevPage").click(function () {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
        }
    });

    $("#nextPage").click(function () {
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
        }
    });

    // Change number of rows per page dynamically
    $("#rowsPerPage").change(function () {
        rowsPerPage = parseInt($(this).val());
        totalPages = Math.ceil(totalRows / rowsPerPage);
        currentPage = 1; // Reset to first page after changing
        showPage(currentPage);
    });

    showPage(currentPage); // Show the first page initially

    // >>>>  PAGINATION END

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

    // ✅ Show Add Mark Modal
    $("#showAddModal").click(function() {
        // Clear any previous values
        $("#addName").val('');
        $("#addSubject").val('');
        $("#addYear").val('');
        $("#addSem").val('');
        $("#addMarks").val('');
        
        // Show the modal
        $("#addMarkModal").fadeIn();
    });

    // ✅ Cancel Add Mark
    $("#cancelAddMark").click(function() {
        $("#addMarkModal").fadeOut();
    });

    // ✅ Handle Add Mark Submission
    $("#submitAddMark").click(function() {
        // Get values from the form
        let name = $("#addName").val().trim();
        let subject = $("#addSubject").val().trim();
        let year = $("#addYear").val().trim();
        let sem = $("#addSem").val().trim();
        let marks = $("#addMarks").val().trim();

        // Validate inputs
        if (!name || !subject || !year || !sem || !marks) {
            showToast("⚠️ Please fill all fields!", "error");
            return;
        }

        // Submit data to server
        $.ajax({
            url: "/add_mark",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ name, subject, year, sem, marks }),
            success: function(response) {
                console.log("✅ Record added successfully!", response);
                
                // Create a new row in the table
                let newRow = `<tr data-id="${response.id}">
                    <td>${name}</td>
                    <td>${subject}</td>
                    <td>${year}</td>
                    <td>${sem}</td>
                    <td>${marks}</td>
                    <td>
                        <button class="custom-btn edit-btn">Edit</button>
                        <button class="custom-btn delete-btn">Delete</button>
                    </td>
                </tr>`;
                
                $("#marksTable").append(newRow);
                
                // Update pagination as we've added a new row
                totalRows = $("#marksTable tr").length;
                totalPages = Math.ceil(totalRows / rowsPerPage);
                showPage(currentPage);
                
                // Close the modal and show success message
                $("#addMarkModal").fadeOut();
                showToast("✅ Record added successfully!");
            },
            error: function(xhr, status, error) {
                console.log("❌ AJAX Error:", error);
                showToast("⚠️ Failed to add record!", "error");
            }
        });
    });

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
                showToast("⚠️ Incorrect email or password. Please try again.");
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
                showToast("Registration failed. Try again.");
            }
        });
    });

    // ✅ Edit Record (AJAX)
    let editRow = null; // Store the row being edited

    // Handle "Edit" button click
    // Handle "Edit" button click
$(document).on("click", ".edit-btn", function () {
    editRow = $(this).closest("tr");

    let id = editRow.attr("data-id") || ""; // Handle null values
    let name = editRow.find("td:eq(0)").text().trim() || "";
    let subject = editRow.find("td:eq(1)").text().trim() || "";
    let year = editRow.find("td:eq(2)").text().trim() || "";
    let sem = editRow.find("td:eq(3)").text().trim() || "";
    let marks = editRow.find("td:eq(4)").text().trim() || "";

    // Pre-fill modal fields with safe values
    $("#editRecordId").val(id);
    $("#editName").val(name);
    $("#editSubject").val(subject);
    $("#editYear").val(year);
    $("#editSem").val(sem);
    $("#editMarks").val(marks);

    $("#editModal").fadeIn(); // Show the modal
});


    document.getElementById("searchInput").addEventListener("keyup", function () {
        let filter = this.value.toLowerCase();
        let rows = document.querySelectorAll("#marksTable tr");

        rows.forEach(row => {
            let text = row.textContent.toLowerCase();
            row.style.display = text.includes(filter) ? "" : "none";
        });
    });

    // Handle "Save" button inside the modal
    $("#saveEdit").click(function () {
        let id = $("#editRecordId").val();
        let name = $("#editName").val().trim();
        let subject = $("#editSubject").val().trim();
        let year = $("#editYear").val().trim();
        let sem = $("#editSem").val().trim();
        let marks = $("#editMarks").val().trim();

        if (!name || !subject || !year || !sem || !marks) {
            showToast("⚠️ Fields cannot be empty!", "error");
            return; // Stop further execution
        }

        $.ajax({
            url: `/edit_mark/${id}`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ name, subject, year, sem, marks }),
            success: function (response) {
                console.log("✅ Record updated successfully!", response);
                showToast("✅ Record updated!");

                // Update the table row with new values
                editRow.find("td:eq(0)").text(name);
                editRow.find("td:eq(1)").text(subject);
                editRow.find("td:eq(2)").text(year);
                editRow.find("td:eq(3)").text(sem);
                editRow.find("td:eq(4)").text(marks);

                $("#editModal").fadeOut(); // Close the modal
            },
            error: function (xhr, status, error) {
                console.log("❌ AJAX Error:", xhr.responseText);
                showToast("⚠️ Failed to update record!", "error");
            }
        });
    });

    // Handle "Cancel" button inside the modal
    $("#cancelEdit").click(function () {
        $("#editModal").fadeOut(); // Hide the modal
    });

    // ✅ Delete Record (AJAX)
    let deleteRow = null;

    $(document).on("click", ".delete-btn", function () {
        deleteRow = $(this).closest("tr"); // Store the row to be deleted
        $("#deleteConfirmModal").fadeIn(); // Show the modal
    });

    // Confirm Delete
    $("#confirmDelete").click(function () {
        if (deleteRow) {
            let id = deleteRow.attr("data-id");

            if (!id) {
                deleteRow.remove();
                showToast("✅ Row removed!");
            } else {
                $.ajax({
                    url: `/delete_mark/${id}`,
                    method: "DELETE",
                    success: function (response) {
                        console.log("✅ Record deleted successfully!", response);
                        deleteRow.remove();
                        showToast("✅ Record deleted!");
                        
                        // Update pagination as we've removed a row
                        totalRows = $("#marksTable tr").length;
                        totalPages = Math.ceil(totalRows / rowsPerPage);
                        if (currentPage > totalPages) {
                            currentPage = totalPages || 1;
                        }
                        showPage(currentPage);
                    },
                    error: function (xhr, status, error) {
                        console.log("❌ AJAX Error:", xhr.responseText);
                        showToast("⚠️ Failed to delete record!", "error");
                    }
                });
            }
        }
        $("#deleteConfirmModal").fadeOut(); // Hide the modal
    });

    // Cancel Delete
    $("#cancelDelete").click(function () {
        $("#deleteConfirmModal").fadeOut(); // Hide the modal
    });

    // ✅ Sorting logic
    let sortDirections = {}; // Store sorting direction for each column

    $(".sortable").click(function () {
        let columnIndex = $(this).index(); // Get the index of the clicked column
        let isNumeric = columnIndex >= 2 && columnIndex <= 4; // Check if column is numeric (Year, Semester, Marks)

        // Toggle sorting direction for the clicked column
        sortDirections[columnIndex] = !sortDirections[columnIndex];

        let rows = $("#marksTable tr").get();

        rows.sort(function (a, b) {
            let cellA = $(a).find(`td:eq(${columnIndex})`).text().trim();
            let cellB = $(b).find(`td:eq(${columnIndex})`).text().trim();

            if (isNumeric) {
                return sortDirections[columnIndex] ? cellA - cellB : cellB - cellA;
            } else {
                return sortDirections[columnIndex]
                    ? cellA.localeCompare(cellB)
                    : cellB.localeCompare(cellA);
            }
        });

        // Update sorting icon
        $(".sortable").each(function () {
            $(this).html($(this).text().replace(/⬍|⬏/, "⬍")); // Reset icons
        });

        let sortIcon = sortDirections[columnIndex] ? "⬏" : "⬍";
        $(this).html($(this).text().replace("⬍", sortIcon));

        // Append sorted rows
        $.each(rows, function (index, row) {
            $("#marksTable").append(row);
        });
        
        // Maintain current page after sorting
        showPage(currentPage);
    });
});
