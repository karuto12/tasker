// Function to confirm task removal with fade-out animation
async function confirmRemoval(event, link) {
    event.preventDefault();

    if (confirm("Are you sure you want to remove this task?")) {
        const taskElement = link.closest(".tasks");
        const taskId = link.href.split("/").pop(); // Extract task ID from the link

        // Send an AJAX request to remove the task
        try {
            const response = await fetch(`/user/remove/${taskId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Fade out and remove the task element
                taskElement.classList.add("fade-out");
                setTimeout(() => {
                    taskElement.remove();
                }, 300); // Wait for fade-out animation to finish
            } else {
                alert("Failed to remove the task. Please try again.");
            }
        } catch (error) {
            console.error("Error removing task:", error);
            alert("An error occurred. Please try again.");
        }
    }
}
