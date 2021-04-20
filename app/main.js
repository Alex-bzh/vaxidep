const app = Vue.createApp({
    data() {
        return {
            area: 'france'
        }
    },
    methods: {
        /*
        *   Zoom to a specific department
        */
        setArea(area) {
            // The zone is fixed to the department
            this.area = area;
            // Removes the old chart.
            this.$refs.chart.removeChart();
            // Sets a new Chart with accurate metrics.
            this.$refs.chart.getMetrics(this.area);
        }
    }
});
