// nb-vax.js
app.component('nb-vax', {
    template: `
    <table class="table table-borderless table-sm">
        <thead>
            <tr>
                <th scope="col">Nombre d’injections</th>
                <th scope="col">Nombre de personnes vaccinées</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th scope="row">1</th>
                <td>{{ metrics.n_tot_dose1.toLocaleString() }} ({{ metrics.rate_dose1 }} %)</td>
            </tr>
            <tr>
                <th scope="row">2</th>
                <td>{{ metrics.n_tot_dose2.toLocaleString() }} ({{ metrics.rate_dose2 }} %)</td>
            </tr>
        </tbody>
    </table>
    `,
    props: {
        metrics: Object
    }
})
