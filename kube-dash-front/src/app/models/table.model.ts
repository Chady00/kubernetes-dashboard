export interface TableData {
    Name: string;
    Namespace: string;
    Control: number;
    CPU: string;
    memory: string;
    Status: string;
    Restarts: number;
}

export interface PodData {
    Name: String,
    Namespace: String,
    Containers: Number,
    CPU: Number,
    Memory: Number
    Node: String,
    Age: Number,
    Status: String
}