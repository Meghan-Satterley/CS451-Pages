// Function to create the budget tracking pie chart
function createBudgetPieChart() {
    var ctxP = document.getElementById('myPieChart').getContext('2d');
    window.myPieChart = new Chart(ctxP, {
        type: 'pie',
        data: {
            labels: ["Rent/Mortgage", "Utilities", "Groceries", "Misc", "Savings", "Investing"],
            datasets: [{
                data: [800, 150, 300, 150, 200, 100],
                backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360", "#FFA07A"],
                hoverOffset: 4
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: getThemeColor()
                    }
                }
            }
        }
    });
}

// Function to create the actual amount spent line chart
function createSpendingLineChart() {

    var ctxL = document.getElementById('myLineChart').getContext('2d');
    window.myLineChart = new Chart(ctxL, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                label: 'Actual Spending',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                data: [200, 300, 250, 400, 450, 500, 550, 600, 650, 700, 750, 800],
                fill: true,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: getThemeColor()
                    },
                    ticks: {
                        color: getThemeColor()
                    },
                },
                x: {
                    grid: {
                        color: getThemeColor()
                    },
                    ticks: {
                        color: getThemeColor()
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: getThemeColor()
                    }
                }
            }
        }
    });
}

// Helper function to get the theme color for chart labels and grid lines
function getThemeColor() {
    return localStorage.getItem('theme') === 'light' ? "black" : "white";
}

// Call the functions to create the charts
createBudgetPieChart();
createSpendingLineChart();
function updateChartsForCurrentTheme() {
    if (window.myPieChart && typeof window.myPieChart.destroy === 'function') {
        window.myPieChart.destroy();
    }
    if (window.myLineChart && typeof window.myLineChart.destroy === 'function') {
        window.myLineChart.destroy();
    }

    createBudgetPieChart(); // Recreates the pie chart
    createSpendingLineChart(); // Recreates the line chart
}
