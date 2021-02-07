#!/usr/bin/env python
#-*- coding: utf-8 -*-

"""Converts data from VAC-SI, the vaccine information system
from Direction Générale de la Santé in CSV format to a geoJSON object.
The source data are available here:
https://www.data.gouv.fr/fr/datasets/donnees-relatives-aux-personnes-vaccinees-contre-la-covid-19-1/
Correct dataset: vacsi-a-dep*.csv
"""

#
#   Modules to import
#
import csv
import json
import datetime

#
#   User functions
#
def build_structure(departments, dates, ages):
    """Builds the skeleton of the data."""
    accounts = dict()
    
    for department in departments:
        accounts.update({
            department: {
                date: {
                    age: {
                        "n_dose1": int(),
                        "n_cum_dose1": int(),
                        "taux": float()
                    }
                    for age in ages
                }
                for date in dates
            }
        })

    return accounts

def get_borders():
    """Loads the borders of the French departments."""
    with open('../data/departements.geojson') as geojson:
        return json.load(geojson)

def get_census():
    """Distribution of the French census by department and age group."""
    census = dict()
    with open('../data/pop-vax.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';')
        for line in reader:
            census.update({ line['dep']: line })

    return census

def fill_data(path, accounts, census):
    """Fill the structure with the data"""
    with open(path, newline='') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=',')
        for idx, line in enumerate(reader):
            if idx != 0:
                if line['dep'] not in ['970', '97', '977', '00']:
                    accounts[line['dep']][line['jour']][line['clage_vacsi']]['n_dose1'] = int(line['n_dose1'])
                    accounts[line['dep']][line['jour']][line['clage_vacsi']]['n_cum_dose1'] = int(line['n_cum_dose1'])
                    accounts[line['dep']][line['jour']][line['clage_vacsi']]['taux'] = f'{(int(line["n_cum_dose1"]) / int(census[line["dep"]][line["clage_vacsi"]])) * 100:.2f}'

                    accounts['france'][line['jour']][line['clage_vacsi']]['n_dose1'] += int(line['n_dose1'])
                    accounts['france'][line['jour']][line['clage_vacsi']]['n_cum_dose1'] += int(line['n_cum_dose1'])
                    accounts['france'][line['jour']][line['clage_vacsi']]['taux'] += (int(line['n_cum_dose1']) / int(census['france'][line['clage_vacsi']])) * 100
    
    # Sorts the metrics by date
    for dept in accounts:
        accounts[dept] = dict(sorted(accounts[dept].items(), key=lambda item: item[0]))


    return accounts

def write_metrics(accounts):
    """ Writes the nationwide metrics and the specific ones to a
    department.
    """
    for sector in accounts:
        if sector:
            with open(f'../data/metrics-{sector}.json', 'w') as jsonfile:
                json.dump(accounts[sector], jsonfile)

#
#   Main function
#
def main():

    # Now
    date = datetime.datetime.now()
    today = f'{date.year}-{date.month}-{date.day}'

    # Paths to the files
    path_to_vacsi = '../data/vacsi-a-dep.csv'
    path_to_geo_full = '../data/vaxi-france.json'

    # Useful structures to analyse the data
    dates = set()
    departments = set({"france"})
    ages = set()

    with open(path_to_vacsi, newline='') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=',')
        for line in reader:
            if line['dep'] != '97':
                dates.add(line['jour'])
                departments.add(line['dep'])
                ages.add(line['clage_vacsi'])

    # Census
    census = get_census()

    # Borders of the French departments
    borders = get_borders()

    # Empty structure
    accounts = build_structure(departments, dates, ages)

    # Fill the structure
    accounts = fill_data(path_to_vacsi, accounts, census)

    # Write the metrics
    write_metrics(accounts)

    # Writes a geoJSON file
    with open(path_to_geo_full, 'w') as jsonfile:

        # The most recent recorded date
        recent = max(dates)

        jsonfile.write('{"date":"' + recent + '", "type":"FeatureCollection","features":[')
        
        for idx, department in enumerate(borders['features']):

            # Code of the department (e.g.: 75, 01, 37…)
            code = department['properties']['code']

            # Looks up in the accounts the metrics for
            # this particular department
            department['properties'].update({
                'metrics': accounts.get(code)
            })

            # As a JSON formatted stream
            json.dump(department, jsonfile)
            if (idx + 1) < len(borders['features']):
                jsonfile.write(',\n')

        # Closes the FeatureCollection and the geoJSON file
        jsonfile.write('\n]}\n')

#
#   Main
#
if __name__ == '__main__':
    main()
