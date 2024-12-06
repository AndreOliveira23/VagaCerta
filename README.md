<p align="center">
  <img src="https://github.com/AndreOliveira23/VagaCerta/blob/main/projeto/vagacerta/static/images/logo-vaga-certa-sem-fundo.png" />
</p>

# Vaga Certa : Simplificando estacionar

Dados indicam que, em média, os motoristas gastam 77 horas por ano procurando onde estacionar, o que corresponde a pouco mais de 3 dias inteiros. 

O Vaga Certa é uma resposta a esse problema, proporcionando uma solução digital para facilitar a busca e reserva de vagas de estacionamento em tempo real, através de uma plataforma web acessível e eficiente. A proposta do projeto é otimizar o tempo dos motoristas, garantindo que encontrem e reservem vagas próximas aos seus destinos de maneira fácil e automática, utilizando recursos como geolocalização e um sistema de pagamento integrado. 

- Para mais informações: [Apresentação Vaga Certa](https://github.com/AndreOliveira23/VagaCerta/blob/main/Apresentacao_VagaCerta.pdf)

## Contexto

Este projeto trata-se de um MVP (Minium Viable Product - Produto Mínimo Viável), desenvolvido para a disciplina 'ACH2008 - Empreendedorismo em Informática'. 

## Objetivo

Possibilitar o encontro das melhores opções de vagas, junto com a certeza de seu valor, disponibilidade e qualidade

## Decisões técnicas (FAQ)

Por se tratar de um MVP early stage, optamos por aumentar a eficiência e rapidez na entrega de features, para isso tomamos as seguintes decisões e seguimos alguns princípios:

- Linguagem de programação: Python3 (familiaridade dos membros do projeto com a linguagem)

- Framework web: Django (optamos por utilizar um framework web para acelerar a entrega de algumas features base da nossa aplicação, como o uso de rotas, views e sistemas de autenticação)

- Front-end: HTML CSS JS (utilizar um framework front-end como React, Angular, Vue, Svelt, etc. iria adicionar complexidade desnecessária neste momento em que estamos focados em testar uma ideia de solução, posteriormente vale revisar a qualidade da nossa UI UX)

- Arquitetura: monolíto monorepo (baseado no curto período de desenvolvimento de menos de 1 semestre, focamos em entregar a proposta de valor acima de decisões complexas envolvendo escalabilidade e economia de recursos, pois isso é algo que pode ser pensado como next step)

- Banco de dados: Django ORM e SQLite3 (operações comuns, como CRUD (Create, Read, Update, Delete), são simplificadas e encapsuladas em APIs claras e reutilizáveis, reduzindo a duplicação de código)

## Pre-requisitos

- [Python3](https://www.python.org/downloads/)

## Setup (Linux)

1. Clone o repositório

```
$ git clone https://github.com/AndreOliveira23/VagaCerta.git
```

2. Ative o ambiente virtual para isolamento de dependências
```
$ python3 -m venv venv
$ source venv/bin/activate
```

3. Vá para o diretório do projeto e rode as migrações no banco de dados local
```
$ cd projeto/ && python3 manage.py makemigrations && python3 manage.py migrate
```

4. Suba o servidor local Django

```
$ python3 manage.py runserver
```

5. Acesse a aplicação no localhost porta 8000

## Colaboradores

- André Oliveira [(@AndreOliveira23)](https://www.github.com/AndreOliveira23)
- Erika Shiow
- Gabriel Amorim [ (@gabrielnoronha1)](https://github.com/gabrielnoronha1)
- Gabriel Ventorim[ (@GabsVentorim)](https://github.com/GabsVentorim)
- Gustavo Ventorim[ (@GustavoVentorim)](https://github.com/GustavoVentorim)
- Rafael Varago [ (@rafael-varago)](https://github.com/rafael-varago)
- Raphael Freitas 
- Thiago Ryu [@ThiHarada](https://github.com/ThiHarada)
- Tiago Lima [@tiagofraga342](https://github.com/tiagofraga342)
 
