-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-12-2021 a las 22:56:04
-- Versión del servidor: 10.4.22-MariaDB
-- Versión de PHP: 8.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `404db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medallaspreg`
--

CREATE TABLE `medallaspreg` (
  `idpregunta` int(11) NOT NULL,
  `idmedalla` int(11) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medallasres`
--

CREATE TABLE `medallasres` (
  `idrespuesta` int(11) NOT NULL,
  `idmedalla` int(11) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `idpregunta` int(100) NOT NULL,
  `idusuario` int(100) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `cuerpo` varchar(2000) NOT NULL,
  `fecha` date NOT NULL,
  `puntos` int(10) NOT NULL DEFAULT 0,
  `visitas` int(10) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `preguntas`
--

INSERT INTO `preguntas` (`idpregunta`, `idusuario`, `titulo`, `cuerpo`, `fecha`, `puntos`, `visitas`) VALUES
(19, 13, '¿Cual es la diferencia entre position: relative, position: absolute y position: fixed?', 'Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página. Sé\r\nque estas propiedades de CSS sirven para posicionar un elemento dentro de la página.', '2021-12-15', 0, 0),
(20, 17, '¿Qué es la inyección SQL y cómo puedo evitarla?', 'He encontrado bastantes preguntas en StackOverflow sobre programas o formularios web que\r\nguardan información en una base de datos (especialmente en PHP y MySQL) y que contienen\r\ngraves problemas de seguridad relacionados principalmente con la inyección SQL.\r\nNormalmente dejo un comentario y/o un enlace a una referencia externa, pero un comentario\r\nno da mucho espacio para mucho y sería positivo que hubiera una referencia interna en SOes\r\nsobre el tema así que decidí escribir esta pregunta.', '2021-12-15', 0, 0),
(21, 14, '¿Cómo funciona exactamente nth-child?', 'No acabo de comprender muy bien que hace exactamente y qué usos prácticos puede tener.', '2021-12-15', 0, 0),
(22, 15, 'Diferencias entre == y === (comparaciones en JavaScript)', 'Siempre he visto que en JavaScript hay:\r\nasignaciones =\r\ncomparaciones == y ===\r\nCreo entender que == hace algo parecido a comparar el valor de la variable y el === también\r\ncompara el tipo (como un equals de java).', '2021-12-15', 0, 0),
(23, 16, 'Problema con asincronismo en Node', 'Soy nueva en Node... Tengo una modulo que conecta a una BD de postgres por medio de pgnode. En eso no tengo problemas. Mi problema es que al llamar a ese modulo, desde otro\r\nmodulo, y despues querer usar los datos que salieron de la BD me dice undefined... Estoy casi\r\nseguro que es porque la conexion a la BD devuelve una promesa, y los datos no estan\r\ndisponibles al momento de usarlos.\r\n', '2021-12-15', 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas`
--

CREATE TABLE `respuestas` (
  `idrespuesta` int(100) NOT NULL,
  `respuesta` varchar(1000) NOT NULL,
  `idusuario` int(100) NOT NULL,
  `idpregunta` int(100) NOT NULL,
  `puntos` int(10) NOT NULL DEFAULT 0,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `respuestas`
--

INSERT INTO `respuestas` (`idrespuesta`, `respuesta`, `idusuario`, `idpregunta`, `puntos`, `fecha`) VALUES
(5, 'La propiedad position sirve para posicionar un elemento dentro de la página. Sin embargo,\r\ndependiendo de cual sea la propiedad que usemos, el elemento tomará una referencia u otra\r\npara posicionarse respecto a ella.\r\nLos posibles valores que puede adoptar la propiedad position son: static | relative | absolute |\r\nfixed | inherit | initial.', 17, 19, 0, '2021-12-15'),
(6, 'La pseudoclase :nth-child() selecciona los hermanos que cumplan cierta condición definida en\r\nla fórmula an + b. a y b deben ser números enteros, n es un contador. El grupo an representa\r\nun ciclo, cada cuantos elementos se repite; b indica desde donde empezamos a contar.\r\n', 19, 21, 0, '2021-12-15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('956UDFuvR-xT7MiZ9JoJ0ocJ8ZxCX4fR', 1639687370, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"email\":\"marta@404.es\",\"password\":\"Aa1234\",\"name\":\"Marta\",\"userId\":16,\"image\":\"ACQP74GDK5E6RJGKX5RGIWCJTA.jpg\",\"date\":\"2021-12-14T23:00:00.000Z\",\"reputation\":1}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tagpreg`
--

CREATE TABLE `tagpreg` (
  `idpregunta` int(100) NOT NULL,
  `idtag` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tagpreg`
--

INSERT INTO `tagpreg` (`idpregunta`, `idtag`) VALUES
(19, 34),
(19, 35),
(20, 36),
(20, 37),
(21, 34),
(21, 38),
(22, 40),
(23, 41);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tags`
--

CREATE TABLE `tags` (
  `idtag` int(100) NOT NULL,
  `texto` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tags`
--

INSERT INTO `tags` (`idtag`, `texto`) VALUES
(34, 'css'),
(35, 'css3'),
(38, 'html'),
(40, 'JavaScript'),
(36, 'mysql'),
(41, 'nodejs'),
(37, 'sql');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idusuario` int(100) NOT NULL,
  `correo` varchar(50) NOT NULL,
  `contraseña` varchar(50) NOT NULL,
  `nickname` varchar(20) NOT NULL,
  `imagen` varchar(1000) DEFAULT NULL,
  `fecha` date NOT NULL,
  `reputacion` int(100) NOT NULL DEFAULT 1,
  `activo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idusuario`, `correo`, `contraseña`, `nickname`, `imagen`, `fecha`, `reputacion`, `activo`) VALUES
(13, 'nico@404.es', 'Aa1234', 'Nico', '15861269099197.jpg', '2021-12-15', 1, 1),
(14, 'roberto@404.es', 'Aa1234', 'Roberto', 'FhTCnY83_400x400.jpg', '2021-12-15', 1, 1),
(15, 'sfg@404.es', 'Aa1234', 'SFG', 'tomas_roncero.png', '2021-12-15', 1, 1),
(16, 'marta@404.es', 'Aa1234', 'Marta', 'ACQP74GDK5E6RJGKX5RGIWCJTA.jpg', '2021-12-15', 1, 1),
(17, 'lucas@404.es', 'Aa1234', 'Lucas', 'LYWGGXLWBFFETBWY5HGU5C7IDA.jpg', '2021-12-15', 1, 1),
(19, 'emy@404.es', 'Aa1234', 'Emy', '8650069c-b263-45b8-9cdb-91e004e6c130_16-9-aspect-ratio_default_0.jpg', '2021-12-15', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votospreg`
--

CREATE TABLE `votospreg` (
  `idusuario` int(11) NOT NULL,
  `idpregunta` int(11) NOT NULL,
  `positivo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votosres`
--

CREATE TABLE `votosres` (
  `idusuario` int(11) NOT NULL,
  `idrespuesta` int(11) NOT NULL,
  `positivo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medallaspreg`
--
ALTER TABLE `medallaspreg`
  ADD KEY `preg-medalla` (`idpregunta`);

--
-- Indices de la tabla `medallasres`
--
ALTER TABLE `medallasres`
  ADD KEY `res-medalla` (`idrespuesta`);

--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`idpregunta`),
  ADD KEY `idusuario_preguntas_fk` (`idusuario`);

--
-- Indices de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD PRIMARY KEY (`idrespuesta`),
  ADD KEY `idpregunta_respuestas_fk` (`idpregunta`),
  ADD KEY `idusuario_respuestas_fk` (`idusuario`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `tagpreg`
--
ALTER TABLE `tagpreg`
  ADD PRIMARY KEY (`idpregunta`,`idtag`) USING BTREE,
  ADD KEY `idtag_tag-preg_fk` (`idtag`),
  ADD KEY `idpregunta_tag-preg-fk` (`idpregunta`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`idtag`),
  ADD UNIQUE KEY `texto` (`texto`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idusuario`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indices de la tabla `votospreg`
--
ALTER TABLE `votospreg`
  ADD KEY `usuario_voto_preg` (`idusuario`),
  ADD KEY `voto_preg` (`idpregunta`);

--
-- Indices de la tabla `votosres`
--
ALTER TABLE `votosres`
  ADD KEY `usuario_voto_res` (`idusuario`),
  ADD KEY `voto_res` (`idrespuesta`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `idpregunta` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `idrespuesta` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `tags`
--
ALTER TABLE `tags`
  MODIFY `idtag` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idusuario` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `medallaspreg`
--
ALTER TABLE `medallaspreg`
  ADD CONSTRAINT `preg-medalla` FOREIGN KEY (`idpregunta`) REFERENCES `preguntas` (`idpregunta`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `medallasres`
--
ALTER TABLE `medallasres`
  ADD CONSTRAINT `res-medalla` FOREIGN KEY (`idrespuesta`) REFERENCES `respuestas` (`idrespuesta`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD CONSTRAINT `idusuario_preguntas_fk` FOREIGN KEY (`idusuario`) REFERENCES `usuario` (`idusuario`);

--
-- Filtros para la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD CONSTRAINT `idpregunta_respuestas_fk` FOREIGN KEY (`idpregunta`) REFERENCES `preguntas` (`idpregunta`),
  ADD CONSTRAINT `idusuario_respuestas_fk` FOREIGN KEY (`idusuario`) REFERENCES `usuario` (`idusuario`);

--
-- Filtros para la tabla `tagpreg`
--
ALTER TABLE `tagpreg`
  ADD CONSTRAINT `idpregunta_tag-preg_fk` FOREIGN KEY (`idpregunta`) REFERENCES `preguntas` (`idpregunta`),
  ADD CONSTRAINT `idtag_tag-preg_fk` FOREIGN KEY (`idtag`) REFERENCES `tags` (`idtag`);

--
-- Filtros para la tabla `votospreg`
--
ALTER TABLE `votospreg`
  ADD CONSTRAINT `usuario_voto_preg` FOREIGN KEY (`idusuario`) REFERENCES `usuario` (`idusuario`),
  ADD CONSTRAINT `voto_preg` FOREIGN KEY (`idpregunta`) REFERENCES `preguntas` (`idpregunta`);

--
-- Filtros para la tabla `votosres`
--
ALTER TABLE `votosres`
  ADD CONSTRAINT `usuario_voto_res` FOREIGN KEY (`idusuario`) REFERENCES `usuario` (`idusuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `voto_res` FOREIGN KEY (`idrespuesta`) REFERENCES `respuestas` (`idrespuesta`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
