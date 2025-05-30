import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Produto } from "@/types/cotacao";
import { CategoriaType } from "@/types/categorias";
import { Calculator } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Autocomplete } from "@/components/ui/autocomplete";

interface ProdutoSugestao {
  id: string;
  nome: string;
  categoria?: string;
  unidade_medida?: string;
}

interface RepresentanteDB {
  id: string;
  nome: string;
  contato?: string;
  categorias?: string[];
}

interface CotacaoFormProps {
  onAddProduto: (produto: Produto) => void;
  initialData?: Produto;
}

export function CotacaoForm({ onAddProduto, initialData }: CotacaoFormProps) {
  const [nome, setNome] = useState("");
  const [precoUnitario, setPrecoUnitario] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidadeMedida, setUnidadeMedida] = useState("");
  const [representante, setRepresentante] = useState("");
  const [produtosSugestao, setProdutosSugestao] = useState<ProdutoSugestao[]>(
    []
  );
  const [representantesDB, setRepresentantesDB] = useState<RepresentanteDB[]>(
    []
  );
  const [isLoadingProdutos, setIsLoadingProdutos] = useState(false);
  const [isLoadingRepresentantes, setIsLoadingRepresentantes] = useState(false);

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome);
      setPrecoUnitario(initialData.precoUnitario.toString());
      setQuantidade(initialData.quantidade.toString());
      setUnidadeMedida(initialData.unidadeMedida);
      setRepresentante(initialData.representante);
    } else {
      setNome("");
      setPrecoUnitario("");
      setQuantidade("");
      setUnidadeMedida("");
      setRepresentante("");
    }
  }, [initialData]);

  // Buscar representantes do Supabase ao carregar
  useEffect(() => {
    async function fetchRepresentantes() {
      setIsLoadingRepresentantes(true);
      const { data, error } = await supabase
        .from("representantes")
        .select("id, nome");
      if (!error && data) {
        setRepresentantesDB(data);
      } else {
        setRepresentantesDB([]);
      }
      setIsLoadingRepresentantes(false);
    }
    fetchRepresentantes();
  }, []);

  // Função para buscar produtos do Supabase conforme o texto digitado
  const fetchProdutos = useCallback(async (termo: string) => {
    if (!termo || termo.length < 2) {
      setProdutosSugestao([]);
      return;
    }
    setIsLoadingProdutos(true);
    const { data, error } = await supabase
      .from("produtos")
      .select("id, nome, grupo")
      .ilike("nome", `%${termo}%`)
      .limit(10);
    if (!error && data) {
      setProdutosSugestao(
        (
          data as {
            id: string;
            nome: string;
            grupo?: string;
          }[]
        ).map((p) => ({
          id: p.id,
          nome: p.nome,
          categoria: p.grupo, // usa grupo como categoria
        }))
      );
    } else {
      setProdutosSugestao([]);
    }
    setIsLoadingProdutos(false);
  }, []);

  // Handler para quando o usuário digita no autocomplete
  const handleNomeChange = (value: string) => {
    setNome(value);
    fetchProdutos(value);
  };

  // Handler para quando o usuário seleciona um produto sugerido
  const handleProdutoSelect = (option: {
    value: string;
    label: string;
    produto: ProdutoSugestao;
  }) => {
    const produto = option.produto;
    setNome(produto.nome);
    if (produto.unidade_medida) setUnidadeMedida(produto.unidade_medida);
    setProdutosSugestao([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !nome ||
      !precoUnitario ||
      !quantidade ||
      !unidadeMedida ||
      !representante
    ) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    const precoUnit = parseFloat(precoUnitario);
    const qtd = parseInt(quantidade);
    const precoTotal = precoUnit * qtd;
    const novoProduto: Produto = {
      id: crypto.randomUUID(),
      nome,
      categoria: "Outros", // valor padrão já que não existe mais campo
      precoUnitario: precoUnit,
      quantidade: qtd,
      unidadeMedida,
      precoTotal,
      representante,
      dataAtualizacao: new Date(),
    };

    onAddProduto(novoProduto);

    // Limpar formulário
    setNome("");
    setPrecoUnitario("");
    setQuantidade("");
    setUnidadeMedida("");
    setRepresentante("");
  };

  const precoTotal =
    precoUnitario && quantidade
      ? (parseFloat(precoUnitario) * parseInt(quantidade)).toFixed(2)
      : "0.00";

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          {initialData ? "Duplicar Cotação" : "Nova Cotação de Medicamento"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto</Label>
              <Autocomplete
                value={nome}
                onInputChange={handleNomeChange}
                onSelect={handleProdutoSelect}
                options={produtosSugestao.map((p) => ({
                  value: p.nome,
                  label: p.nome,
                  produto: p,
                }))}
                loading={isLoadingProdutos}
                placeholder="Ex: Dipirona 500mg"
                inputProps={{
                  id: "nome",
                  required: true,
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="representante">Representante</Label>
              <Select
                value={representante}
                onValueChange={setRepresentante}
                required
                disabled={isLoadingRepresentantes}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingRepresentantes ? "Carregando..." : "Selecione"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {representantesDB.map((rep) => (
                    <SelectItem key={rep.id} value={rep.nome}>
                      {rep.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="precoUnitario">Preço Unitário (R$)</Label>
              <Input
                id="precoUnitario"
                type="number"
                step="0.01"
                value={precoUnitario}
                onChange={(e) => setPrecoUnitario(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unidadeMedida">Unidade</Label>
              <Select
                value={unidadeMedida}
                onValueChange={setUnidadeMedida}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Comprimido">Comprimido</SelectItem>
                  <SelectItem value="Cápsula">Cápsula</SelectItem>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="mg">mg</SelectItem>
                  <SelectItem value="Frasco">Frasco</SelectItem>
                  <SelectItem value="Tubo">Tubo</SelectItem>
                  <SelectItem value="Caixa">Caixa</SelectItem>
                  <SelectItem value="Unidade">Unidade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Preço Total:</span>
              <span className="text-2xl font-bold text-green-600">
                R$ {precoTotal}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            {initialData ? "Duplicar Cotação" : "Adicionar Cotação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
