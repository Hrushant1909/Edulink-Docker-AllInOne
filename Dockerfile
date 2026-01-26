FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    gnupg \
    openjdk-17-jdk \
    maven \
    nginx \
    mysql-server \
    supervisor \
    && apt-get clean

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && node -v \
    && npm -v

WORKDIR /app

COPY EdLink ./backend
COPY edulink-frontend ./frontend

COPY nginx.conf /etc/nginx/sites-enabled/default
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY init.sql /app/init.sql

WORKDIR /app/backend
RUN mvn clean package -DskipTests

RUN mkdir -p /app/backend && cp target/*.jar /app/backend/app.jar

WORKDIR /app/frontend
RUN npm install
RUN npm run build

RUN mkdir -p /var/www/edulink-frontend \
    && cp -r /app/frontend/dist/* /var/www/edulink-frontend

EXPOSE 8090 5173 3306

CMD ["/usr/bin/supervisord"]
