-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users, posts, comments, boards CASCADE;

CREATE TABLE users (
    user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    github TEXT NOT NULL,
    email TEXT,
    avatar TEXT,
    repos BIGINT,
    bio TEXT,
    member_since TEXT,
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (github, email, avatar, repos, bio, member_since)
VALUES ('fakename', 'fakememail@gmail.com', 'https://avatars.githubusercontent.com/u/79884362?v=4', 75, 'bio', '2021-03-02T01:35:50Z');

CREATE TABLE posts (
    post_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    posted_by BIGINT NOT NULL,
    title TEXT,
    code TEXT,
    question TEXT,
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users
    (user_id)
);

-- INSERT INTO posts (posted_by, title, code, question)
-- VALUES (1, 'Help me', 'array.prototype', 'What is a prototype of an Array?');

CREATE TABLE comments (
    comment_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    commenter BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    comment TEXT,
    parent BIGINT,
    favorited BOOLEAN,
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (commenter) REFERENCES users(user_id),
    FOREIGN KEY (parent) REFERENCES comments(comment_id)
);

INSERT INTO comments (commenter, post_id, comment, parent, favorited)
VALUES (1, 1, 'The JS array prototype constructor is used to allow new methods to the Array object', null, false);



CREATE TABLE boards (
    board_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_by BIGINT NOT NULL,
    title TEXT,
    summary TEXT,
    goal TEXT,
    group_size INT,
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- INSERT INTO boards (created_by, title, summary, goal, group_size)
-- VALUES (1, 'miro makeover', 'create a better miro board', 'full stack app', 4);


