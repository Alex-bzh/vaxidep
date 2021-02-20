// fr-covid-map.js
app.component('fr-map', {
    template: `<div id="map"></div>`,
    data: function() {
        return {
            layer: null,
            map: null
        }
    },
    mounted: function() {
        this.initMap();
    },
    methods: {
        /*
        *   Sets a color according to the value of a stat
        */
        vaxiColor(n) {
            return  n >= 100 ? 'hsl(139, 100%, 17%)':
                    n > 75 ? 'hsl(139, 100%, 27%)':
                    n > 60 ? 'hsl(139, 100%, 32%)':
                    n > 50 ? 'hsl(139, 100%, 37%)':
                    n > 45 ? 'hsl(139, 100%, 42%)':
                    n > 40 ? 'hsl(139, 100%, 47%)':
                    n > 35 ? 'hsl(139, 100%, 52%)':
                    n > 30 ? 'hsl(139, 100%, 57%)':
                    n > 25 ? 'hsl(139, 100%, 62%)':
                    n > 20 ? 'hsl(139, 100%, 67%)':
                    n > 15 ? 'hsl(139, 100%, 72%)':
                    n > 10 ? 'hsl(139, 100%, 77%)':
                    n > 5 ? 'hsl(139, 100%, 87%)':
                    n > 3 ? 'hsl(139, 100%, 92%)':
                            'hsl(139, 100%, 97%)';
        },
        /*
        *   Highlights a department
        */
        highlightFeature(event) {
            // Sets a specific style
            event.target.setStyle({
                weight: 2,
                color: 'hsl(21, 91%, 53%)',
                fillColor: 'hsl(21, 91%, 73%)',
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                event.target.bringToFront();
            }
        },
        /*
        *   Initializes a GeoJSON layer.
        */
        initGeoJSON(departments) {
            // If defined, the previous layer is removed for optimization purposes
            if (this.layer) this.map.removeLayer(this.layer);
            // GeoJSON layer
            this.layer = L.geoJSON(departments, {
                style: this.setStyle,
                onEachFeature: this.onEachFeature
            });
            this.layer.addTo(this.map);
        },
        /*
        *   Initializes an OpenStreetMap.
        */
        initMap() {
            // Setting a new Leaflet instance
            this.map = L.map('map').setView([47, 2], 6);
            // OSM tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Données géographiques © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributeurs, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                maxZoom: 18
            }).addTo(this.map);

            this.initGeoJSON();
        },
        /*
        *   Defines all the actions to set on a department
        */
        onEachFeature(feature, layer) {
            // Place a popup
            this.setPopup(feature, layer);
            // Associates events with methods
            layer.on({
                click: this.zoomToFeature,
                mouseout: this.resetHighlight,
                mouseover: this.highlightFeature
            });
        },
        /*
        *   Resets the state of a feature
        */
        resetHighlight(event) {
            this.layer.resetStyle(event.target);
        },
        /*
        *   Sets the popup on a particular department.
        */
        setPopup(department, layer) {
            if (department.properties && department.properties.nom && department.properties.metrics) {
                let content = `<h6>${department.properties.nom} (${department.properties.code})</h6>\
                <table class="table table-borderless table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nb 2e dose</th>
                            <th scope="col">Taux</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">0-24 ans</th>
                            <td>${department.properties.metrics[24].n_tot_dose2}</td>
                            <td>${department.properties.metrics[24].taux} %</td>
                        </tr>
                        <tr>
                            <th scope="row">25-29 ans</th>
                            <td>${department.properties.metrics[29].n_tot_dose2}</td>
                            <td>${department.properties.metrics[29].taux} %</td>
                        </tr>
                        <tr>
                            <th scope="row">30-39 ans</th>
                            <td>${department.properties.metrics[39].n_tot_dose2}</td>
                            <td>${department.properties.metrics[39].taux} %</td>
                        </tr>
                        <tr>
                            <th scope="row">40-49 ans</th>
                            <td>${department.properties.metrics[49].n_tot_dose2}</td>
                            <td>${department.properties.metrics[49].taux} %</td>
                        </tr>
                        <tr>
                            <th scope="row">50-59 ans</th>
                            <td>${department.properties.metrics[59].n_tot_dose2}</td>
                            <td>${department.properties.metrics[59].taux} %</td>
                        </tr>
                        <tr>
                            <th scope="row">60-64 ans</th>
                            <td>${department.properties.metrics[64].n_tot_dose2}</td>
                            <td>${department.properties.metrics[64].taux} %</td>
                        </tr>
                        <tr>
                            <th scope="row">65-69 ans</th>
                            <td>${department.properties.metrics[69].n_tot_dose2}</td>
                            <td>${department.properties.metrics[69].taux} %</td>
                        </tr>
                        <tr>
                            <th scope="row">70-74 ans</th>
                            <td>${department.properties.metrics[74].n_tot_dose2}</td>
                            <td>${department.properties.metrics[74].taux} %</td>
                        </tr>
                        <tr>
                            <th scope="row">75-79 ans</th>
                            <td>${department.properties.metrics[79].n_tot_dose2}</td>
                            <td>${department.properties.metrics[79].taux} %</td>
                        </tr>
                        <tr>
                            <th scope="row">80 ans et +</th>
                            <td>${department.properties.metrics[80].n_tot_dose2}</td>
                            <td>${department.properties.metrics[80].taux} %</td>
                        </tr>
                        <tr>
                            <th scope="row">Total</th>
                            <td>${department.properties.metrics[0].n_tot_dose2}</td>
                            <td>${department.properties.metrics[0].taux} %</td>
                        </tr>
                    </tbody>
                </table>`;
                layer.bindPopup(content);
            }
        },
        /*
        *   Defines the style properties of a department.
        */
        setStyle(department) {
            return {
                fillColor: this.vaxiColor(department.properties.metrics[0].taux),
                weight: 1,
                color: 'white',
                fillOpacity: 1
            };
        },
        /*
        *   Selects the metrics of a specific department
        */
        zoomToFeature(event) {
            this.$emit('zoom-dept', event.target.feature.properties.code);
        }
    }
})