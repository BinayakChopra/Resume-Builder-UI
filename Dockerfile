FROM php:8.1-apache

# Install mysqli extension for PHP
RUN docker-php-ext-install mysqli

# Enable mod_rewrite (for .htaccess support)
RUN a2enmod rewrite

# Copy app code to Apache server root
COPY . /var/www/html/

# Set working directory
WORKDIR /var/www/html/

# Open port 80
EXPOSE 80
