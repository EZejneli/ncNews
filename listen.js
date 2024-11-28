const app = require('./app');
const port = process.env.PORT || 9090;

app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on port ${port}...`);
});
