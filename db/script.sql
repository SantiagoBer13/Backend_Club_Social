CREATE database if not exists clubSocial;
use clubSocial;

create table if not exists category(
	id int auto_increment not null,
    name varchar(50) not null,
    primary key(id)
);

ALTER TABLE news
CHANGE date dateNew date;

DROP TABLE news;

create table if not exists news(
	id int auto_increment not null,
    title varchar(50) not null,
    dateNew date not null,
    description varchar(1000) not null,
    idCategory int not null,
	img varchar(200) not null,
    foreign key(idCategory) references category(id),
    primary key(id)
);

INSERT INTO news (title, dateNew, description, idCategory, img) 
VALUES
  ("Exitoso Torneo de Tenis", "2023-11-01", "El Club Harmony celebró un torneo de tenis que atrajo a jugadores de todas las edades. La emoción y la competitividad estuvieron en su punto máximo, creando un día memorable lleno de grandes momentos.", 2, "https://acortar.link/WV84yV"),

  ("Noche de Gala: Celebración Cultural", "2023-10-15", "La Noche de Gala sumergió a nuestros miembros en una experiencia cultural inolvidable. Desde actuaciones artísticas hasta una exquisita cena, cada detalle contribuyó a una noche de elegancia y diversión compartida.", 1, "https://acortar.link/5SWChW"),

  ("Charla Inspiradora sobre Bienestar Mental", "2023-10-05", "Expertos en salud mental ofrecieron una charla enriquecedora sobre el bienestar mental. Los asistentes aprendieron técnicas prácticas para gestionar el estrés y fomentar la salud mental en su día a día.", 5, "https://acortar.link/vciZQQ"),

  ("Fiesta Temática de los 80", "2023-09-22", "Los miembros del Club Harmony revivieron los vibrantes años 80 en una fiesta temática llena de música, baile y atuendos retro. Una noche nostálgica que unió a la comunidad en la diversión.", 1, "https://acortar.link/v7YCil"),

  ("Curso de Cocina Gourmet", "2023-09-10", "Aficionados a la cocina se deleitaron con un curso de cocina gourmet dirigido por chefs expertos. Desde platos exquisitos hasta técnicas culinarias avanzadas, fue una experiencia deliciosa y educativa para todos los participantes.", 4, "https://acortar.link/EVm4ML"),

  ("Competencia de Karaoke Épica", "2023-08-28", "La competencia de karaoke atrajo a talentosos vocalistas que dejaron boquiabiertos a los espectadores. La diversión y la música resonaron en todo el club, creando una noche de risas y extraordinarias actuaciones.", 1, "https://acortar.link/3wLSiW"),

  ("Festival de Yoga al Aire Libre", "2023-08-15", "El Club Harmony organizó un festival de yoga al aire libre que combinó la serenidad del yoga con la belleza de la naturaleza. Los participantes se sumergieron en prácticas revitalizantes y conexiones espirituales.", 5, "https://acortar.link/JlXtR8"),

  ("Exposición de Arte Local", "2023-07-25", "Artistas locales tuvieron la oportunidad de exhibir sus obras en la emocionante Exposición de Arte del Club Harmony. Los miembros exploraron diversas expresiones artísticas, creando un ambiente cultural y apreciativo.", 3, "https://acortar.link/dJNAS6"),

  ("Noche de Trivia: Desafío Mental", "2023-07-10", "La Noche de Trivia desafió las mentes de los participantes con preguntas intrigantes y momentos de risas. Una competencia amigable que demostró que el conocimiento puede ser tan divertido como desafiante.", 2, "https://acortar.link/0fOuUU"),

  ("Torneo de Fútbol Infantil", "2023-06-18", "Los jóvenes futbolistas del Club Harmony demostraron su talento en un animado torneo infantil. La competencia estuvo llena de energía y espíritu deportivo, creando recuerdos duraderos para los participantes y espectadores.", 2, "https://acortar.link/Zwfh4v");


INSERT INTO category (name) 
VALUES 
  ("Social"),
  ("Deportivo"),
  ("Educativo"),
  ("Gastronomico"),
  ("Bienestar");
  
SELECT n.title, n.dateNew, n.description, c.name ,n.img FROM news n
INNER JOIN category c ON c.id = n.idCategory;  

create table if not exists events(
	id int auto_increment not null,
    dateCreated date not null,
    dateEvent date not null,
    organizer varchar(100) not null,
    description varchar(1000) not null,
    idCategory int not null,
	img varchar(200) not null,
    foreign key(idCategory) references category(id),
    primary key(id)
);

ALTER TABLE events
ADD COLUMN title VARCHAR(50);


create table if not exists users(
	id int auto_increment not null,
    name varchar(100) not null,
    surname varchar(100) not null,
    username varchar(100) not null,
    mail varchar(100) not null,
    registerDate date not null,
    password varchar(1000) not null,
    primary key(id)
);

create table if not exists inscriptions(
	id int auto_increment not null,
	idEvent int not null,
    idUser int not null,
    dateInscription date not null,
    foreign key(idEvent) references events(id),
    foreign key(idUser) references users(id),
    primary key(id)
);

SELECT n.id, n.title, n.dateNew, n.description, c.name as category,n.img FROM news n
INNER JOIN category c ON c.id = n.idCategory;

select e.id, e.title, e.dateEvent, c.name, e.organizer, e.img, e.description  from events e
inner join category c ON c.id = e.idCategory;

INSERT INTO events (dateCreated,  dateEvent, organizer, description, idCategory, img, title, hour)
values("2023-12-10","2023-12-24","Papa Noel", "¡Únete a nosotros en la mágica Fiesta de Navidad organizada por el mismísimo Papa Noel! 
Experimenta la alegría festiva con música, baile y sorpresas especiales para toda la familia. Este evento encantador crea un ambiente cálido 
y acogedor, lleno de la magia característica de la temporada. Disfruta de deliciosas delicias navideñas, actividades divertidas y la posibilidad 
de conocer a Santa Claus en persona. No te pierdas esta oportunidad de crear recuerdos inolvidables mientras celebramos juntos la maravilla de la 
Navidad.",1,"url","Fiesta de navidad",  );

UPDATE events
SET img = 'https://acortar.link/hDlRw8', hour = '19:30:00'
WHERE id = 1;

ALTER TABLE events
ADD COLUMN hour TIME;

SELECT e.id, e.title, e.description, e.dateEvent, e.hour, c.name AS category, e.organizer, e.img   FROM events e
INNER JOIN category c ON c.id = e.idCategory;