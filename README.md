# Lilian

This is a bot that brings pronouns.page into Discord!

## Invite the bot

You can invite the bot [here](https://bit.ly/3I3IWnN), top.gg link will come soon.

## Running the bot

If you don't want to use the hosted version, you can run your own instance pretty simply.

### Run the container

First, create a folder and put the docker-compose.yml file inside it, as well as a `.env` with your bot token. Then:

```bash
# Pull the docker image
docker pull ghcr.io/astridlol/lilian:main

# Run a container with the image
docker compose up
```
