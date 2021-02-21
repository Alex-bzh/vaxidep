// chart.js
app.component('chart', {
    template: `
    <button class="btn btn-secondary" type="button"
        @click="setZoneToFrance">
        France entière
    </button>
    <canvas id="chart" height="300"></canvas>
    `,
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
        addMetrics(metrics) {
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
                    this.addMetrics(metrics[this.labels[age]]);
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
            this.data.taux.forEach(
                element => taux2decimal.push(element.toFixed(2))
                );
            var datasets = [
                {
                    label: 'Taux (en %)',
                    borderColor: 'hsl(180, 100%, 25%)',
                    backgroundColor: [
                        'hsl(180, 100%, 25%)',
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
                labels: ['Tous âges', '0-24 ans', '25-29 ans', '30-39 ans',
                    '40-49 ans','50-59 ans', '60-64 ans', '65-69 ans',
                    '70-74 ans', '75-79 ans', '80 ans et +'],
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
        },
        /*
        *   Removes an obsolete chart
        */
        removeChart() {
            // Restores data to default value
            this.data = {
                'taux': Array()
            };
            // Replaces the canvas with a fresh one.
            $('#chart').replaceWith('<canvas id="chart" height="300"></canvas>');
        },
        /*
        *   Displays the nationwide metrics 
        */
        setZoneToFrance() {
            // Removes the actual chart
            this.removeChart();
            // Gets the nationwide metrics
            this.getMetrics('france');
        }
    }
})
