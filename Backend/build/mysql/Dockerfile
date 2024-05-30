FROM mysql:latest
USER root

RUN chmod -R 755 /docker-entrypoint-initdb.d/

# Copy the database initialization script
COPY ./initdb.d /docker-entrypoint-initdb.d/


RUN chmod 755 /var/lib/mysql

RUN mysql -u root -p1234
RUN SET GLOBAL local_infile=1;
RUN exit
RUN mysql --local-infile=1 -u root -p1234


RUN CREATE DATABASE IF NOT EXISTS `testDatabase`;
RUN USE `testDatabase`;

RUN CREATE TABLE IF NOT EXISTS my_table (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL
);

RUN LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/data.csv'
INTO TABLE my_table
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;


RUN GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '1234' WITH GRANT OPTION;
FLUSH PRIVILEGES;

