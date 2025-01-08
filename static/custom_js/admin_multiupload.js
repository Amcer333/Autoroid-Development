document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("input[type='file']").forEach(input => {
        input.setAttribute("multiple", "multiple");
    });
});
