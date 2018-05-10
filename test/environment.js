import testkit from 'wix-bootstrap-testkit';
import configEmitter from 'wix-config-emitter';
import rpcTestkit from 'wix-rpc-testkit';

export const app = bootstrapServer();
export const rpcServer = rpcTestkit.server();

export function beforeAndAfter() {
  before(() => emitConfigs());
  app.beforeAndAfter();
  rpcServer.beforeAndAfter();
}

function emitConfigs() {
  return configEmitter({sourceFolders: ['./templates'], targetFolder: './target/configs'})
    .fn('scripts_domain', 'static.parastorage.com')
    .fn('static_url', 'com.wixpress.fed-crash-course-node-workshop', 'http://localhost:3200/')
    .fn('rpc_service_url', 'com.wixpress.npm.node-workshop-scala-app', rpcServer.getUrl())
    .emit();
}

function bootstrapServer() {
  return testkit.app('./index', {
    env: {
      PORT: 3100,
      MANAGEMENT_PORT: 3104,
      NEW_RELIC_LOG_LEVEL: 'warn',
      DEBUG: ''
    }
  });
}
