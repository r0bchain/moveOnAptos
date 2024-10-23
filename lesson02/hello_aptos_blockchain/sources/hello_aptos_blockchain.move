module hello_aptos_blockchain::message {

    use std::error;
    use std::signer;
    use std::string;
    use aptos_framework::event;
    #[test_only]
    use std::debug;


    struct MessageHolder has key {
        message: string:: String,
    }

}