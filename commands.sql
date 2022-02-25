create table blogs (id serial primary key, author text, url text not null, title text not null, likes integer default 0);

insert into blogs (author, url, title) values ('Matti Meikäläinen','www.awsomeblog.fi','Awsome blog');
insert into blogs (author, url, title, likes) values ('Tonnin Seteli','www.tonninseteli.fi','Mä annoin sulle tonnin setelin',1000);