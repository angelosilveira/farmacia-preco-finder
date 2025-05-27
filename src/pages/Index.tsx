import React, { useState, useRef } from "react";
import { CotacaoForm } from "@/components/CotacaoForm";
import { CotacaoTable } from "@/components/CotacaoTable";
import { StatsSummary } from "@/components/StatsSummary";
import { Produto } from "@/types/cotacao";
import { ClipboardList } from "lucide-react";

const Index = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoParaDuplicar, setProdutoParaDuplicar] = useState<
    Produto | undefined
  >();

  const handleAddProduto = (novoProduto: Produto) => {
    setProdutos((prev) => [...prev, novoProduto]);
    setProdutoParaDuplicar(undefined); // Reset after adding
  };

  const handleEditProduto = (id: string, produtoEditado: Produto) => {
    setProdutos((prev) =>
      prev.map((produto) => (produto.id === id ? produtoEditado : produto))
    );
  };

  // Função para verificar se é o menor preço
  const isMelhorPreco = (produto: Produto) => {
    const produtosComMesmoNome = produtos.filter(
      (p) => p.nome === produto.nome
    );
    const menorPreco = Math.min(
      ...produtosComMesmoNome.map((p) => p.precoUnitario)
    );
    return produto.precoUnitario === menorPreco;
  };

  // Ordenar produtos: primeiro por representante, depois produtos com menor preço (que têm o badge) ficam abaixo
  const produtosOrdenados = [...produtos].sort((a, b) => {
    // Primeiro ordena por representante (alfabeticamente)
    const representanteComparison = a.representante.localeCompare(
      b.representante
    );
    if (representanteComparison !== 0) return representanteComparison;

    // Dentro do mesmo representante, verifica se é menor preço
    const aEhMenorPreco = isMelhorPreco(a);
    const bEhMenorPreco = isMelhorPreco(b);

    // Se apenas um deles é menor preço, coloca o menor preço abaixo
    if (aEhMenorPreco && !bEhMenorPreco) return 1;
    if (!aEhMenorPreco && bEhMenorPreco) return -1;

    // Se ambos são ou não são menor preço, ordena por preço unitário (maior para menor)
    return b.precoUnitario - a.precoUnitario;
  });

  const totalCotacoes = produtos.length;
  const totalValor = produtos.reduce(
    (sum, produto) => sum + produto.precoTotal,
    0
  );
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleDuplicateProduto = (produto: Produto) => {
    setProdutoParaDuplicar({
      ...produto,
      id: "", // Clear ID so a new one will be generated
      dataAtualizacao: new Date(), // Update the date
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemoveProduto = (id: string) => {
    if (window.confirm("Tem certeza que deseja remover esta cotação?")) {
      setProdutos((prev) => prev.filter((produto) => produto.id !== id));
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <ClipboardList className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Cotações</h1>
      </div>

      <StatsSummary produtos={produtos} />

      <div className="flex flex-col gap-6">
        <CotacaoForm
          onAddProduto={handleAddProduto}
          initialData={produtoParaDuplicar}
        />
        <CotacaoTable
          produtos={produtosOrdenados}
          onEditProduto={handleEditProduto}
          onDuplicateProduto={handleDuplicateProduto}
          onRemoveProduto={handleRemoveProduto}
          isMelhorPreco={isMelhorPreco}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
};

export default Index;
