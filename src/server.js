import 'regenerator-runtime/runtime';
import wixRunMode from 'wix-run-mode';
import ejs from 'ejs';
import wixExpressCsrf from 'wix-express-csrf';
import wixExpressRequireHttps from 'wix-express-require-https';
import bodyParser from 'body-parser';
import {readFileSync} from 'fs';

module.exports = (app, context) => {
  const config = context.config.load('fed-crash-course-node-workshop');
  const templatePath = './src/index.ejs';
  const templateFile = readFileSync(templatePath, 'utf8');
  const isProduction = wixRunMode.isProduction();

  app.use(wixExpressCsrf());
  app.use(wixExpressRequireHttps);
  app.use(bodyParser.json());

  app.get('/api/comments/:id', async (req, res) => {
    const comments = await context.rpc.clientFactory(config.comments, 'CommentsService')
      .client(req.aspects)
      .invoke('fetch', req.params.id);
    res.json(comments);
  });

  app.post('/api/comments/:id', async (req, res) => {
    const client = context.rpc.clientFactory(config.comments, 'CommentsService').client(req.aspects);
    console.log(req.body);
    await client.invoke('add', req.params.id, req.body);
    const comments = await client.invoke('fetch', req.params.id);
    res.json(comments);
  });

  app.get('/', (req, res) => {
    const renderModel = getRenderModel(req);
    const html = ejs.render(templateFile, renderModel, {cache: isProduction, filename: templatePath});
    res.send(html);
  });


  function getRenderModel(req) {
    return {
      locale: req.aspects['web-context'].language,
      basename: req.aspects['web-context'].basename,
      debug: req.aspects['web-context'].debug || process.env.NODE_ENV === 'development',
      clientTopology: config.clientTopology,
      title: 'Wix Full Stack Project Boilerplate'
    };
  }

  return app;
};
