FROM node:16

# Install LaTeX packages (texlive-full to avoid missing dependencies) Change the latex compiler whenever you feel your current latex is consuming a lot of time in compilation because pdfLatex compilation is slow a bit 
# Here I am 
RUN apt-get update && apt-get install -y \
    texlive-full \
    curl \
    wget \
    git \
    unzip \
    xz-utils \
    latexmk \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container 
WORKDIR /app

# Copy package.json and package-lock.json first for dependency installation
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code If you are adding extra things or packages at your backend dont forger to include it in your dockerfile
COPY . .

# Ensure the LaTeX output directory is writable Because some VPS Server block write operation by default
RUN chmod -R 777 /app/resumes

# Expose the port the app runs on It's Optional but necessary Whenever you try to run your Container at your local computer 
EXPOSE 5001

# Start the server 
CMD ["node", "server.js"]

# To Run this code in docker at your local computer Try These commands After installing docker at your computer 
# docker build -t resume-generator 
# docker run -p 5001:5001 resume-generator

# You can change the name of resume-generator But it must be same for both build and run command or also you can use docker container id by fetching container ID using this commandn [docker ps]
# If any Issue happens feel free to connect or if you need optimization in your server also you can ask for it.