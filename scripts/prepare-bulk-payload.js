const fs = require('fs');
const path = require('path');

const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, 'bulk-analyzed-raw.json'), 'utf8'));

// Category UUIDs
const CATS = {
  chindo: 'ffaa0f05-f6d3-4629-84fe-5f3f4bd60b25',
  lokal: '8410267f-90b4-4d72-9bf5-533d14c5c6b5',
  hijab: 'b4cce53c-ead0-4544-9aab-b7680a197ab4',
  fienshyt: 'f8b46c1d-9ba9-4bc8-9944-a7fba52a0441',
  bocil: 'ef7de8e3-e83f-467d-8b19-5e41b0cbbe08',
  fashion: 'af43a833-eb3b-4a00-8c0e-3e47277a6b70',
  beauty: '45ed4736-6062-47cd-ad16-0cc72d1d6d2e',
  dance: '6d95aa9b-035c-4c8b-bdf9-671ad2ed6cc3',
  lifestyle: '080f4085-f7a0-4fe5-a75b-0a9f6bae9023',
};

console.log(`Loaded ${rawData.length} items from raw data.`);
