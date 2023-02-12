CREATE TABLE movies_users (
    id SERIAL PRIMARY KEY,
    want_to_watch VARCHAR(64),
    watched_before VARCHAR(64),
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    CONSTRAINT fk_users
        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    CONSTRAINT fk_movies
        FOREIGN KEY (movie_id)
            REFERENCES movies(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
);
