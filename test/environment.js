import testkit from 'wix-bootstrap-testkit';
import configEmitter from 'wix-config-emitter';
import rpcTestkit from 'wix-rpc-testkit';

const config = {
  default: {port: 3100, managementPort: 3104, rpcServerPort: 3300, boAuthServerPort: 3400, petriServerPort: 3020, targetFolder: './target/configs/default'},
  dev: {port: 3000, managementPort: 3105, rpcServerPort: 3301, boAuthServerPort: 3401, petriServerPort: 3021, targetFolder: './target/configs/dev'},
  https: {port: 3102, managementPort: 3106, rpcServerPort: 3302, boAuthServerPort: 3402, petriServerPort: 3022, targetFolder: './target/configs/https'}
};

export default function create(env = 'default') {
  const https = (env === 'https');
  const {port, managementPort, rpcServerPort, targetFolder} = config[env];
  const server = bootstrapServer({port, managementPort, targetFolder, https});
  const rpcServer = rpcTestkit.server({port: rpcServerPort});
  return {
    server,
    rpcServer,
    beforeAndAfter() {
      before(() => emitConfigs({rpcServerPort, targetFolder}));
      rpcServer.beforeAndAfter();
      server.beforeAndAfter();
    },
    start() {
      return Promise
        .all([
          emitConfigs({rpcServerPort, targetFolder}),
          rpcServer.start(),
        ])
        .then(() => server.start());
    }
  };
}

function emitConfigs({rpcServerPort, targetFolder}) {
  return configEmitter({sourceFolders: ['./templates'], targetFolder})
    .fn('scripts_domain', 'static.parastorage.com')
    .fn('static_url', 'com.wixpress.fed-crash-course-node-workshop', 'http://localhost:3200/')
    .fn('rpc_service_url', 'com.wixpress.npm.node-workshop-scala-app', `http://localhost:${rpcServerPort}/`)
    .emit();
}

function bootstrapServer({port, managementPort, targetFolder, https}) {
  return testkit.app('./index', {
    env: {
      PORT: port,
      MANAGEMENT_PORT: managementPort,
      APP_CONF_DIR: targetFolder,
      WIX_ENABLE_REQUIRE_HTTPS: https,
      NEW_RELIC_LOG_LEVEL: 'warn',
      DEBUG: ''
    }
  });
}
