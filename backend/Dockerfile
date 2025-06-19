# Dockerfile for backend (Express + Bun)
FROM oven/bun:1.1.0

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --production

COPY . .

EXPOSE 4000

CMD ["bun", "run", "start"]
