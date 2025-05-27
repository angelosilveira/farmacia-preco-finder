import React, { useState, useRef, useEffect } from "react";
import { CotacaoForm } from "@/components/CotacaoForm";
import { CotacaoTable } from "@/components/CotacaoTable";
import { StatsSummary } from "@/components/StatsSummary";
import { Produto } from "@/types/cotacao";
import { ClipboardList, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "farmacia-preco-finder:produtos";

// Tipo para produto armazenado com data como string
type StoredProduto = Omit<Produto, "dataAtualizacao"> & {
  dataAtualizacao: string;
};

const Index = () => {
  const [produtos, setProdutos] = useState<Produto[]>(() => {
    // Carrega produtos do localStorage na inicialização
    const savedProdutos = localStorage.getItem(STORAGE_KEY);
    if (savedProdutos) {
      const parsed = JSON.parse(savedProdutos) as StoredProduto[];
      // Converte as strings de data de volta para objetos Date
      return parsed.map((p) => ({
        ...p,
        dataAtualizacao: new Date(p.dataAtualizacao),
      }));
    }
    return [];
  });
  const [produtoParaDuplicar, setProdutoParaDuplicar] = useState<
    Produto | undefined
  >();

  // Salva produtos no localStorage sempre que mudam
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
  }, [produtos]);

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

  const handleClearAllProdutos = () => {
    if (
      window.confirm(
        "Tem certeza que deseja limpar todas as cotações e começar do zero?"
      )
    ) {
      setProdutos([]);
      setProdutoParaDuplicar(undefined);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ClipboardList className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">Cotações</h1>
        </div>
        <Button
          variant="destructive"
          className="gap-2"
          onClick={handleClearAllProdutos}
          disabled={produtos.length === 0}
        >
          <Trash2 className="h-4 w-4" />
          Limpar Cotações
        </Button>
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
