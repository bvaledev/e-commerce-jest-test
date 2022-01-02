# E-commerce Cart
[![Coverage Status](https://coveralls.io/repos/github/bvaledev/e-commerce-jest-test/badge.svg?branch=main)](https://coveralls.io/github/bvaledev/e-commerce-jest-test?branch=main)

Projeto desenvolvido para estudo, onde foi alcançado 100% da cobertura do código por testes.

## Funções da classe Cart

- **add()**: Adiciona um item ao carrinho, removendo o anterior caso já exista.
- **remove()**: Remove um item do carrinho.
- **getTotal()**: Retorna o cálculo do preço total dos items no carrinho, já com o desconto aplicado.
- **summary()**: Retorna o resumo dos items no carrinho, incluindo o valor total formatado em real.
- **checkout()**: Finaliza a compra e limpa os items do carrinho.


## Funções de desconto

- **calculatePercentageDiscount()**: Adiciona um desconto por percentual com base na quantidade mínima de produto.
- **calculateQuantityDiscount()**: Aplica um valor variável de desconto baseado na quantidade de items. Quando a quantidade de items adicionado for maior do que a informada na condição. Verifica se a quantidade de items é par, se for aplica 50% de desconto, se não for, aplica 40%.
- **calculateDiscount()**: Valida a condição de desconto, calcula o valor que será subtraído e retorna o melhor desconto viável para o usuário.
