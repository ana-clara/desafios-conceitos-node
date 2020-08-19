const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
var idArray = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  idArray.find((v) => v==id);

  if (!isUuid(id)) {
      return response.status(400).json({ error: 'Invalid project ID.' });
  }

  return next();
}

app.use('/repositories/:id', validateRepositoryId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const id = uuid();
  idArray.push(id);
  const repository = { id: id, title, url, techs, likes: 0 }; 

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found'});
  }

repositories[repositoryIndex].title = title;
repositories[repositoryIndex].url = url;
repositories[repositoryIndex].techs = techs;

return response.json(repositories[repositoryIndex]);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
      return response.status(400).json({ error: 'repository not found'});
  }

  var repository = JSON.parse(JSON.stringify(repositories[repositoryIndex]));
  console.log(repositories[repositoryIndex]);
  repository.likes++;

  console.log(repository.likes);
  repositories.unshift(repository);
  return response.json(repository);

});

module.exports = app;
