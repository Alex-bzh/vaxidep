const app = Vue.createApp({
    data() {
        return {
            area: 'france',
            metrics: {
                'n_tot_dose1': Array(),
                'n_tot_dose2': Array(),
                'rate_dose1': Array(),
                'rate_dose2': Array()
            }
        }
    },
    created() {
        // Fetches the default metrics (i.e. France)
        this.getMetrics(this.area);
    },
    updated() {
        // 
        this.$refs.chart.initChart();
    },
    methods: {
        /*
        *   Flushes the metrics.
        */
        flushMetrics() {
            this.metrics = {
                'n_tot_dose1': Array(),
                'n_tot_dose2': Array(),
                'rate_dose1': Array(),
                'rate_dose2': Array()
            }
        },
        /*
        *   Fetches the metrics.
        */
        getMetrics(area) {

            // Defines the area to display
            this.area = area;

            // Fetch API
            fetch('./data/metrics-' + this.area + '.json')
            .then(stream => stream.json())
            .then(metrics => {
                this.labels = Object.keys(metrics);
                for (var age in this.labels) {
                    this.metrics.n_tot_dose1.push(metrics[this.labels[age]]['n_tot_dose1'])
                    this.metrics.n_tot_dose2.push(metrics[this.labels[age]]['n_tot_dose2'])
                    this.metrics.rate_dose1.push(metrics[this.labels[age]]['rate_dose1'])
                    this.metrics.rate_dose2.push(metrics[this.labels[age]]['rate_dose2'])
                }
            });
        },
        /*
        *   Zoom to a specific department
        */
        setArea(area) {
            // The zone is fixed to the department
            this.area = area;
            // Obsolete metrics are removed…
            this.flushMetrics();
            // … and we get new ones.
            this.getMetrics(this.area);
        }
    }
});
