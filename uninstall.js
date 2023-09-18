import { Service } from 'node-windows';

const assistantName = process.env.ASSISTANT_NAME || 'Unknown';
const assistantPath = path.join(process.cwd(), 'main.js');

// Create a new service object
const svc = new Service({
    name: assistantName,
    script: assistantPath
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', function () {
    console.log('Uninstall complete.');
    console.log('The service exists: ', svc.exists);
});

// Uninstall the service.
svc.uninstall();