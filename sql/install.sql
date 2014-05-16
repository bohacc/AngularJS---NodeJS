create database mbsystemdb;
CREATE ROLE mbsystem WITH PASSWORD 'Mata553.*' LOGIN;
CREATE SCHEMA mbsystem AUTHORIZATION mbsystem;
GRANT ALL ON SCHEMA mbsystem TO mbsystem;

-- Uzivatele
CREATE ROLE mbsystem_celikovsky WITH PASSWORD 'Celikovsky.*' LOGIN;
CREATE SCHEMA mbsystem_celikovsky AUTHORIZATION mbsystem_celikovsky;
GRANT ALL ON SCHEMA mbsystem_celikovsky TO mbsystem_celikovsky;