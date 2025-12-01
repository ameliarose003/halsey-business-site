document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const button = dropdown.querySelector('.dropbtn');
        button.addEventListener('click', (e) => {
            e.stopPropagation();

            // Auto close all dropdowns when page loads
            document.querySelectorAll('.dropdown.active')
                .forEach(d => d !== dropdown && d.classList.remove('active'));

            dropdown.classList.toggle('active');
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown.active')
            .forEach(d => d.classList.remove('active'));
    })
});
