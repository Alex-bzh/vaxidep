// area.js
app.component('geo-area', {
    template: `
    <button class="btn btn-secondary" type="button"
        @click="setAreaToFrance"
        :disabled="area == 'france'">
        France entière
    </button>
    `,
    props: {
        area: String
    },
    methods: {
        setAreaToFrance() {
            this.$emit('set-area', 'france');
        }
    }
})
