
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('dark');
        themeToggle.textContent = '🌙';
    }
}

themeToggle.addEventListener('click', function () {
    const isDark = document.body.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('visionx-theme', newTheme);
    applyTheme(newTheme);
});


document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('visionx-theme') || 'light';
    applyTheme(savedTheme);
});