FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

RUN bun run build

EXPOSE 3001

CMD ["bun", "src/index.tsx"]