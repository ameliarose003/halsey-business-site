console.log('Role dropdown ES Module loaded!');

const updateRole = (newRole) => {
    const display = document.getElementById('roleDisplay');
    const input = document.getElementById('roleInput');

    if (display) display.textContent = newRole + ' ▼';
    if (input) input.value = newRole;

    console.log('Role updated to:', newRole);
};

const initRoleDropdown = () => {
    console.log('DOM loaded - initializing dropdown');
    const links = document.querySelectorAll('.dropdown-content a[data-role]');

    console.log('Found role links:', links.length);

    if (links.length === 0) {
        console.warn('No dropdown links found - check HTML');
    }

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('ROLE LINK CLICKED:', link.textContent.trim());
            
            const selectedRole = link.dataset.role;
            console.log('Clicked role:', selectedRole);
            
            updateRole(selectedRole);

            link.closest('.dropdown')?.classList.remove('active');
        });
    });
};

document.addEventListener('DOMContentLoaded', initRoleDropdown);