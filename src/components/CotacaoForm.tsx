import React, { useState, useMemo, useEffect } from "react";
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
import { CategoriaType, REPRESENTANTES } from "@/types/categorias";
import { Calculator } from "lucide-react";

interface CotacaoFormProps {
  onAddProduto: (produto: Produto) => void;
  initialData?: Produto;
}

export function CotacaoForm({ onAddProduto, initialData }: CotacaoFormProps) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<CategoriaType | "">(
    "Medicamentos"
  );
  const [precoUnitario, setPrecoUnitario] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidadeMedida, setUnidadeMedida] = useState("");
  const [representante, setRepresentante] = useState("");

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome);
      setCategoria(initialData.categoria);
      setPrecoUnitario(initialData.precoUnitario.toString());
      setQuantidade(initialData.quantidade.toString());
      setUnidadeMedida(initialData.unidadeMedida);
      setRepresentante(initialData.representante);
    } else {
      // Clear form when initialData is removed, but keep Medicamentos as default category
      setNome("");
      setCategoria("Medicamentos");
      setPrecoUnitario("");
      setQuantidade("");
      setUnidadeMedida("");
      setRepresentante("");
    }
  }, [initialData]);

  // Filtra os representantes baseado na categoria selecionada
  const representantesFiltrados = useMemo(() => {
    if (!categoria) return [];
    return REPRESENTANTES.filter((rep) =>
      rep.categorias.includes(categoria)
    ).map((rep) => rep.nome);
  }, [categoria]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !nome ||
      !categoria ||
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
      categoria: categoria as CategoriaType,
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
    setCategoria("");
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
              <Input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Dipirona 500mg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={categoria}
                onValueChange={(value) => {
                  setCategoria(value as CategoriaType);
                  setRepresentante("");
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Medicamentos">Medicamentos</SelectItem>
                  <SelectItem value="Perfumaria">Perfumaria</SelectItem>
                  <SelectItem value="Higiene Pessoal">
                    Higiene Pessoal
                  </SelectItem>
                  <SelectItem value="Cosméticos">Cosméticos</SelectItem>
                  <SelectItem value="Dermocosméticos">
                    Dermocosméticos
                  </SelectItem>
                  <SelectItem value="Nutrição">Nutrição</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="representante">Representante</Label>
              <Select
                value={representante}
                onValueChange={setRepresentante}
                required
                disabled={!categoria}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      categoria ? "Selecione" : "Selecione categoria"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {representantesFiltrados.map((rep) => (
                    <SelectItem key={rep} value={rep}>
                      {rep}
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
