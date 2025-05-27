import React, { useState, useCallback, useEffect } from "react";
import { CotacaoForm } from "@/components/CotacaoForm";
import { CotacaoTable } from "@/components/CotacaoTable";
import { StatsSummary } from "@/components/StatsSummary";
import { Produto } from "@/types/cotacao";
import { ClipboardList, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { PostgrestError } from "@supabase/supabase-js";

const Index = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoParaDuplicar, setProdutoParaDuplicar] = useState<
    Produto | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Função memoizada para buscar produtos
  const fetchProdutos = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      } // Converte as datas de string para Date e garante que são datas válidas
      const produtosFormatados = data.map((produto) => {
        const dataAtualizacao = new Date(produto.dataAtualizacao);
        // Se a data for inválida, usa a data atual
        if (isNaN(dataAtualizacao.getTime())) {
          console.warn(
            `Data inválida para o produto ${produto.id}, usando data atual`
          );
          return {
            ...produto,
            dataAtualizacao: new Date(),
          };
        }
        return {
          ...produto,
          dataAtualizacao,
        };
      });

      setProdutos(produtosFormatados);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro ao carregar produtos",
        description: message,
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Carrega produtos do Supabase quando o componente monta
  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  const handleAddProduto = async (novoProduto: Produto) => {
    try {
      const { data, error } = await supabase
        .from("produtos")
        .insert([novoProduto])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setProdutos((prev) => [data, ...prev]);
        setProdutoParaDuplicar(undefined);

        toast({
          title: "Sucesso!",
          description: "Cotação adicionada com sucesso.",
        });
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro ao adicionar cotação",
        description: message,
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleEditProduto = async (id: string, produtoEditado: Produto) => {
    try {
      const { error } = await supabase
        .from("produtos")
        .update(produtoEditado)
        .eq("id", id);

      if (error) throw error;

      setProdutos((prev) =>
        prev.map((produto) => (produto.id === id ? produtoEditado : produto))
      );

      toast({
        title: "Sucesso!",
        description: "Cotação atualizada com sucesso.",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro ao atualizar cotação",
        description: message,
        variant: "destructive",
      });
      console.error(error);
    }
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

  const handleRemoveProduto = async (id: string) => {
    if (window.confirm("Tem certeza que deseja remover esta cotação?")) {
      try {
        const { error } = await supabase.from("produtos").delete().eq("id", id);

        if (error) throw error;

        setProdutos((prev) => prev.filter((produto) => produto.id !== id));

        toast({
          title: "Sucesso!",
          description: "Cotação removida com sucesso.",
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Erro desconhecido";
        toast({
          title: "Erro ao remover cotação",
          description: message,
          variant: "destructive",
        });
        console.error(error);
      }
    }
  };

  const handleClearAllProdutos = async () => {
    if (
      window.confirm(
        "Tem certeza que deseja limpar todas as cotações e começar do zero?"
      )
    ) {
      try {
        const { error } = await supabase
          .from("produtos")
          .delete()
          .neq("id", "0"); // Deleta todos os registros

        if (error) throw error;

        setProdutos([]);
        setProdutoParaDuplicar(undefined);

        toast({
          title: "Sucesso!",
          description: "Todas as cotações foram removidas.",
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Erro desconhecido";
        toast({
          title: "Erro ao limpar cotações",
          description: message,
          variant: "destructive",
        });
        console.error(error);
      }
    }
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

  // Ordenar produtos
  const produtosOrdenados = [...produtos].sort((a, b) => {
    const representanteComparison = a.representante.localeCompare(
      b.representante
    );
    if (representanteComparison !== 0) return representanteComparison;

    const aEhMenorPreco = isMelhorPreco(a);
    const bEhMenorPreco = isMelhorPreco(b);

    if (aEhMenorPreco && !bEhMenorPreco) return 1;
    if (!aEhMenorPreco && bEhMenorPreco) return -1;

    return b.precoUnitario - a.precoUnitario;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="container py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando cotações...</p>
        </div>
      </div>
    );
  }

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
