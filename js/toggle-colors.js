/*!
* Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
* Copyright 2011-2023 The Bootstrap Authors
* Licensed under the Creative Commons Attribution 3.0 Unported License.
*/
(() => {
    'use strict'; // Enforce strict mode

    // Retrieve the currently stored theme from local storage
    const getStoredTheme = () => localStorage.getItem('theme');
    // Store the selected theme in local storage
    const setStoredTheme = theme => localStorage.setItem('theme', theme);

    // Determine the preferred theme based on stored theme or system preference
    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme();
        if (storedTheme) {
            return storedTheme; // Return the stored theme if available
        }
        // Return 'dark' or 'light' based on system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // Apply the theme to the document
    const setTheme = theme => {
        if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // If theme is 'auto' and system prefers dark, set to dark
            document.documentElement.setAttribute('data-bs-theme', 'dark');
        } else {
            // Otherwise, apply the specified theme directly
            document.documentElement.setAttribute('data-bs-theme', theme);
        }
    };

    // Initialize the theme based on preference
    setTheme(getPreferredTheme());

    // Update the UI to reflect the active theme
    const showActiveTheme = (theme, focus = false) => {
        const themeSwitcher = document.querySelector('#bd-theme'); // Find the theme switcher element
        if (!themeSwitcher) {
            return; // Exit if theme switcher is not found
        }
        // Additional UI updates for showing the active theme
        const themeSwitcherText = document.querySelector('#bd-theme-text');
        const activeThemeIcon = document.querySelector('.theme-icon-active use');
        const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`);
        const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href');

        // Deactivate all theme buttons and activate the selected one
        document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
            element.classList.remove('active');
            element.setAttribute('aria-pressed', 'false');
        });
        btnToActive.classList.add('active');
        btnToActive.setAttribute('aria-pressed', 'true');
        activeThemeIcon.setAttribute('href', svgOfActiveBtn);

        // Update the aria-label to reflect the active theme
        const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`;
        themeSwitcher.setAttribute('aria-label', themeSwitcherLabel);
        if (focus) {
            themeSwitcher.focus(); // Focus the theme switcher if required
        }
    };

    // Listen for system theme changes and update theme accordingly
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const storedTheme = getStoredTheme();
        if (storedTheme !== 'light' && storedTheme !== 'dark') {
            setTheme(getPreferredTheme());
        }
    });

    // Once the document is ready, show the active theme and setup theme switcher buttons
    window.addEventListener('DOMContentLoaded', () => {
        showActiveTheme(getPreferredTheme());
        // Setup click event listeners for theme switcher buttons
        document.querySelectorAll('[data-bs-theme-value]')
            .forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const theme = toggle.getAttribute('data-bs-theme-value');
                    setStoredTheme(theme); // Update the stored theme
                    setTheme(theme); // Apply the selected theme
                    showActiveTheme(theme, true); // Update the UI
                    updateChartsForCurrentTheme();
                });
            });
    });
})();