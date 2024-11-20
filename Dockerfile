
FROM node:20
RUN apt-get update && apt-get install -y tzdata
ENV TZ=Africa/Nairobi
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
