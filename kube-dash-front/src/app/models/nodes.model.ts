export interface Nodes {
    name: string;
    children?: Nodes[];
    icon?: string;
}

export const CLUSTER_RESOURCES: Nodes[] = [
    {
        name: 'KUBERNETES CLUSTERS',
        children: [
            { name: 'Overview', icon: 'dashboard' },
            { name: 'Applications', icon: 'blur_on' },
            { name: 'Nodes', icon: 'account_tree' },
            {
                name: 'Workloads',
                children: [{ name: 'Overview' }, { name: 'Pods' }, { name: 'Deployments' }, { name: 'Daemon Sets' }, { name: 'Stateful Sets' },
                { name: 'Replica Sets' }, { name: 'Replication Controllers' }, { name: 'Jobs' }, { name: 'Cron Jobs' }],
                icon: 'widgets'
            },
            {
                name: 'Config',
                children: [{ name: 'Config Maps' }, { name: 'Secrets' }, { name: 'Resource Quotas' }, { name: 'Limit Ranges' }],
                icon: 'settings_suggest'
            },
            {
                name: 'Network',
                children: [{ name: 'Services' }, { name: 'Endpoints' }, { name: 'Ingresses' }, { name: 'Network Policies' }],
                icon: 'route'
            },
            {
                name: 'Storage',
                children: [{ name: 'Persistent Volume Claims' }, { name: 'Persistent Volumes' }, { name: 'Storage Classes' }],
                icon: 'storage'
            },
            { name: 'Namespaces', icon: 'layers' },
            { name: 'Events', icon: 'schedule' },
            {
                name: 'Helm',
                children: [{ name: 'Charts' }, { name: 'Releases' }],
                icon: 'sports_motorsports'
            },
            {
                name: 'Access Control',
                children: [{ name: 'Service Accounts' }, { name: 'Cluster Roles' }, { name: 'Roles' }, { name: 'Role Bindings' }],
                icon: 'security'
            },
            {
                name: 'Custom Resources',
                children: [{ name: 'Definitions' }],
                icon: 'extension'
            },
        ],
    },
];