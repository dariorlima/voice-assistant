import { Service } from 'node-windows';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const assistantName = process.env.ASSISTANT_NAME || 'Unknown';

const assistantPath = path.join(process.cwd(), 'main.js');
// Create a new service object
const svc = new Service({
    name: assistantName,
    description: 'Capture voice ideas and transcript it',
    script: assistantPath,
    nodeOptions: [
        '--harmony',
        '--max_old_space_size=4096'
    ]
    //, workingDirectory: '...'
    , allowServiceLogon: true
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
    svc.start();
});

svc.install();