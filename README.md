# Lilian

This is a bot that brings pronouns.page into Discord!

## Running the bot

Running the bot is very simple, just pull the docker image and run it with your token.

```bash
docker pull ghcr.io/astridlol/lilian:main

docker run \
   --name lilian \
   -e TOKEN=<YOUR_TOKEN> \
   -d \
   --restart always \
   ghcr.io/astridlol/lilian:main
```
