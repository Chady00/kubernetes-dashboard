import { ViewConfig, convertAge } from '../main-content/view-config';

export const CHART_TABLE_VIEWS: ViewConfig[] = [
    {
        label: 'tolerations',
        value: 'tolerations',
        columns: ['key', 'operator', 'value', 'effect', 'seconds'],
        displayedColumns: ['key', 'operator', 'value', 'effect', 'seconds'],
        mapFn: (property: any) => ({
            key: property.key
        })
    },
    {
        label: 'volumes',
        value: 'volumes',
        columns: ['name', 'defaultMountMode', 'sources'],
        displayedColumns: ['Name', 'Default Mount Mode', 'Sources'],
        mapFn: (property: any) => ({
            key: property.key
        })
    }
]