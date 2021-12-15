-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-12-2021 a las 02:58:15
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
(1, 1, 'a', 'a', '2021-11-23', 0, 0),
(13, 2, 'paaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '2021-12-10', 0, 0),
(14, 2, 'pssssssss', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '2021-10-06', 0, 0),
(15, 2, 'saaaaaaaaaa', 'asssssssasas', '2021-08-05', 0, 0),
(16, 2, 'termo es un crack?', 'no se sabe, que opinais?', '2021-11-25', 0, 0),
(17, 1, '150caracteres', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '2021-12-08', 0, 0),
(18, 1, 'Pregunta seria', 'En la figura 3 se muestra la página principal del sitio. Se puede observar que dispone de un menú situado en\r\nla parte superior izquierda y la identificación del usuario situada en la parte superior derecha.\r\n4\r\nLa identificación del usuario contiene el nombre y la imagen de perfil. Al pulsar sobre el nombre, se mostrará\r\nla página de perfil de usuario (figura 10).\r\nEl menú tiene tres opciones: “Preguntas”, “Sin responder” y “Usuarios”. En los siguientes apartados se explica\r\nsu funcionamiento.\r\nDebajo del menú, se sitúa la barra de búsqueda formada por un campo de texto que permite definir las\r\npalabras por las que se quiere buscar en la base de datos de preguntas y el botón “Buscar” que desencadena\r\nla búsqueda.\r\n', '2021-12-08', 0, 0);

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
(2, 'adios', 1, 13, 0, '2021-12-10'),
(3, 'mirespuesta', 1, 18, 0, '2021-12-11'),
(4, 'En la figura 3 se muestra la página principal del sitio. Se puede observar que dispone de un menú situado en la parte superior izquierda y la identificación del usuario situada en la parte superior derecha. 4 La identificación del usuario contiene el nombre y la imagen de perfil. Al pulsar sobre el nombre, se mostrará la página de perfil de usuario (figura 10). El menú tiene tres opciones: “Preguntas”, “Sin responder” y “Usuarios”. En los siguientes apartados se explica su funcionamiento. Debajo del menú, se sitúa la barra de búsqueda formada por un campo de texto que permite definir las palabras por las que se quiere buscar en la base de datos de preguntas y el botón “Buscar” que desencadena la búsqueda.', 1, 18, 0, '2021-12-11');

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
('VqR4P7zVUs96hIwWpB-4L_6v3_NNEfbP', 1639543377, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"email\":\"qqq\",\"password\":\"123\",\"name\":\"qqq\",\"userId\":3,\"image\":\"nico.png\",\"date\":\"2021-12-05T23:00:00.000Z\",\"reputation\":1}'),
('iEGvqeYS_iPJ7bwsNnDdY9QaOpPsbLwq', 1639618555, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"email\":\"aaa\",\"password\":\"1Aaaaa\",\"name\":\"asas\",\"userId\":10,\"image\":\"nico.png\",\"date\":\"2021-12-05T23:00:00.000Z\",\"reputation\":1}'),
('z23dJ3t66uP1HA6WBG1AG-naWuKdp4FR', 1639619778, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"email\":\"aaa\",\"password\":\"1Aaaaa\",\"name\":\"asas\",\"userId\":10,\"image\":\"nico.png\",\"date\":\"2021-12-05T23:00:00.000Z\",\"reputation\":1}');

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
(14, 27),
(14, 28),
(15, 27),
(15, 28),
(16, 27),
(16, 28),
(17, 32),
(18, 33);

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
(32, '150'),
(27, 'jaja'),
(28, 'pepeeeee'),
(33, 'seria');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idusuario` int(100) NOT NULL,
  `correo` varchar(50) NOT NULL,
  `contraseña` varchar(50) NOT NULL,
  `nickname` varchar(20) NOT NULL,
  `imagen` varchar(50) DEFAULT NULL,
  `fecha` date NOT NULL,
  `reputacion` int(100) NOT NULL DEFAULT 1,
  `activo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idusuario`, `correo`, `contraseña`, `nickname`, `imagen`, `fecha`, `reputacion`, `activo`) VALUES
(1, 'a', 'a', 'aaa', 'a', '2021-11-23', 1, 1),
(2, 'hola', 'hola', 'hola', 'kuroko.png', '2021-12-05', 1, 1),
(3, 'qqq', '123', 'qqq', 'nico.png', '2021-12-06', 1, 1),
(4, 'ass', 'aaa', 'sasasa', 'defecto2.png', '2021-12-06', 1, 1),
(5, 'asasa', 'sasa', 'sasa', 'kuroko.png', '2021-12-06', 1, 1),
(6, 'sasa', 'sss', 'sasas', 'defecto3.png', '2021-12-06', 1, 1),
(7, 'xzxzx', 'aaa', 'zxzx', 'kuroko.png', '2021-12-06', 1, 1),
(8, 'asasas', '1qwertY', 'sasas', 'sfg.png', '2021-12-06', 1, 1),
(9, 'dsds', '1Qwert', 'sasas', 'marta.png', '2021-12-06', 1, 1),
(10, 'aaa', '1Aaaaa', 'asas', 'nico.png', '2021-12-06', 1, 1),
(11, 'dfdffd', '1Qqqqq', 'fdfdf', 'nico.png', '2021-12-06', 1, 1),
(12, 'sasasa', '1Qqqqqq', 'aas', 'roberto.png', '2021-12-06', 1, 1);

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
  MODIFY `idpregunta` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `idrespuesta` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tags`
--
ALTER TABLE `tags`
  MODIFY `idtag` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idusuario` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
