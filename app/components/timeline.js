// timeline.js
app.component('timeline', {
    template:`
    <div class="d-flex">
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="datesMenu" data-bs-toggle="dropdown" aria-expanded="false">
                Choisissez une date
            </button>
            <div class="dropdown-menu scrollable-menu" aria-labelledby="datesMenu">
                <button class="dropdown-item" type="button"
                    :value="date.value"
                    v-for="date in dates"
                    @mouseover="transmitSelected"
                    @click="transmitLimit">
                        {{ date.text }}
                </button>
            </div>
        </div>
        <!--
        <div class="mx-2">
            <button class="btn btn-secondary" type="button"
                @click="transmitZoneFrance">
                France entière
            </button>
        </div>
        -->
    </div>`,
    data() {
        return {
            dates: Array()
        }
    },
    methods: {
        /*
        *   Lists all the dates between now and December the 27th, 2020:
        *   the start date of the vaccination program.
        */
        listDates(start, end) {
            let startDate = moment(start);
            let endDate = moment(end).add(1, "days");
            let diff = endDate.diff(startDate, "days");
            for (let i = diff - 1; i >= 0; i--) {
                this.dates.push({
                    text: endDate.subtract(1, "days").format('LL'),
                    value: endDate.format('YYYY-MM-DD')
                });
            }
        },
        /*
        *   Triggers an event to define a point in time for displaying charts
        */
        transmitLimit(e) {
            this.$emit('set-limit', e.target.getAttribute('value'));
        },
        /*
        *   Triggers an event to change the key date
        */
        transmitSelected(e) {
            this.$emit('change-layer', e.target.getAttribute('value'));
        },
        /*
        *   Triggers an event to show all the data
        */
        transmitZoneFrance() {
            this.$emit('show-all');
        }
    }
})
