/* Replace with your SQL commands */
/* Replace with your SQL commands */
create table admins(id serial primary key, f_name varchar(50), l_name varchar(50), email varchar(150) unique not null, address text, salary float, password varchar(150) not null, birthday date, phone varchar(12),status varchar(50), created_at timestamp);
create table types (id serial primary key, type varchar(100)unique not null, description text);
create table users(id serial primary key, f_name varchar(50), l_name varchar(50), email varchar(150) unique not null, rate int, description text, images text[], role varchar(100), password varchar(150) not null, birthday date, phone varchar(12),status varchar(50), created_at timestamp,city varchar(150), admin_id bigint references admins(id)on delete set null, address varchar(500), type_id bigint references types(id)on delete set null);
create table charity (id serial primary key, images text[], status varchar(50), description text, needy_id bigint references users(id)on delete set null, volanteer_id bigint references users(id)on delete set null);
create table links(id serial primary key, link varchar(100) unique not null, user_id bigint references users(id)on delete cascade);
create table comment(id serial primary key, message text, created_time timestamp, user_id bigint references users(id)on delete cascade, charity_id bigint references charity(id)on delete cascade);
