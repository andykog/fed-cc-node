const env = require('./dist/test/environment').default;
const {rpcServer, start} = env('dev');

const comments = [{text: 'My comment', author: 'Bla'}];

start().then(() => {
  rpcServer.when('CommentsService', 'fetch').respond(comments);
});
