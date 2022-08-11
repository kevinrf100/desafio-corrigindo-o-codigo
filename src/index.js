const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

function checkRepositoryExists(request, response, next) {
  const{ id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repository = repository;
  
  next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checkRepositoryExists, (request, response) => {
  const repositoryData = request.body;
  let { repository } = request;
  
  if(repositoryData.likes) {
    delete repositoryData.likes
  }

  repository = { ...repository, ...repositoryData };

  return response.json(repository);
});

app.delete("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { repository: repositoryByID } = request;
  
  const index = repositories.findIndex(repository => repository.id === repositoryByID.id);
  
  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkRepositoryExists, (request, response) => {
  const { repository } = request;

  repository.likes++;

  return response.json(repository);
});

module.exports = app;
