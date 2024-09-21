document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('#energy-form');
    const energyLogsContainer = document.querySelector('#energy-logs');
    const chartCanvas = document.querySelector('#usage-chart');
    const totalUsageDisplay = document.querySelector('#total-usage');
    
  
    let energyLogs = [];

    function addEnergyLog(e) {
        e.preventDefault();

       
        const energyType = document.querySelector('#energy-type').value;
        const usageAmount = parseFloat(document.querySelector('#energy-usage').value);
        const timestamp = new Date().toLocaleString();

      
        if (!energyType || isNaN(usageAmount) || usageAmount <= 0) {
            alert('Please enter valid energy type and usage amount.');
            return;
        }

        
        energyLogs.push({ type: energyType, usage: usageAmount, time: timestamp });
        
    
        updateEnergyLogsUI();
        
       
        updateChart();
        
        
        updateTotalUsage();
        
   
        form.reset();
    }

   
    function updateEnergyLogsUI() {
        energyLogsContainer.innerHTML = ''; 

        energyLogs.forEach(log => {
            const logElement = document.createElement('p');
            logElement.textContent = `${log.time}: ${log.type} - ${log.usage} kWh`;
            energyLogsContainer.appendChild(logElement);
        });
    }

    let usageChart = null;
    function updateChart() {
        const usageData = energyLogs.reduce((acc, log) => {
            acc[log.type] = (acc[log.type] || 0) + log.usage;
            return acc;
        }, {});

        const labels = Object.keys(usageData);
        const data = Object.values(usageData);

        
        if (usageChart) {
            usageChart.data.labels = labels;
            usageChart.data.datasets[0].data = data;
            usageChart.update();
        } else {
           
            usageChart = new Chart(chartCanvas, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Energy Usage (kWh)',
                        data: data,
                        backgroundColor: ['#1abc9c', '#3498db', '#f39c12', '#e74c3c'],
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    function updateTotalUsage() {
        const totalUsage = energyLogs.reduce((acc, log) => acc + log.usage, 0);
        totalUsageDisplay.textContent = `Total Energy Usage: ${totalUsage.toFixed(2)} kWh`;
    }

   
    form.addEventListener('submit', addEnergyLog);
});
