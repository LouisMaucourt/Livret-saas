FROM oven/bun:1

WORKDIR /

COPY . .

RUN bun install

COPY . .

RUN bun run build

EXPOSE 3000

CMD ["bun", "src/index.tsx"]