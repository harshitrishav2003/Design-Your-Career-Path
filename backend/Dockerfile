# Use Node.js 16 as base image
FROM node:20

# Install LaTeX packages and other required utilities
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      texlive-full \
      curl \
      wget \
      git \
      unzip \
      xz-utils \
      latexmk && \
    rm -rf /var/lib/apt/lists/*

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (to leverage Docker cache)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of your project files
COPY . .

# Make sure the resumes output directory is writable
RUN mkdir -p /app/resumes && chmod -R 777 /app/resumes

# Expose the port your app runs on
EXPOSE 5001

# Start the server using your actual entry point
CMD ["node", "src/index.js"]
