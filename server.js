const express = require('express');
const path = require('path');
const jsonServer = require('json-server');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Use CORS middleware and allow any origin
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'src')));

const templatePath = path.join(__dirname, 'config.template.json');
const configPath = path.join(__dirname, 'src', 'config.json');

fs.readFile(templatePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading config template:', err);
    return;
  }
  
  let updatedConfig = data;
  const placeholders = {
    '{{GOOGLE_MAPS_API_KEY}}': process.env.GOOGLE_MAPS_API_KEY,
  };

  for (const [placeholder, value] of Object.entries(placeholders)) {
    updatedConfig = updatedConfig.replace(placeholder, value);
  }

  fs.writeFile(configPath, updatedConfig, 'utf8', (err) => {
    if (err) {
      console.error('Error writing config file:', err);
    }
  });
});

// Use JSON Server for the API
app.use('/api', jsonServer.router('db.json'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
