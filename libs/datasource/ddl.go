package datasource

var engineDDL = `
create table if not exists "user" (
    id varchar not null primary key,
    username varchar(100) not null unique,
    password varchar not null,
    role varchar(100) not null,
    apps json,
    "createdAt" timestamp not null default current_timestamp,
    "updatedAt" timestamp not null default current_timestamp,
    "addedBy" varchar references "user" (id)
);

create table if not exists app (
    id varchar not null primary key,
    key varchar not null unique,
    name varchar(100) not null,
    "createdAt" timestamp not null default current_timestamp,
    "updatedAt" timestamp not null default current_timestamp,
    admin varchar not null references "user" (id)
);

create table if not exists log (
    id varchar not null primary key,
    level varchar(50) not null,
    pid varchar,
    hostname varchar,
    ts timestamp,
    message text,
    "createdAt" timestamp not null default current_timestamp,
    "updatedAt" timestamp not null default current_timestamp,
    "appId" varchar not null references app (id)
);

create table if not exists token (
    id varchar not null primary key,
    token varchar not null,
    "userId" varchar not null references "user" (id),
    "createdAt" timestamp not null default current_timestamp,
    "updatedAt" timestamp not null default current_timestamp,
    "expiredAt" timestamp not null
);
`
