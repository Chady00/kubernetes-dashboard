export interface ViewConfig {
    label: string;
    value: string;
    columns: string[];
    displayedColumns: string[];
    apiEndpoint?: string;
    mapFn: (data: any) => any;
    actions?: any;
}
// helper function to convert age into a simple date
export function convertAge(isoDate: string): string {
    const past = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - past.getTime();

    const diffMins = Math.floor(diffMs / 60000);
    const days = Math.floor(diffMins / (60 * 24));
    const hours = Math.floor((diffMins % (60 * 24)) / 60);
    const minutes = diffMins % 60;

    let result = '';

    if (days > 0) return `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;

    return result.trim() || 'just now';
}

// object of type key value pairs, key: string, value: function that returns a string
// to map to appropriate class
export const columnClassConfig: { [key: string]: (val: any) => string } = {
    status: (val: any) => val === 'Running' ? 'status-running' : 'status-not-running',
    namespace: () => 'linkable',
    node: () => 'linkable',
};

export const VIEW_CONFIGS: ViewConfig[] = [
    {
        label: 'Pods',
        value: 'pod',
        columns: ['pod', 'Name', 'Namespace', 'Containers', 'CPU', 'Memory', 'PodIP', 'Node', 'Age', 'Status'],
        displayedColumns: ['Name', 'Namespace', 'Containers', 'CPU', 'Memory', 'PodIP', 'Node', 'Age', 'Status'],
        apiEndpoint: 'pod',
        mapFn: (pod: any) => ({
            Name: pod.name,
            Namespace: pod.namespace,
            Containers: pod.containers?.map((c: any) => c.name) || 'N/A',
            CPU: pod.cpu ?? 'N/A',
            Memory: pod.memory ?? 'N/A',
            PodIP: pod.podIP ?? 'N/A',
            Node: pod.node ?? 'N/A',
            Age: convertAge(pod.age) ?? 'N/A',
            Status: pod.status ?? 'Unknown'
        }),
        actions: [
            {
                icon: 'delete_sweep',
                action: 'Evict'
            },
            {
                icon: 'share',
                action: 'Share Link'
            },
            {
                icon: 'article',
                action: 'Logs'
            },
            {
                icon: 'mode_edit',
                action: 'Edit'
            },
            {
                icon: 'delete',
                action: 'Delete'
            }
        ]
    },
    {
        label: 'Deployments',
        value: 'deployment',
        columns: ['deployment', 'Name', 'Namespace', 'Pods', 'Replicas', 'StrategyType', 'Age', 'Status'],
        displayedColumns: ['Name', 'Namespace', 'Pods', 'Replicas', 'StrategyType', 'Age', 'Status'],
        apiEndpoint: 'deployment',
        mapFn: (dept: any) => ({
            Name: dept.name,
            Namespace: dept.namespace,
            Pods: dept.readyReplicas + '/' + dept.replicas,
            Replicas: dept.replicas,
            StrategyType: dept.strategyType,
            Age: convertAge(dept.age),
            Status: dept.status ? 'Available' : dept.status
        })
    }
]
