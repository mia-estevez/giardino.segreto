-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`usuarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`usuarios` ;

CREATE TABLE IF NOT EXISTS `mydb`.`usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `telefono` INT NOT NULL,
  `contraseña` VARCHAR(8) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `telefono_UNIQUE` (`telefono` ASC) VISIBLE,
  UNIQUE INDEX `contraseña_UNIQUE` (`contraseña` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`envio`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`envio` ;

CREATE TABLE IF NOT EXISTS `mydb`.`envio` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `direccion` VARCHAR(45) NOT NULL,
  `codigoPostal` VARCHAR(45) NOT NULL,
  `monto` DECIMAL(25) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`pago`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`pago` ;

CREATE TABLE IF NOT EXISTS `mydb`.`pago` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `metodo` VARCHAR(45) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  `monto` DECIMAL(25) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`producto`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`producto` ;

CREATE TABLE IF NOT EXISTS `mydb`.`producto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(45) NOT NULL,
  `precio` INT NOT NULL,
  `stock` INT NOT NULL,
  `productocol` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`detalle_pedido`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`detalle_pedido` ;

CREATE TABLE IF NOT EXISTS `mydb`.`detalle_pedido` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cantidad` INT NOT NULL,
  `precioUnitario` DECIMAL(25) NOT NULL,
  `subtotal` DECIMAL(25) NOT NULL,
  `producto_id` INT NOT NULL,
  `pago_id` INT NOT NULL,
  `producto_id1` INT NOT NULL,
  PRIMARY KEY (`id`, `producto_id`, `pago_id`, `producto_id1`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_detalle_pedido_pago1_idx` (`pago_id` ASC) VISIBLE,
  INDEX `fk_detalle_pedido_producto1_idx` (`producto_id1` ASC) VISIBLE,
  CONSTRAINT `fk_detalle_pedido_pago1`
    FOREIGN KEY (`pago_id`)
    REFERENCES `mydb`.`pago` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_detalle_pedido_producto1`
    FOREIGN KEY (`producto_id1`)
    REFERENCES `mydb`.`producto` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`pedido`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`pedido` ;

CREATE TABLE IF NOT EXISTS `mydb`.`pedido` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  `total` DECIMAL(25) NOT NULL,
  `envio_id` INT NOT NULL,
  `usuarios_id` INT NOT NULL,
  `detalle_pedido_id` INT NOT NULL,
  `detalle_pedido_producto_id` INT NOT NULL,
  PRIMARY KEY (`id`, `envio_id`, `usuarios_id`, `detalle_pedido_id`, `detalle_pedido_producto_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_pedido_envio_idx` (`envio_id` ASC) VISIBLE,
  INDEX `fk_pedido_usuarios1_idx` (`usuarios_id` ASC) VISIBLE,
  INDEX `fk_pedido_detalle_pedido1_idx` (`detalle_pedido_id` ASC, `detalle_pedido_producto_id` ASC) VISIBLE,
  CONSTRAINT `fk_pedido_envio`
    FOREIGN KEY (`envio_id`)
    REFERENCES `mydb`.`envio` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedido_usuarios1`
    FOREIGN KEY (`usuarios_id`)
    REFERENCES `mydb`.`usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedido_detalle_pedido1`
    FOREIGN KEY (`detalle_pedido_id` , `detalle_pedido_producto_id`)
    REFERENCES `mydb`.`detalle_pedido` (`id` , `producto_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
