const fs = require('fs');
const process = require('process');
const path = require('path');
const { transifexApi } = require('@transifex/api');
const axios = require('axios');

// Exit early if the auth token is not set
if (!process.env.TX_TOKEN) {
  console.log("TX_TOKEN is not set");
  process.exit(1);
}

// Check if there is an argument
if (process.argv.length < 3 || (process.argv[2] != 'upload' && process.argv[2] != 'download')) {
  console.log("Action is not valid, please use either 'upload' or 'download'");
  process.exit(1);
}

// Set up the Transifex API
transifexApi.setup({auth: process.env.TX_TOKEN});


function getPercentage(attributes) {
  return (parseFloat(attributes.translated_strings) / parseFloat(attributes.total_strings)) * 100;
}


async function uploadFiles(resource, languages) {
  for (const lang of languages) {
    const filename = path.join('src', 'assets', 'i18n', `${lang.attributes.code}.json`)
    if (!fs.existsSync(filename)) {
      continue;
    }
    console.log(`Reading ${lang.attributes.code}.json...`);
    const content = fs.readFileSync(filename);
    console.log(`Uploading ${lang.attributes.code}.json...`);
    await transifexApi.ResourceTranslationsAsyncUpload.upload({
      resource: resource,
      language: lang,
      content: content.toString()
    });
  }
}

async function downloadFiles(org, project, resource, languages) {
  for (const lang of languages) {
    console.log(`Checking completeness of ${lang.attributes.code}.json...`);
    const trs = await transifexApi.ResourceLanguageStats.get({
      project: project,
      resource: resource,
      language: lang
    });
    if (getPercentage(trs.attributes) < 50) {
      continue;
    }
    console.log(`Downloading ${lang.attributes.code}.json...`);
    const url = await transifexApi.ResourceTranslationsAsyncDownload.download({
      resource: resource,
      language: lang
    });
    const response = await axios.get(url);
    if (response.status == 200) {
      fs.writeFileSync(path.join('src', 'assets', 'i18n', `${lang.attributes.code}.json`), JSON.stringify(response.data, null, 2));
    }
    else {
      console.log(`Error: ${response.statusText}`);
    }
  }
}

async function main() {
  console.log('Fetching organization, project and languages...');
  const org = await transifexApi.Organization.get({slug: 'openlp'});
  const projects = await org.fetch('projects');
  const proj = await projects.get({slug: 'web-remote'});
  const resource = await transifexApi.Resource.get({project: proj, slug: 'i18n-strings'});
  const languages = await proj.fetch('languages');
  await languages.fetch();
  if (process.argv[2] == 'upload') {
    await uploadFiles(resource, languages.data);
  }
  else if (process.argv[2] == 'download') {
    await downloadFiles(org, proj, resource, languages.data);
  }
}

main();
