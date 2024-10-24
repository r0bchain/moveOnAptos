
# Lección 2

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
