CREATE TABLE questions
(
    id SERIAL PRIMARY KEY,
    english VARCHAR(255) NOT NULL,
    spanish VARCHAR(255) NOT NULL,
    somali VARCHAR(255) NOT NULL,
    hmong VARCHAR(255) NOT NULL,
    tag VARCHAR(80) NOT NULL
);
CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(80) NOT NULL
);
CREATE TABLE properties
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(80),
    zip INT
);
CREATE TABLE occupancy_2017
(
    id SERIAL PRIMARY KEY,
    unit INT,
    responded VARCHAR(80),
    paid VARCHAR(80),
    occupied VARCHAR(80),
    property_id INT REFERENCES properties
);
CREATE TABLE responses
(
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    answer TEXT NOT NULL,
    question_id INT REFERENCES questions,
    property_id INT REFERENCES properties
);
CREATE TABLE occupancy_users
(
    occupancy_id INT REFERENCES occupancy_2017,
    user_id INT REFERENCES users,
    PRIMARY KEY(occupancy_id, user_id)
);