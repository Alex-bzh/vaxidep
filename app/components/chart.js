// chart.js
app.component('chart', {
    template: `<canvas id="chart" height="300"></canvas>`,
    props: {
        metrics: Object
    },
    updated() {
        /*
        *   Remove the obsolete chart.
        *   main.js triggers the creation of a new one.
        */
        this.removeChart();
    },
    methods: {
        /*
        *   Initializes a chart
        */
        initChart() {
            // A new array to save the data with only two decimal.
            let rate_dose1_decimal = Array();
            let rate_complet_decimal = Array();
            this.metrics.rate_dose1.forEach(
                element => rate_dose1_decimal.push(element.toFixed(2))
                );
            this.metrics.rate_complet.forEach(
                element => rate_complet_decimal.push(element.toFixed(2))
                );
            var datasets = [
                {
                    label: 'Taux 1 injection (en %)',
                    backgroundColor: [
                        'hsl(180, 100%, 45%)',
                        'hsl(180, 100%, 65%)',
                        'hsl(180, 100%, 60%)',
                        'hsl(180, 100%, 55%)',
                        'hsl(180, 100%, 50%)',
                        'hsl(180, 100%, 45%)',
                        'hsl(180, 100%, 40%)',
                        'hsl(180, 100%, 35%)',
                        'hsl(180, 100%, 30%)',
                        'hsl(180, 100%, 25%)',
                        'hsl(180, 100%, 20%)'
                    ],
                    data: rate_dose1_decimal
                },
                {
                    label: 'Taux vaccinés (en %)',
                    backgroundColor: [
                        'hsl(21, 86%, 33%)',
                        'hsl(21, 86%, 75%)',
                        'hsl(21, 86%, 70%)',
                        'hsl(21, 86%, 65%)',
                        'hsl(21, 86%, 60%)',
                        'hsl(21, 86%, 55%)',
                        'hsl(21, 86%, 50%)',
                        'hsl(21, 86%, 45%)',
                        'hsl(21, 86%, 40%)',
                        'hsl(21, 86%, 33%)',
                        'hsl(21, 86%, 27%)'
                    ],
                    data: rate_complet_decimal
                }
            ];
            var scales = {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 100
                    }
                }]
            };
            // Data
            let data = {
                labels: ['Tous âges', '0-24 ans', '25-29 ans', '30-39 ans',
                    '40-49 ans','50-59 ans', '60-64 ans', '65-69 ans',
                    '70-74 ans', '75-79 ans', '80 ans et +'],
                datasets: datasets
            }
            let d = this.metrics;
            let ctx = document.getElementById('chart').getContext('2d');
            let chart = new Chart(ctx, {
                // Type of chart
                type: 'bar',
                data: data,
                options: {
                    title: {
                        display: true,
                        text: 'Taux de vaccination par classe d’âge des personnes vaccinées'
                    },
                    scales: scales,
                    tooltips: {
                        callbacks: {
                            beforeBody: function(tooltipItem, chart) {
                                let field = tooltipItem[0].datasetIndex == 0 ? 'n_tot_dose1' : 'n_tot_complet'
                                return 'Nb vaccinés : ' + d[field][tooltipItem[0].index].toLocaleString();
                            }
                        }
                    }
                }
            });
        },
        /*
        *   Removes a chart
        */
        removeChart() {
            $('#chart').replaceWith('<canvas id="chart" height="300"></canvas>');
        }
    }
})
