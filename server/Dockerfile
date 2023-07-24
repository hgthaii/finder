FROM node:14.21.2
WORKDIR /tmp/server
COPY package.json package-lock.json .
COPY . .

ARG MONGODB_URL
ARG TOKEN_SECRET
ARG CLIENT_ID
ARG CLIENT_SECRET
ARG FROM_EMAIL
ARG TO_EMAIL
ARG PASSWORD_EMAIL
ARG SENDGRID_API_KEY

ENV MONGODB_URL=${MONGODB_URL}
ENV TOKEN_SECRET=${TOKEN_SECRET}
ENV CLIENT_ID=${CLIENT_ID}
ENV CLIENT_SECRET=${CLIENT_SECRET}
ENV FROM_EMAIL=${FROM_EMAIL}
ENV TO_EMAIL=${TO_EMAIL}
ENV PASSWORD_EMAIL=${PASSWORD_EMAIL}
ENV SENDGRID_API_KEY=${SENDGRID_API_KEY}

RUN npm install
EXPOSE 5000
CMD ["npm", "start"]

# Build
# docker build -t server .

# Khởi tạo và chạy container từ image server
# docker run -dt -p 5000:5000 --name server server:latest

# Xem các file được lưu trong container
# docker exec -it -u root server /bin/bash
