const newman = require('newman');
const path = require('path');
const fs = require('fs');

const executeTest = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No collection file uploaded.');
  }

  let collectionJson;
  try {
    // parse file as JSON
    const fileContent = req.file.buffer.toString('utf8');
    collectionJson = JSON.parse(fileContent);
  } catch (parseError) {
    console.error('Error parsing collection file:', parseError);
    return res.status(400).send('Invalid JSON format in the uploaded file.');
  }

  // Define the path for the report
  const reportPath = path.join(__dirname, '..', 'reports', `report-${Date.now()}.html`);
  // Ensure the reports directory exists
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });

  newman.run(
    {
      collection: collectionJson,
      reporters: ['cli', 'htmlextra'],
      reporter: {
        htmlextra: {
          export: reportPath,
        },
      },
    },
    function (err, summary) {
      if (err) {
        console.error('Newman run error:', err);
        return res.status(500).json({ message: 'Collection run failed.', error: err });
      }

      console.log('collection run complete!');
      console.log('stats', summary);

      res.status(200).json({
        message: 'Collection run complete!',
        stats: summary.run.stats,
        reportPath: reportPath,
      });
    },
  );
};
module.exports = { executeTest };
