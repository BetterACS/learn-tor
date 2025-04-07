node lighthouse-multiple-cli.cjs
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const urls = [
  'http://localhost:3000',
  'http://localhost:3000/home',
  'http://localhost:3000/register',
  'http://localhost:3000/login',
  'http://localhost:3000/profile',
  'http://localhost:3000/tcas-info',
  'http://localhost:3000/compare-courses',
  'http://localhost:3000/chatbot',
  'http://localhost:3000/tcascalculator',
  'http://localhost:3000/forum'
];

const getSafeFilename = (url) => {
  return url.replace('http://', '')
           .replace(/\//g, '_')
           .replace(/[^a-zA-Z0-9_]/g, '')
           .replace(/_+/g, '_');
};

const runLighthouse = (url) => {
  return new Promise((resolve, reject) => {
    const filename = getSafeFilename(url) || 'root';
    const outputBase = `./lighthouse-reports/${filename}`;
    
    console.log(`Starting Lighthouse for: ${url}`);
    
    const command = `lighthouse ${url} \
      --output=json --output=html \
      --output-path=${outputBase} \
      --chrome-flags="--headless --no-sandbox" \
      --emulated-form-factor=desktop \
      --max-wait-for-load=20000 \ 
      --quiet`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Lighthouse error for ${url}:`, error.message);
        reject({
          url,
          error: true,
          message: error.message
        });
        return;
      }
      setTimeout(() => {
        try {
          const jsonPath = `${outputBase}.report.json`;
          if (!fs.existsSync(jsonPath)) {
            throw new Error('JSON report not found');
          }

          const data = fs.readFileSync(jsonPath, 'utf8');
          const report = JSON.parse(data);
          console.log(`Success: ${url}`);
          resolve({
            url,
            error: false,
            report
          });
        } catch (parseError) {
          console.error(`Failed to process report for ${url}:`, parseError);
          reject({
            url,
            error: true,
            message: parseError.message
          });
        }
      }, 3000);
    });
  });
};

const generateSummary = (successfulReports) => {
  if (!successfulReports || successfulReports.length === 0) {
    throw new Error('No valid reports to summarize');
  }

  const averages = successfulReports.reduce((acc, {report}) => {
    acc.performance += report.categories.performance.score * 100;
    acc.accessibility += report.categories.accessibility.score * 100;
    acc.seo += report.categories.seo.score * 100;
    acc.bestPractices += report.categories['best-practices'].score * 100;
    return acc;
  }, { performance: 0, accessibility: 0, seo: 0, bestPractices: 0 });

  Object.keys(averages).forEach(k => {
    averages[k] = (averages[k] / successfulReports.length).toFixed(2);
  });

  const csvRows = [
    'URL,Status,Performance,Accessibility,SEO,Best Practices'
  ];

  successfulReports.forEach(({url, report}) => {
    const scores = [
      (report.categories.performance.score * 100).toFixed(2),
      (report.categories.accessibility.score * 100).toFixed(2),
      (report.categories.seo.score * 100).toFixed(2),
      (report.categories['best-practices'].score * 100).toFixed(2)
    ];
    csvRows.push(`${url},Success,${scores.join(',')}`);
  });

  csvRows.push(`Average,,${averages.performance},${averages.accessibility},${averages.seo},${averages.bestPractices}`);

  return csvRows.join('\n');
};

(async () => {
  try {
    if (!fs.existsSync('./lighthouse-reports')) {
      fs.mkdirSync('./lighthouse-reports');
      console.log('Created lighthouse-reports directory');
    }

    const allResults = [];
    const failedUrls = [];
    
    for (const url of urls) {
      try {
        const result = await runLighthouse(url);
        if (!result.error) {
          allResults.push(result);
        } else {
          failedUrls.push(url);
        }
      } catch (error) {
        failedUrls.push(url);
      }
    }

    if (allResults.length > 0) {
      const summary = generateSummary(allResults);
      const csvPath = path.resolve('./lighthouse-reports/summary.csv');
      fs.writeFileSync(csvPath, summary);

      console.log('\n================================');
      console.log(`📊 CSV Summary saved to: ${csvPath}`);
      console.log('================================\n');
      console.log(summary);
    } else {
      console.log('No successful reports to generate summary');
    }

    if (failedUrls.length > 0) {
      console.log('\n Failed URLs:');
      failedUrls.forEach(url => console.log(`- ${url}`));

      const errorLogPath = path.resolve('./lighthouse-reports/errors.log');
      fs.writeFileSync(errorLogPath, failedUrls.join('\n'));
      console.log(`\nError log saved to: ${errorLogPath}`);
    }

  } catch (error) {
    console.error('🚨 Script failed:', error.message);
    process.exit(1);
  }
})();