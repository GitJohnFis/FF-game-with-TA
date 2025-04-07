const game = document.getElementById('game');

document.getElementById('darkTheme').addEventListener('click', () => {
    game.setAttribute('data-theme', 'dark');
});

document.getElementById('lightTheme').addEventListener('click', () => {
    game.setAttribute('data-theme', 'light');
});

document.getElementById('solarTheme').addEventListener('click', () => {
    game.setAttribute('data-theme', 'solar');
});