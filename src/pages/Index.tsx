import React, { useState, useCallback, useEffect } from "react";
import { CotacaoForm } from "@/components/CotacaoForm";
import { CotacaoTable } from "@/components/CotacaoTable";
import { StatsSummary } from "@/components/StatsSummary";
import { ClipboardList, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { PostgrestError } from "@supabase/supabase-js";
import {
  Cotacao,
  Produto,
  cotacaoToProduto,
  produtoToCotacao,
} from "@/types/cotacao";

const Index = () => {
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([]);
  const [produtoParaDuplicar, setProdutoParaDuplicar] = useState<
    Produto | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Função memoizada para buscar cotações
  const fetchCotacoes = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("cotacoes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      // Converte as datas de string para Date e garante que são datas válidas
      const cotacoesFormatadas = data.map(
        (cotacao: Cotacao | { dataAtualizacao?: string }) => {
          let dataAtualizacao: Date;
          if ("data_atualizacao" in cotacao && cotacao.data_atualizacao) {
            dataAtualizacao = new Date(cotacao.data_atualizacao);
          } else if (
            "dataAtualizacao" in cotacao &&
            typeof cotacao.dataAtualizacao === "string"
          ) {
            dataAtualizacao = new Date(cotacao.dataAtualizacao);
          } else {
            dataAtualizacao = new Date();
          }
          return {
            ...cotacao,
            data_atualizacao: isNaN(dataAtualizacao.getTime())
              ? new Date()
              : dataAtualizacao,
          } as Cotacao;
        }
      );
      setCotacoes(cotacoesFormatadas);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro ao carregar cotações",
        description: message,
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCotacoes();
  }, [fetchCotacoes]);

  // Adapta para inserir na tabela cotacoes
  const handleAddProduto = async (novoProduto: Produto) => {
    try {
      const cotacao = produtoToCotacao(novoProduto);
      const { data, error } = await supabase
        .from("cotacoes")
        .insert([cotacao])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setCotacoes((prev) => [data, ...prev]);
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

  // Atualiza cotação na tabela cotacoes
  const handleEditProduto = async (id: string, produtoEditado: Produto) => {
    try {
      const cotacao = produtoToCotacao(produtoEditado);
      const { error } = await supabase
        .from("cotacoes")
        .update(cotacao)
        .eq("id", id);

      if (error) throw error;

      setCotacoes((prev) =>
        prev.map((cotacao) =>
          cotacao.id === id
            ? { ...cotacao, ...produtoToCotacao(produtoEditado) }
            : cotacao
        )
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
      id: "",
      dataAtualizacao: new Date(),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Remove cotação da tabela cotacoes
  const handleRemoveProduto = async (id: string) => {
    if (window.confirm("Tem certeza que deseja remover esta cotação?")) {
      try {
        const { error } = await supabase.from("cotacoes").delete().eq("id", id);
        if (error) throw error;
        setCotacoes((prev) => prev.filter((cotacao) => cotacao.id !== id));
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

  // Limpa todas as cotações
  const handleClearAllProdutos = async () => {
    if (
      window.confirm(
        "Tem certeza que deseja limpar todas as cotações e começar do zero?"
      )
    ) {
      try {
        const { error } = await supabase
          .from("cotacoes")
          .delete()
          .neq("id", "0");
        if (error) throw error;
        setCotacoes([]);
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
  const isMelhorPreco = (cotacao: Cotacao) => {
    const cotacoesComMesmoNome = cotacoes.filter(
      (p) => p.nome === cotacao.nome
    );
    const menorPreco = Math.min(
      ...cotacoesComMesmoNome.map((p) => Number(p.preco_unitario) || 0)
    );
    return Number(cotacao.preco_unitario) === menorPreco;
  };

  // Ordenar cotações
  const cotacoesOrdenadas = [...cotacoes].sort((a, b) => {
    const repA = a.representante || "";
    const repB = b.representante || "";
    const representanteComparison = repA.localeCompare(repB);
    if (representanteComparison !== 0) return representanteComparison;

    const aEhMenorPreco = isMelhorPreco(a);
    const bEhMenorPreco = isMelhorPreco(b);

    if (aEhMenorPreco && !bEhMenorPreco) return 1;
    if (!aEhMenorPreco && bEhMenorPreco) return -1;

    return (Number(b.preco_unitario) || 0) - (Number(a.preco_unitario) || 0);
  });

  // Conversão para Produto[] para UI components
  const produtosUI: Produto[] = cotacoesOrdenadas.map(cotacaoToProduto);

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
          disabled={cotacoes.length === 0}
        >
          <Trash2 className="h-4 w-4" />
          Limpar Cotações
        </Button>
      </div>

      <StatsSummary produtos={produtosUI} />

      <div className="flex flex-col gap-6">
        <CotacaoForm
          onAddProduto={handleAddProduto}
          initialData={produtoParaDuplicar}
        />
        <CotacaoTable
          produtos={produtosUI}
          onEditProduto={handleEditProduto}
          onDuplicateProduto={handleDuplicateProduto}
          onRemoveProduto={handleRemoveProduto}
          isMelhorPreco={(produto) => {
            // Recebe Produto, converte para Cotacao para lógica
            const cotacao = produtoToCotacao(produto);
            return isMelhorPreco(cotacao);
          }}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
};

export default Index;
