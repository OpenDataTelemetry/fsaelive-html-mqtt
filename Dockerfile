# Base Image
FROM nginx:stable-alpine3.21-perl

# Copy the index.html file to the Nginx HTML directory
COPY . /usr/share/nginx/html/

# Expose Nginx Port
EXPOSE 80

# Start Nginx Service
CMD ["nginx", "-g", "daemon off;"]