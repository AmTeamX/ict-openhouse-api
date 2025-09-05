# Use Bun official image
FROM oven/bun:1.1.13

WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lockb ./
RUN bun install --production

# Copy source code
COPY . .

# Expose the port (default 5001)
EXPOSE 5001

# Start the application
CMD ["bun", "src/index.ts"]
