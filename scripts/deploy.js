const util = require('util');
const exec = util.promisify(require('child_process').exec);

function createExecuter(cmd) {
  console.log('createExecuter for', cmd);
  return async function execute() {
    const {
      stdout,
      stderr
    } = await exec(cmd);

    if(stdout) {
      console.log('stdout:', stdout);
    }

    if(stderr) {
      console.log('stderr:', stderr);
    }

    if (stderr) {
      throw new Error(stderr);
    }
  }
}

const dockerBuild = createExecuter('docker build --no-cache -f Dockerfile.alpine -t cryptobuddy-pwa .');
const dockerTagImage = createExecuter('docker tag cryptobuddy-pwa:latest registry.heroku.com/cryptobuddy-pwa/web');
const dockerPushImage = createExecuter('docker push registry.heroku.com/cryptobuddy-pwa/web');

try {
  console.log('Build Docker Image');
  dockerBuild();
  console.log('Tag Docker Image');
  dockerTagImage();
  console.log('Push Docker Image to Heroku Registry');
  dockerPushImage();
} catch (e) {
  console.error('Deploy failed', e);
}
