const app = Vue.createApp({
    data() {
        return {
            departments: null,
            dateToDisplay: moment(),
            zone: 'france'
        }
    },
    mounted() {
        /*
        *   Fetches the GeoJSON data when the component is mounted.
        */
        this.fetchData();
    },
    computed: {
        /*
        *   Converts the date to display into a Moment format.
        */
        displayDate() {
            return moment(this.dateToDisplay).format('LL');
        }
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
                this.dateToDisplay = data.date;
                // Initializes the GeoJSON layer
                this.$refs.map.initGeoJSON(data.features, data.date);
            });
        }
    }
});
