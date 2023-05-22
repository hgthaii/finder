FROM node:latest
WORKDIR /tmp/server
COPY package.json package-lock.json .
COPY . .
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]

# Build
# docker build -t server .

# Khởi tạo và chạy container từ image server
# docker run -dt -p 5000:5000 --name server server:latest

# Xem các file được lưu trong container
# docker exec -it -u root server /bin/bash
