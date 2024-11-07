## Explicação do Regex
#### - (?=.*[A-Z]): Deve conter pelo menos uma letra maiúscula.
#### - (?=.*[a-z]): Deve conter pelo menos uma letra minúscula.
#### - (?=(?:[^0-9]*[0-9]){2}): Deve conter pelo menos 2 dígitos numéricos.
#### - (?=(?:[^#@!?"'.,:]*[#@!?"'.,:]){2}): Deve conter pelo menos 2 caracteres especiais permitidos: #, @, !, ?", '., ,, :.
#### - (?!.*([0-9])\1{2}): Não pode ter mais de 2 dígitos iguais consecutivos.
#### - (?!.*([A-Za-z])\2{2}): Não pode ter mais de 2 letras iguais consecutivas.
#### - .{8,}$: A senha deve ter pelo menos 8 caracteres.
## Irregularidades a Serem Listadas
#### - A senha deve ter pelo menos 8 caracteres.
#### - A senha deve ter pelo menos 1 letra maiúscula.
#### - A senha deve ter pelo menos 1 letra minúscula.
#### - A senha deve ter pelo menos 2 dígitos numéricos.
#### - A senha deve ter pelo menos 2 caracteres especiais dentre: #, @, !, ?", '., ,, :.
#### - Não pode ter mais de 2 dígitos iguais consecutivos.
#### - Não pode ter mais de 2 letras iguais consecutivas.
#### - Não pode conter caracteres irregulares como: ,, ., :.