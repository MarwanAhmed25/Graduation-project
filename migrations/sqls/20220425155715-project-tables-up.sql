/* Replace with your SQL commands */
/* Replace with your SQL commands */
create table admins(admin_id serial primary key,slug varchar(255) not null, full_name varchar(255), email varchar(150) unique not null, address text, salary float, password varchar(255) not null, birthday date, phone varchar(15),status varchar(50), created_at timestamp);
create table types (id serial primary key,slug varchar(100) not null, type varchar(100)unique not null, description text, image varchar(200));
create table users(id serial primary key,slug varchar(255) not null, full_name varchar(50), email varchar(150) unique not null, id_image varchar, verified_image boolean, verified_email boolean, verified_phone boolean,profile_image varchar, role varchar(100), password varchar(150) not null, birthday date, phone varchar(12),status varchar(50), created_at timestamp,city varchar(150), address varchar(500));
create table charity_case (id serial primary key, images text[],slug varchar(200) not null, title varchar(200), remaining float,value_of_need float,status varchar(50), description text, needy_id bigint references users(id)on delete cascade, type_id bigint references types(id)on delete set null);
create table links(id serial primary key, link varchar(100) unique not null, user_id bigint references users(id)on delete cascade);
create table comment(id serial primary key,slug varchar not null, intro varchar, message text, created_time timestamp, user_id bigint references users(id)on delete cascade, charity_id bigint references charity_case(id)on delete cascade);
create table volantary_history (id serial primary key, amount float, volanteer_id bigint references users(id)on delete cascade, charity_case_id bigint references charity_case(id)on delete set null);
create table volanteer_help (id serial primary key , number_of_help int, total_help float, volanteer_id bigint references users(id)on delete cascade unique not null);


