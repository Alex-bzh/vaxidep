// chart.js
app.component('chart', {
    template: `
    <button class="btn btn-secondary" type="button"
        @click="setZoneToFrance">
        France entière
    </button>
    <table class="table table-borderless table-sm">
        <caption class="caption-top">Zone géographique : {{ zoneToDisplay }}</caption>
        <thead>
            <tr>
                <th scope="col">Nombre de doses</th>
                <th scope="col">Nombre de personnes vaccinées</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th scope="row">1</th>
                <td>{{ Number(data.n_tot_dose1[0]).toLocaleString() }}</td>
            </tr>
            <tr>
                <th scope="row">2</th>
                <td>{{ Number(data.n_tot_dose2[0]).toLocaleString() }}</td>
            </tr>
        </tbody>
    </table>
    <canvas id="chart" height="300"></canvas>
    `,
    data() {
        return {
            labels: Array(),
            data: {
                'n_tot_dose1': Array(),
                'n_tot_dose2': Array(),
                'rate_dose1': Array(),
                'rate_dose2': Array()
            },
            title: '',
            zone: 'france'
        }
    },
    created() {
        this.getMetrics(this.zone);
    },
    computed: {
        zoneToDisplay() {
            let zones = {
                'france': 'France',
                '01':'Ain',
                '02':'Aisne',
                '03':'Allier',
                '04':'Alpes-de-Haute-Provence',
                '05':'Hautes-Alpes',
                '06':'Alpes-Maritimes',
                '07':'Ardèche',
                '08':'Ardennes',
                '09':'Ariège',
                '10':'Aube',
                '11':'Aude',
                '12':'Aveyron',
                '13':'Bouches-du-Rhône',
                '14':'Calvados',
                '15':'Cantal',
                '16':'Charente',
                '17':'Charente-Maritime',
                '18':'Cher',
                '19':'Corrèze',
                '21':'Côte-d’or',
                '22':'Côtes-d’armor',
                '23':'Creuse',
                '24':'Dordogne',
                '25':'Doubs',
                '26':'Drôme',
                '27':'Eure',
                '28':'Eure-et-Loir',
                '29':'Finistère',
                '2A':'Corse-du-Sud',
                '2B':'Haute-Corse',
                '30':'Gard',
                '31':'Haute-Garonne',
                '32':'Gers',
                '33':'Gironde',
                '34':'Hérault',
                '35':'Ille-et-Vilaine',
                '36':'Indre',
                '37':'Indre-et-Loire',
                '38':'Isère',
                '39':'Jura',
                '40':'Landes',
                '41':'Loir-et-Cher',
                '42':'Loire',
                '43':'Haute-Loire',
                '44':'Loire-Atlantique',
                '45':'Loiret',
                '46':'Lot',
                '47':'Lot-et-Garonne',
                '48':'Lozère',
                '49':'Maine-et-Loire',
                '50':'Manche',
                '51':'Marne',
                '52':'Haute-Marne',
                '53':'Mayenne',
                '54':'Meurthe-et-Moselle',
                '55':'Meuse',
                '56':'Morbihan',
                '57':'Moselle',
                '58':'Nièvre',
                '59':'Nord',
                '60':'Oise',
                '61':'Orne',
                '62':'Pas-de-Calais',
                '63':'Puy-de-Dôme',
                '64':'Pyrénées-Atlantiques',
                '65':'Hautes-Pyrénées',
                '66':'Pyrénées-Orientales',
                '67':'Bas-Rhin',
                '68':'Haut-Rhin',
                '69':'Rhône',
                '70':'Haute-Saône',
                '71':'Saône-et-Loire',
                '72':'Sarthe',
                '73':'Savoie',
                '74':'Haute-Savoie',
                '75':'Paris',
                '76':'Seine-Maritime',
                '77':'Seine-et-Marne',
                '78':'Yvelines',
                '79':'Deux-Sèvres',
                '80':'Somme',
                '81':'Tarn',
                '82':'Tarn-et-Garonne',
                '83':'Var',
                '84':'Vaucluse',
                '85':'Vendée',
                '86':'Vienne',
                '87':'Haute-Vienne',
                '88':'Vosges',
                '89':'Yonne',
                '90':'Territoire de Belfort',
                '91':'Essonne',
                '92':'Hauts-de-Seine',
                '93':'Seine-Saint-Denis',
                '94':'Val-de-Marne',
                '95':'Val-d’oise',
                '971':'Guadeloupe',
                '972':'Martinique',
                '973':'Guyane',
                '974':'La Réunion',
                '976':'Mayotte',
                '987':'Polynésie Française',
                '988':'Nouvelle Calédonie'
            }
            return zones[this.zone];
        }
    },
    methods: {
        /*
        *   Fetches the metrics, according to a point in time (eventually).
        */
        getMetrics(zone) {

            // Defines the zone to display
            this.zone = zone;

            // Fix the title of the chart
            if (this.zone != 'france') this.title = `Taux de vaccination par classe d’âge des personnes vaccinées – ${this.zoneToDisplay}`;
            else this.title = "Taux de vaccination par classe d’âge des personnes vaccinées – France entière";

            // Fetch API
            fetch('./data/metrics-' + this.zone + '.json')
            .then(stream => stream.json())
            .then(metrics => {
                this.labels = Object.keys(metrics);
                for (var age in this.labels) {
                    this.data.n_tot_dose1.push(metrics[this.labels[age]]['n_tot_dose1'])
                    this.data.n_tot_dose2.push(metrics[this.labels[age]]['n_tot_dose2'])
                    this.data.rate_dose1.push(metrics[this.labels[age]]['rate_dose1'])
                    this.data.rate_dose2.push(metrics[this.labels[age]]['rate_dose2'])
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
            let rate_dose1_decimal = Array();
            let rate_dose2_decimal = Array();
            this.data.rate_dose1.forEach(
                element => rate_dose1_decimal.push(element.toFixed(2))
                );
            this.data.rate_dose2.forEach(
                element => rate_dose2_decimal.push(element.toFixed(2))
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
                    label: 'Taux 2 injections (en %)',
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
                    data: rate_dose2_decimal
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
            let d = this.data;
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
                    scales: scales,
                    tooltips: {
                        callbacks: {
                            beforeBody: function(tooltipItem, chart) {
                                let idx = tooltipItem[0].datasetIndex + 1;
                                return 'Nb vaccinés : ' + d[`n_tot_dose${idx}`][tooltipItem[0].index].toLocaleString();
                            }
                        }
                    }
                }
            });
        },
        /*
        *   Removes an obsolete chart
        */
        removeChart() {
            // Restores data to default value
            this.data = {
                'n_tot_dose1': Array(),
                'n_tot_dose2': Array(),
                'rate_dose1': Array(),
                'rate_dose2': Array()
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
