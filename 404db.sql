-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-12-2021 a las 18:26:55
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
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `idpregunta` int(100) NOT NULL,
  `idusuario` int(100) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `cuerpo` varchar(1000) NOT NULL,
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
(16, 2, 'termo es un crack?', 'no se sabe, que opinais?', '2021-11-25', 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas`
--

CREATE TABLE `respuestas` (
  `idrespuesta` int(100) NOT NULL,
  `respuesta` varchar(1000) NOT NULL,
  `idusuario` int(100) NOT NULL,
  `idpregunta` int(100) NOT NULL,
  `puntuacion` int(10) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `respuestas`
--

INSERT INTO `respuestas` (`idrespuesta`, `respuesta`, `idusuario`, `idpregunta`, `puntuacion`) VALUES
(1, 'a', 1, 1, 0);

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
('I0vxrE0MPYBaYjfZopA_i-bDpYDVg6dO', 1638897632, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"email\":\"hola\",\"password\":\"hola\",\"name\":\"hola\",\"userId\":2,\"image\":\"kuroko.png\",\"date\":\"2021-12-04T23:00:00.000Z\",\"reputation\":1}');

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
(16, 28);

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
(27, 'jaja'),
(28, 'pepeeeee');

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

--
-- Índices para tablas volcadas
--

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
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `idpregunta` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `idrespuesta` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tags`
--
ALTER TABLE `tags`
  MODIFY `idtag` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idusuario` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
