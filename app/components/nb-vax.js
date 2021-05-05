// nb-vax.js
app.component('nb-vax', {
    template: `
    <table class="table table-borderless table-sm">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre de personnes</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th scope="row">Au moins une dose</th>
                <td>{{ metrics.n_tot_dose1.toLocaleString() }} ({{ metrics.rate_dose1 }} %)</td>
            </tr>
            <tr>
                <th scope="row">Complètement vaccinées</th>
                <td>{{ metrics.n_tot_complet.toLocaleString() }} ({{ metrics.rate_complet }} %)</td>
            </tr>
        </tbody>
    </table>
    `,
    props: {
        metrics: Object
    }
})
