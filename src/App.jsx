import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '../Layout.jsx'

// Importar todas as páginas
import Home from '../Pages/Home.jsx'
import Produtos from '../Pages/Produtos.jsx'
import ProdutoDetalhe from '../Pages/ProdutoDetalhe.jsx'
import Carrinho from '../Pages/Carrinho.jsx'
import Favoritos from '../Pages/Favoritos.jsx'
import Sobre from '../Pages/Sobre.jsx'

// Páginas de autenticação
import Entrar from '../Pages/Entrar.jsx'
import Cadastro from '../Pages/Cadastro.jsx'
import EsqueciSenha from '../Pages/EsqueciSenha.jsx'
import RedefinirSenha from '../Pages/RedefinirSenha.jsx'
import MinhaConta from '../Pages/MinhaConta.jsx'

// Páginas de checkout
import CheckoutSucesso from '../Pages/CheckoutSucesso.jsx'
import CheckoutErro from '../Pages/CheckoutErro.jsx'
import CheckoutPendente from '../Pages/CheckoutPendente.jsx'

// Páginas administrativas
import Dashboard from '../Pages/Dashboard.jsx'
import AdminProdutos from '../Pages/AdminProdutos.jsx'
import Vendas from '../Pages/Vendas.jsx'
import Clientes from '../Pages/Clientes.jsx'
import Despesas from '../Pages/Despesas.jsx'
import Relatorios from '../Pages/Relatorios.jsx'
import Configuracoes from '../Pages/Configuracoes.jsx'

function App() {
  return (
    <Router>
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<Layout currentPageName="Home"><Home /></Layout>} />
        <Route path="/Home" element={<Layout currentPageName="Home"><Home /></Layout>} />
        <Route path="/Produtos" element={<Layout currentPageName="Produtos"><Produtos /></Layout>} />
        <Route path="/ProdutoDetalhe/:id" element={<Layout currentPageName="ProdutoDetalhe"><ProdutoDetalhe /></Layout>} />
        <Route path="/Carrinho" element={<Layout currentPageName="Carrinho"><Carrinho /></Layout>} />
        <Route path="/Favoritos" element={<Layout currentPageName="Favoritos"><Favoritos /></Layout>} />
        <Route path="/Sobre" element={<Layout currentPageName="Sobre"><Sobre /></Layout>} />

        {/* Autenticação */}
        <Route path="/Entrar" element={<Layout currentPageName="Entrar"><Entrar /></Layout>} />
        <Route path="/Cadastro" element={<Layout currentPageName="Cadastro"><Cadastro /></Layout>} />
        <Route path="/EsqueciSenha" element={<Layout currentPageName="EsqueciSenha"><EsqueciSenha /></Layout>} />
        <Route path="/RedefinirSenha" element={<Layout currentPageName="RedefinirSenha"><RedefinirSenha /></Layout>} />
        <Route path="/MinhaConta" element={<Layout currentPageName="MinhaConta"><MinhaConta /></Layout>} />

        {/* Checkout */}
        <Route path="/CheckoutSucesso" element={<Layout currentPageName="CheckoutSucesso"><CheckoutSucesso /></Layout>} />
        <Route path="/CheckoutErro" element={<Layout currentPageName="CheckoutErro"><CheckoutErro /></Layout>} />
        <Route path="/CheckoutPendente" element={<Layout currentPageName="CheckoutPendente"><CheckoutPendente /></Layout>} />

        {/* Páginas administrativas */}
        <Route path="/Dashboard" element={<Layout currentPageName="Dashboard"><Dashboard /></Layout>} />
        <Route path="/AdminProdutos" element={<Layout currentPageName="AdminProdutos"><AdminProdutos /></Layout>} />
        <Route path="/Vendas" element={<Layout currentPageName="Vendas"><Vendas /></Layout>} />
        <Route path="/Clientes" element={<Layout currentPageName="Clientes"><Clientes /></Layout>} />
        <Route path="/Despesas" element={<Layout currentPageName="Despesas"><Despesas /></Layout>} />
        <Route path="/Relatorios" element={<Layout currentPageName="Relatorios"><Relatorios /></Layout>} />
        <Route path="/Configuracoes" element={<Layout currentPageName="Configuracoes"><Configuracoes /></Layout>} />

        {/* Rota 404 - redireciona para home */}
        <Route path="*" element={<Layout currentPageName="Home"><Home /></Layout>} />
      </Routes>
    </Router>
  )
}

export default App 