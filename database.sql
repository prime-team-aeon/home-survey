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
    role VARCHAR(80)
);
CREATE TABLE occupancy
(
    id SERIAL PRIMARY KEY,
    property VARCHAR(255) NOT NULL,
    unit INT,
    responded VARCHAR(80),
    paid VARCHAR(80),
    occupied VARCHAR(80),
    year INT NOT NULL
);
CREATE TABLE responses
(
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    answer TEXT NOT NULL,
    property VARCHAR(255) NOT NULL,
    question_id INT REFERENCES questions
);
CREATE TABLE occupancy_users
(
    occupancy_id INT REFERENCES occupancy,
    user_id INT REFERENCES users,
    PRIMARY KEY(occupancy_id, user_id)
);