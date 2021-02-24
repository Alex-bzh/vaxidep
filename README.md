# Vaxidep

Visualize the evolution of the vaccination campaign to Covid-19 in France, department by department, for a given age group.

A demonstration is available at https://apps.roulois.fr/vaxidep/

## How to run this application on local?

You need a Web server to launch the application. There are several ways to do so. On Linux and MacOS platforms, you can for example call `python` or `php` utilities:

```shell
$ python -m http.server 8080
```

```shell
$ php -S localhost:8080
```

Then, open your web browser and navigate to the URL `http://localhost:8080`.

## How to update the data?

SPF (Santé publique France) provide updated data day by day through its [système d’information Vaccin Covid (VAC-SI)](https://www.data.gouv.fr/fr/datasets/donnees-relatives-aux-personnes-vaccinees-contre-la-covid-19-1/).

1. download the CSV file called `vacsi-tot-a-dep.csv`
2. save it in the `script` folder
3. run the script `data_to_JSON.py`
```shell
$ python data_to_JSON.py
```

This procedure will update the files in the `data` folder on which the application is based.

## Credits

The borders of the departments come from the <a href="https://github.com/gregoiredavid/france-geojson">France GeoJSON</a> project by Grégoire David.

All the data are extracted from the Covid vaccine information system (*VAC-SI*) and provided by <a href="https://www.data.gouv.fr/fr/organizations/sante-publique-france/">Santé publique France</a>.

The data on the census of the population comes from the <a href="https://www.scoresante.org/">Score-santé information system</a>.
