const fs = require('fs');
const process = require('process');
const path = require('path');
const { parseArgs } = require('util');
const { transifexApi } = require('@transifex/api');
const axios = require('axios');

const ACTIONS = ['push', 'upload', 'download'];

// Parse the command line arguments
function parseCliArgs() {
  const options = {
    token: {
      type: 'string',
      short: 't'
    },
    verbose: {
      type: 'boolean',
      short: 'v',
      default: false
    },
    help: {
      type: 'boolean',
      short: 'h',
      default: false
    }
  };
  const { values, positionals } = parseArgs({options: options, allowPositionals: true});
  if (values.help) {
    console.log(`usage: tx [-h|--help] [-v|--verbose] [-t|--token TOKEN] <action>

positional arguments:
  action                the action to perform, one of 'push', 'upload' or 'download'

options:
  -h, --help            show this help message and exit
  -e, --verbose         show extra logging messages
  -t TOKEN, --token TOKEN
                        specify a Transifex API token, can also use the TX_TOKEN environment variable
`);
    process.exit(0);
  }

  if (!values.token && !process.env.TX_TOKEN) {
    console.error("ERROR: Neither --token nor TX_TOKEN was set");
    process.exit(1);
  }
  else if (!values.token && process.env.TX_TOKEN) {
    values.token = process.env.TX_TOKEN;
  }
  if (positionals.length < 1 || !ACTIONS.includes(positionals[0])) {
    console.error("ERROR: Action is not valid, please use one of " + ACTIONS.join(", "));
    process.exit(1);
  }
  return {token: values.token, action: positionals[0], verbose: values.verbose};
}


function getPercentage(attributes) {
  return (parseFloat(attributes.translated_strings) / parseFloat(attributes.total_strings)) * 100;
}


async function pushSource(resource, verbose) {
  const filename = path.join('src', 'assets', 'en.json');
  if (!fs.existsSync(filename)) {
    console.error(`Source file ${filename} does not exist!`);
    process.exit(1);
  }
  if (verbose) {
    console.log('Reading en.json...');
  }
  const content = fs.readFileSync(filename);
  console.log('Uploading en.json...');
  await transifexApi.ResourceStringsAsyncUpload.upload({
    resource: resource,
    content: content.toString()
  });
}

async function uploadFiles(resource, languages, verbose) {
  for (const lang of languages) {
    const filename = path.join('src', 'assets', 'i18n', `${lang.attributes.code}.json`);
    if (!fs.existsSync(filename)) {
      continue;
    }
    if (verbose) {
      console.log(`Reading ${lang.attributes.code}.json...`);
    }
    const content = fs.readFileSync(filename);
    console.log(`Uploading ${lang.attributes.code}.json...`);
    await transifexApi.ResourceTranslationsAsyncUpload.upload({
      resource: resource,
      language: lang,
      content: content.toString()
    });
  }
}

async function downloadFiles(org, project, resource, languages, verbose) {
  for (const lang of languages) {
    if (verbose) {
      console.log(`Checking completeness of ${lang.attributes.code}.json...`);
    }
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
  // Parse the command line arguments
  const { token, action, verbose } = parseCliArgs();

  // Set up the Transifex API
  transifexApi.setup({auth: token});

  if (verbose) {
    console.log('Fetching organization, project and languages...');
  }
  const org = await transifexApi.Organization.get({slug: 'openlp'});
  const projects = await org.fetch('projects');
  const proj = await projects.get({slug: 'web-remote'});
  const resource = await transifexApi.Resource.get({project: proj, slug: 'i18n-strings'});
  const languages = await proj.fetch('languages');
  await languages.fetch();
  if (action == 'upload') {
    await uploadFiles(resource, languages.data, verbose);
  }
  else if (action == 'download') {
    await downloadFiles(org, proj, resource, languages.data, verbose);
  }
  else if (action == 'push') {
    await pushSource(resource, verbose);
  }
}

main();
