// Collapsible functionality for Projects and Research sections
document.addEventListener("DOMContentLoaded", function() {
    const collabs = document.querySelectorAll('.collapsible-header');
    collabs.forEach((collapsible) => {
        collapsible.addEventListener('click', function() {
            this.classList.toggle("active");
            let content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    });
});
