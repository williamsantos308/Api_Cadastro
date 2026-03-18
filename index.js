import express from 'express'; // servidor web
import fs from 'fs'; // manipulação de arquivos
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // criação do servidor
const PORT = 3000; // porta do servidor

app.use(express.json());
/*
CLIENTES ENDPOINTS
*/
const clientesFile = path.join(__dirname, "clientes.json");

function lerClientes() {
   if(!fs.existsSync(clientesFile)){
    return [];
   }

   const dados = fs.readFileSync(clientesFile, 'utf-8');

   try{
    return JSON.parse(dados);
   }catch(e){
    return [];
   }
}

function salvarClientes(clientes) {
   fs.writeFileSync(clientesFile, JSON.stringify(clientes, null, 2), 'utf-8' );
}



app.post('/clientes', (req, res) => {
    const { cpf, nome, idade, endereco, bairro, contato } = req.body;

    if(!cpf || !nome || !idade || !endereco || !bairro || !contato) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const clientes = lerClientes();

    if(clientes.some(c => c.cpf === cpf)){
        return res.status(400).json({ message: 'CPF já cadastrado' });
    }

   const novoCliente = { cpf, nome, idade, endereco, bairro, contato };
   clientes.push(novoCliente);
   salvarClientes(clientes);
   
   res.status(201).json({ message: 'Cliente cadastrado com sucesso', cliente: novoCliente });
});


app.get('/clientes', (req, res) => {
    const clientes = lerClientes();
    res.status(200).json(clientes);
});

app.get('/clientes/:cpf', (req, res) => {
    const { cpf } = req.params;
    const clientes = lerClientes();
    
    const cliente = clientes.find(c => c.cpf === cpf);
    
    if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    res.status(200).json(cliente);
});

/*
PRODUTOS ENDPOINTS
*/

const produtosFile = path.join(__dirname, "produtos.json");

function lerProdutos() {
   if(!fs.existsSync(produtosFile)){
    return [];
   }

   const dados = fs.readFileSync(produtosFile, 'utf-8');

   try{
    return JSON.parse(dados);
   }catch(e){
    return [];
   }
}

function salvarProdutos(produtos) {
   fs.writeFileSync(produtosFile, JSON.stringify(produtos, null, 2), 'utf-8' );
}



app.post('/produtos', (req, res) => {
    const { id, nome, valor, descricao } = req.body;

    if(!id || !nome || !valor || !descricao) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const produtos = lerProdutos();

    if(produtos.some(p => p.id === id)){
        return res.status(400).json({ message: 'ID já cadastrado' });
    }

   const novoProduto = { id, nome, valor, descricao };
   produtos.push(novoProduto);
   salvarProdutos(produtos);
   
   res.status(201).json({ message: 'Produto cadastrado com sucesso', produto: novoProduto });
});

app.get('/produtos', (req, res) => {
    const produtos = lerProdutos();
    res.status(200).json(produtos);
});

app.get('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const produtos = lerProdutos();
    
    const produto = produtos.find(p => p.id == id);
    
    if (!produto) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    res.status(200).json(produto);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
