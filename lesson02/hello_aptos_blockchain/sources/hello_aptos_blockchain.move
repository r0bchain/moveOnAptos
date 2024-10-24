module hello_aptos_blockchain::message {

    // Importamos librerias
    use std::error;
    use std::signer;
    use std::string;

    // Modulo event pertenece al framework  de Aptos
    use aptos_framework::event;

    // Esto solo se usara para los tests
    #[test_only] 
    use std::debug;


    // Primera estructura, con la habilidad key, significa que se almacenara en el "almacenamiento global" dentro de la cuenta del usuario
    //:!:>resource
    struct MessageHolder has key {
        message: string:: String,
    }
     //<:!:resource

     // Los eventos tambien tiene habilidades (mas detalles en el README.md de la leccion) 
     #[event]
     struct MessageChange has drop, store {
         account: address,
         from_message: string::String,
         to_message: string::String,
     }

      // Permite no tener que cambiar el error en cada parte del codigo, 
      // en caso de que actualicemos el entero que representa dicho error 
    const ENO_MESSAGE: u64 = 0;

    #[view]
    public fun get_message(addr: address): string::String acquires MessageHolder {
        assert!(exists<MessageHolder>(addr), error::not_found(ENO_MESSAGE));
        borrow_global<MessageHolder>(addr).message
    }

    public entry fun set_message(account: signer, message: string::String)
    acquires MessageHolder {
        let account_addr = signer::address_of(&account);
        if (!exists<MessageHolder>(account_addr)) {
            move_to(&account, MessageHolder {
                message,
            })
        } else {
            let old_message_holder = borrow_global_mut<MessageHolder>(account_addr);
            let from_message = old_message_holder.message;
            event::emit(MessageChange {
                account: account_addr,
                from_message,
                to_message: copy message,
            });
            old_message_holder.message = message;
        }
    }

    #[test(account = @0x1)]
    public entry fun sender_can_set_message(account: signer) acquires MessageHolder {
        let msg: string::String = string::utf8(b"Running test for sender_can_set_message...");
        debug::print(&msg);

        let addr = signer::address_of(&account);
        aptos_framework::account::create_account_for_test(addr);
        set_message(account, string::utf8(b"Hello, Blockchain"));

        assert!(
            get_message(addr) == string::utf8(b"Hello, Blockchain"),
            ENO_MESSAGE
        );
    }

}
