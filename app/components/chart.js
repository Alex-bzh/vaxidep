// chart.js
app.component('chart', {
    template: `
        <div>
            <canvas id="chart" height="300"></canvas>
        </div>`,
    data() {
        return {
            labels: Array(),
            data: {
                'taux': Array()
            },
            title: '',
            zone: 'france'
        }
    },
    created() {
        this.getMetrics(this.zone);
    },
    methods: {
        /*
        *   Adds metrics to data for a point in time.
        */
        addMetrics(metrics, age) {
            this.data.taux.push(metrics.taux);
        },
        /*
        *   Fetches the metrics, according to a point in time (eventually).
        */
        getMetrics(zone) {

            // Defines the zone to display
            this.zone = zone;

            // Fix the title of the chart
            if (this.zone != 'france') this.title = "Taux de vaccination par classe d’âge des personnes ayant reçu deux doses de vaccin – Département " + this.zone;
            else this.title = "Taux de vaccination par classe d’âge des personnes ayant reçu deux doses de vaccin – France entière";

            // Fetch API
            fetch('./data/metrics-' + this.zone + '.json')
            .then(stream => stream.json())
            .then(metrics => {
                this.labels = Object.keys(metrics);
                for (var age in this.labels) {
                    this.addMetrics(metrics[this.labels[age]], this.labels[age]);
                }
                // Initializes the chart
                this.initChart();
            });
        },
        /*
        *   Initializes a chart
        */
        initChart() {
            // A new array to save the data with only two decimal.
            let taux2decimal = Array();
            this.data.taux.forEach( element => taux2decimal.push(element.toFixed(2)));
            var datasets = [
                {
                    label: 'Taux (en %)',
                    borderColor: 'hsl(180, 100%, 25%)',
                    backgroundColor: 'hsl(180, 100%, 25%)',
                    data: taux2decimal
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
                labels: ['Tout', '0-24', '25-29', '30-39', '40-49', '50-59', '60-64', '65-69', '70-74', '75-79', '+80'],
                datasets: datasets
            }
            let ctx = document.getElementById('chart').getContext('2d');
            let chart = new Chart(ctx, {
                // Type of chart
                type: 'bar',
                data: data,
                options: {
                    title: {
                        display: true,
                        text: this.title
                    },
                    scales: scales
                }
            });
        }
    }
})
