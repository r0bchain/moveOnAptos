# HolaBlockchain

```md
# README

## Jugar con los ejemplos

1. Clona este repo mediante el siguiente comando:
   ```bash
   git clone https://github.com/r0bchain/moveOnAptos.git
   ```

2. Abre una nueva terminal y navega hasta la carpeta de la lección que quieres :
   ```bash
   cd moveOnAptos/lessonN (donde N es el número de la lección que deseas ver).
   ```

3. Naveva hasta el ejercicio específico que quieres ver (e.g., `hola_aptos_blockchain`):
   ```bash
   cd hola_aptos_blockchain
   ```

4. Puedes usar la Aptos CLI para compilar, testear, publicar, y ejecutar estos contratos usando estos comandos:  
   [Aptos Move CLI](https://aptos.dev/move/move-on-aptos/cli/)

5. Si becesitas istalar la Aptos CLI,  sigue estas instrucciones (en inglés):  
   [Instalar Aptos CLI](https://aptos.dev/tools/aptos-cli/install-cli/)

> **WARNING**: Estos ejemplos programados con el lenguaje Move **NO** han sido auditados. Si los utilizas en produción, hazlo bajo tu propio riesgo. Especialmente ten cuidado con los ejemplos que contienen código criptografico complejo (e.g., `drand`, `veiled_coin`).

## Recursos adicionales

- **Aptos Learn** guías paso a paso para aprender Aptos (en inglés).
- Otro repositorio con más ejemplos: [move-by-examples](https://github.com/aptos-labs/move-by-examples), cotiene ejemplos actualizados

### Ejecutado tests

Para correr los tests para todos los ejemplos ejecuta este comando:
```bash
cargo test -- --nocapture
```

Para correr un test para un expecífico ejemplo, corre este otro comando (e.g., `hola_aptos_blockchain`):
```bash
cargo test -- hola_aptos_blockchain --nocapture
```
```
