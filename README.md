# Lilian

This is a bot that brings pronouns.page into Discord!

## Running the bot

Running the bot is very simple.

### Create a volume

Lilain uses SQLite for data storage, so a volume is needed in order to use it with Docker.

```bash
docker volume create lilian
```

### Run the container

```bash
# Pull the docker image
docker pull ghcr.io/astridlol/lilian:main

# Run a container with the image
docker run --name lilian -e TOKEN=[your token] -v lilian:/app -d --restart always ghcr.io/astridlol/lilian:main
```
