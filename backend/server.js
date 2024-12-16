import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Dashboard Stats API
app.get('/api/dashboard-stats', (req, res) => {
    const dashboardData = {
        stats: {
            payerList: {
                stats: [
                    { label: "Total", value: 9 },
                    { label: "Active", value: 5 },
                    { label: "Pending", value: 4 }  
                ],
                lastUpdated: "12-12-2024"
            },
            connectedTo: {
                stats: [
                    { label: "Request", value: 8 },
                    { label: "Response", value: 6 },
                    { label: "Pending", value: 2 } 
                ],
                lastUpdated: "12-12-2024"
            },
            connectedFrom: {
                stats: [
                    { label: "Request", value: 9 },
                    { label: "Response", value: 6 },
                    { label: "Pending", value: 3 }
                ],
                lastUpdated: "12-12-2024"
            }
        }
    };
    res.json(dashboardData);
});

// Connection List API
app.get('/api/connection-list', (req, res) => {
    const connectionData = {
        connections: [
            { title: "Payer Name : Vinay-patil Bhoj", date: "12/12/24", status: "Active" },
            { title: "Payer Name : Sanchit-Ashtekar", date: "12/12/24", status: "Active" },
            { title: "Payer Name : Sourabh-Gurav", date: "12/12/24", status: "Pending" } 
        ]
    };
    res.json(connectionData);
});

// Activity List API
app.get('/api/activity-list', (req, res) => {
    const activityData = {
        activities: [
            { title: "Certificate Uploaded", date: "12/12/24" },
            { title: "Requested for Payer", date: "12/12/24" },
            { title: "Item 3", date: "12/12/24" }
        ]
    };
    res.json(activityData);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
