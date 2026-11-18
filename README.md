# EMB Viewer Pro

Aplicação web para abrir e inspecionar arquivos de bordado Wilcom no formato `.EMB`.

## Estado atual

Este repositório inicia a estrutura do aplicativo. A leitura fiel de `.EMB` depende de um parser compatível com as especificações e versões do formato Wilcom. O aplicativo deve identificar e informar explicitamente quando um arquivo ainda não puder ser interpretado; não deve fabricar uma pré-visualização.

## Requisitos

- Node.js 20 ou superior
- npm

## Desenvolvimento

```bash
npm install
npm run dev
```

## Validação

```bash
npm run typecheck
npm run build
```

## Arquitetura

- `src/components`: interface e controles do visualizador.
- `src/lib/emb`: inspeção de arquivo e futura integração de parser EMB.
- `src/types`: contratos tipados do domínio.

## Compatibilidade EMB

Nenhuma versão do formato `.EMB` é declarada como suportada até existir uma implementação de parser e fixtures reais que comprovem a leitura. Arquivos desconhecidos são tratados como não suportados.
