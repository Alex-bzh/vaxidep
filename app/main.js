const app = Vue.createApp({
    data() {
        return {
            departments: null,
            dateToDisplay: moment().format('LL'),
            area: 'france'
        }
    },
    mounted() {
        /*
        *   Fetches the GeoJSON data when the component is mounted.
        */
        this.fetchData();
    },
    methods: {
        /*
        *   Fetches the data
        */
        fetchData() {
            fetch('./data/vaxi-france.json')
            .then(stream => stream.json())
            .then(data => {
                this.departments = data.features;
                // Initializes the GeoJSON layer
                this.$refs.map.initGeoJSON(data.features);
            });
        },
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
