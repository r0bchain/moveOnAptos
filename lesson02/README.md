
# Lección 2

## Instalamos la CLI

La instalación dependerá del SO que estés utilizando, en **Windows** si trabajas con **WSL** (recomendable), podrás instalarlo igual que en **Linux**, en este curso veremos como 
se instala en sistemas Linux (WSL en Windows). Para ello seguiremos estas [instrucciones](https://aptos.dev/en/build/cli/install-cli/install-cli-linux)
Para **MAC** visita este enlace y sigue las [instrucciones](https://aptos.dev/en/build/smart-contracts/create-package)

Para otros sistemas operativos, simplemente sigue las instrucciones de este enlace [Instalar CLI para otros SOs](https://aptos.dev/en/build/cli) 

## Creamos un paquete 
**Aclaración**: En Move, un package (paquete) es una **colección de módulos y scripts** agrupados de manera lógica que permiten organizar y gestionar el código de manera eficiente. Los paquetes en Move funcionan de manera similar a los paquetes en otros lenguajes de programación: permiten agrupar código relacionado, gestionar dependencias y facilitar la distribución y reutilización.

```bash
aptos move init --name <PROJECT_NAME>
```

Ahora deberias tener una estructura similar a esta:
```bash
- scripts
- sources
- tests
- Move.toml
```
También puedes crear el proyecto usando una de estas [plantillas](https://aptos.dev/en/build/cli/start-from-template), pero por ahora no usaremos plantillas y crearemos todo desde cero.

## Actualizamos Move.toml
#### ¿Qué es y que hace este archivo?

El archivo Move.toml es un archivo de **configuración** utilizado en paquetes de Move para **gestionar la estructura del proyecto y sus dependencias**
```
[package]
name = "hello_aptos_blockchain"
version = "1.0.0"
authors = []

[addresses]
hello_blockchain = "_"

[dev-addresses]
hello_aptos_blockchain = ""

[dependencies.AptosFramework]
git = "https://github.com/aptos-labs/aptos-core.git"
rev = "mainnet"
subdir = "aptos-move/framework/aptos-framework"
```

**name**: nombre de tu paquete

**version**: versión del paquete (por defecto es "0.0.0")

**addresses**: Describe en qué dirección se desplegará el módulo. Estas son direcciones con nombre que pueden ser utilizadas como alias. En el ejemplo anterior, usamos **hola_aptos_blockchain** como la dirección nombrada.

Por ahora trabajaremos en la red **DEV**, por lo cual usaremos la address especificada en **dev-addresses**, el motivo de utilizar el guión en vez de una dirección hexadecimal, es porque podemos darle este valor cuando depleguemos el paquete, ya sea en un entorno de producción (entonces usaremos el valor que se encuentre en **addresses**), o en DEV, en este caso miraremos el valor de **dev-addresses**, también podemos proporcionar el valor de la dirección durante el despliegue.

Al final de este README desplegaremos el paquete en la red DEV usando los comandos necesarios, sigue leyendo...


## Importar librerias

Al comienzo de nuestro primer módulo de ejemplo, importamos las librerias
```
 use std::error;
    use std::signer;
    use std::string;
    use aptos_framework::event;
    #[test_only]
    use std::debug;
```
**std** es la librería estándar del lenguaje Move

**aptos_framework** es la librería específica de la blockchain de Aptos.

## Resources

En Move, un recurso es un tipo especial de dato que está diseñado para representar entidades que son únicas y poseen propiedades clave de seguridad. Un recurso tiene las siguientes características principales:

Características clave de los recursos en Move:
* **No duplicable**: No se pueden copiar. Esto significa que un recurso siempre tendrá una única instancia y no puede ser clonado o replicado. 

* **No descartable**: No se puede eliminar accidentalmente. Un recurso debe ser utilizado de manera explícita o movido a otro propietario, lo que previene pérdidas de activos importantes. 

* **Propiedad estricta**: Los recursos en Move siempre están asociados a una cuenta o entidad. Solo el propietario puede acceder a ellos, y esta propiedad es estrictamente controlada por el lenguaje. 

* **Seguridad financiera**: Dado que muchos de los casos de uso de Move están diseñados para manejar criptomonedas y activos financieros, los recursos garantizan que no se pierdan o manipulen erróneamente durante las transacciones.
  
  Ejemplo:
```
   //:!:>resource
    struct MessageHolder has key {
        message: string:: String,
    }
     //<:!:resource
```

## Eventos 
Mecanismo clave para rastrear y notificar sobre cambios importantes que ocurren durante la ejecución de transacciones en la blockchain.
Enlace web oficial para mis info sobre [eventos](https://aptos.dev/en/network/blockchain/events)

Ejemplo:
```
   #[event]
    struct MessageChange has drop, store {
        account: address,
        from_message: string::String,
        to_message: string::String,
    }
```
En este ejemplo del primre contrato inteligente que hemos creado, podemos ver como el evento también tiene **HABILIDIDADES** (drop y store), concepto clave para la seguridad de la blockchain.

# Códigos de error / constantes
```bash
    const ENO_MESSAGE: u64 = 0;
```

*Códigos de error predefinidos por APTOS*, ver en la [documentación oficial](https://aptos.dev/en/build/smart-contracts/error-codes)

## Funciones
En este caso estamos delante de una **función pública**, que además tiene el **atributo #[view]** se utiliza para indicar que una función es un método de solo lectura. Es decir, **dentro de la función (del cuerpo) NO se podrá modificar el estado**.
```
   #[view]
    public fun get_message(addr: address): string::String acquires MessageHolder {
        assert!(exists<MessageHolder>(addr), error::not_found(ENO_MESSAGE));
        borrow_global<MessageHolder>(addr).message
    }
```
En este otro ejemplo, veremos dos cosas interesantes, el atributo **entry** y **acquire**.
```
  public entry fun set_message(account: signer, message: string::String)
    acquires MessageHolder {
      // Cuerpo de la fn
    }
```
El **atributo  #[entry]** en Move se utiliza para marcar una función como un **punto de entrada para la ejecución de una transacción o un script**. Esto significa que cuando se invoca una función marcada con #[entry], se ejecuta como parte de una transacción en la blockchain.

**acquire** se utiliza para **adquirir recursos**. Esto permite que una función obtenga la propiedad de un recurso específico que se encuentra en la blockchain, lo que es fundamental para **garantizar que solo una instancia de un recurso sea utilizada por un módulo o función a la vez**. Mas info en la docu oficial sobre [acquire](https://aptos.dev/en/build/smart-contracts/book/functions#acquires)

Todas las funciones se declaran por defecto como **privadas** si no se indica lo contrario, vamos a ver un ejemplo
```
// Función privada
    fun increment_value(s: &mut MyStruct) {
        s.value = s.value + 1;
    }
```
Esta función **PRIVADA** NO es accesible desde fuera del módulo donde está declarada 
**Nota**: los distintos tipos de funciones las iremos viendo durante el curso a medida que programemos más contratos inteligentes (también llamados módulos), pero si tienes curiosidad, también
puedes visitar la documentación oficial y leer en inglés sobre las [funciones](https://aptos.dev/en/build/smart-contracts/book/functions).

Este fragmento de código en Move muestra una función de prueba que verifica si un remitente puede establecer un mensaje.
```  #[test(account = @0x1)]
    public entry fun sender_can_set_message(account: signer) acquires MessageHolder {
        let msg: string::String = string::utf8(b"Running test for sender_can_set_message...");
        debug::print(&msg);
        // ......
    }

```
#### Propósito de la Función
El propósito principal de esta función es asegurarse de que la funcionalidad para establecer un mensaje en la cuenta funcione correctamente. La función de prueba simula el entorno necesario y realiza la verificación mediante aserciones.

Contexto General
Las pruebas en Move son esenciales para garantizar que los contratos inteligentes se comporten como se espera y que los cambios realizados no introduzcan errores. Al utilizar atributos como #[test], los desarrolladores pueden crear pruebas automatizadas que ayudan a validar la lógica del código en el desarrollo de aplicaciones blockchain.

Para más información sobre pruebas en Move y el uso de atributos como #[test], puedes consultar la [documentación de Aptos sobre Move referente a los tests](https://aptos.dev/en/build/smart-contracts/book/unit-testing)

### Compilamos 
##### Dirección por defecto que tenemos en el archivo Move.toml definida

```bash
aptos move compile --named-addresses hello_aptos_blockchain=default
```
##### Dirección que le pasamos nosotros

```
aptos move compile --named-addresses hello_aptos_blockchain=0x1234
```

Si todo ha ido OK, veremos un mensaje similar a este
```
{
  "Result": [
    "<PUBLISHING_ADDRESS>::<MODULE_NAME>"
  ]
}
```
.Visita la [docu oficial](https://aptos.dev/en/build/smart-contracts/compiling) para más detalles 

### Desplegamos en la blockchain (Deploy)
#### Deploy code to an object

```bash
aptos move deploy-object --address-name hello_aptos_blockchain
```

En la siguiente lección veremos más temas interesantes y seguiremos trabajando con los comandos de la CLI.
