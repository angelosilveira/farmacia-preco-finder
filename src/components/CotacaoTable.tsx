import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Produto, MelhorPreco } from "@/types/cotacao";
import { REPRESENTANTES } from "@/types/categorias";
import {
  ShoppingCart,
  Edit,
  Save,
  X,
  Copy,
  Trash2,
  MessageCircle,
} from "lucide-react";

interface CotacaoTableProps {
  produtos: Produto[];
  onEditProduto: (id: string, produto: Produto) => void;
  onDuplicateProduto: (produto: Produto) => void;
  onRemoveProduto: (id: string) => void;
  isMelhorPreco: (produto: Produto) => boolean;
  formatCurrency: (value: number) => string;
}

export function CotacaoTable({
  produtos,
  onEditProduto,
  onDuplicateProduto,
  onRemoveProduto,
  isMelhorPreco,
  formatCurrency,
}: CotacaoTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Produto | null>(null);
  // Estado para seleção dos produtos ganhadores por representante
  const [produtosSelecionados, setProdutosSelecionados] = useState<
    Record<string, Set<string>>
  >(
    {} // { representante: Set<produto.id> }
  );

  // Handler para marcar/desmarcar produto
  const handleToggleProduto = (representante: string, produtoId: string) => {
    setProdutosSelecionados((prev) => {
      const atual = new Set(prev[representante] || []);
      if (atual.has(produtoId)) {
        atual.delete(produtoId);
      } else {
        atual.add(produtoId);
      }
      return { ...prev, [representante]: atual };
    });
  };

  // Agrupa produtos por nome
  const produtosAgrupados = produtos.reduce((acc, produto) => {
    if (!acc[produto.nome]) {
      acc[produto.nome] = [];
    }
    acc[produto.nome].push(produto);
    return acc;
  }, {} as Record<string, Produto[]>);

  // Ordena os grupos de produtos por nome e encontra os menores preços
  const gruposProdutos = Object.entries(produtosAgrupados)
    .map(([nome, produtos]) => ({
      nome,
      produtos: produtos.sort((a, b) => a.precoUnitario - b.precoUnitario),
      menorPreco: Math.min(...produtos.map((p) => p.precoUnitario)),
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome));

  // Agrupa apenas os produtos com menor preço por representante
  const representantesGrupos = produtos.reduce((acc, produto) => {
    const grupo = gruposProdutos.find((g) => g.nome === produto.nome);
    if (!grupo) return acc;

    // Só inclui o produto se ele tiver o menor preço do seu grupo
    if (produto.precoUnitario === grupo.menorPreco) {
      if (!acc[produto.representante]) {
        acc[produto.representante] = new Map();
      }
      acc[produto.representante].set(produto.nome, produto);
    }
    return acc;
  }, {} as Record<string, Map<string, Produto>>);

  // Converte o Map para array e ordena por representante
  const representantes = Object.entries(representantesGrupos)
    .map(([representante, produtosMap]) => ({
      representante,
      produtos: Array.from(produtosMap.values()).sort((a, b) =>
        a.nome.localeCompare(b.nome)
      ),
    }))
    .sort((a, b) => a.representante.localeCompare(b.representante));

  const calcularDiferencaPercentual = (produto: Produto) => {
    const produtosDoGrupo = produtosAgrupados[produto.nome];
    const menorPreco = Math.min(
      ...produtosDoGrupo.map((p) => Number(p.precoUnitario) || 0)
    );
    const precoUnit = Number(produto.precoUnitario) || 0;
    if (precoUnit === menorPreco) return null;
    if (!menorPreco || !isFinite(menorPreco)) return null;
    const diferenca = ((precoUnit - menorPreco) / menorPreco) * 100;
    return Math.round(diferenca * 100) / 100;
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date:", date);
      return "Data inválida";
    }
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  };

  const handleEdit = (produto: Produto) => {
    setEditingId(produto.id);
    setEditData({ ...produto });
  };

  const handleSave = () => {
    if (editData) {
      const precoUnit = Number(editData.precoUnitario) || 0;
      const qtd = Number(editData.quantidade) || 0;
      const precoTotal = precoUnit * qtd;
      const produtoAtualizado: Produto = {
        ...editData,
        precoUnitario: precoUnit,
        quantidade: qtd,
        precoTotal,
        dataAtualizacao: new Date(),
      };
      onEditProduto(editData.id, produtoAtualizado);
      setEditingId(null);
      setEditData(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData(null);
  };

  const updateEditData = (field: keyof Produto, value: string | number) => {
    if (editData) {
      setEditData({
        ...editData,
        [field]: value,
      });
    }
  };

  const criarMensagemWhatsApp = (
    representante: string,
    produtos: Produto[]
  ) => {
    const repInfo = REPRESENTANTES.find((r) => r.nome === representante);
    if (!repInfo?.contato) {
      alert("Número de contato não cadastrado para este representante");
      return null;
    }
    // Filtra apenas os produtos selecionados
    const selecionados = produtosSelecionados[representante]
      ? produtos.filter((p) => produtosSelecionados[representante].has(p.id))
      : produtos;
    if (selecionados.length === 0) {
      alert("Selecione ao menos um produto para enviar ao WhatsApp.");
      return null;
    }
    const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date());
    const mensagem =
      `Olá! Gostaria de fazer um pedido dos seguintes produtos com base nas últimas cotações (${dataFormatada}):\n\n` +
      selecionados
        .map(
          (p) =>
            `- ${p.nome}\n` +
            `  Quantidade: ${p.quantidade} ${p.unidadeMedida}\n` +
            `  Preço acordado: ${formatCurrency(p.precoUnitario)}\n` +
            `  Total: ${formatCurrency(p.precoUnitario * p.quantidade)}`
        )
        .join("\n\n") +
      `\n\nValor total do pedido: ${formatCurrency(
        selecionados.reduce(
          (total, p) => total + p.precoUnitario * p.quantidade,
          0
        )
      )}` +
      "\n\nPor favor, confirmar faturamento e disponibilidade dos produtos. Obrigado!";
    return {
      telefone: repInfo.contato,
      mensagem: encodeURIComponent(mensagem),
    };
  };

  return (
    <div className="space-y-12">
      {" "}
      {/* Aumentado o espaçamento entre as tabelas */}
      {/* Tabela agrupada por produto */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Cotações por Produto ({produtos.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {produtos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma cotação cadastrada ainda.</p>
              <p className="text-sm">
                Adicione uma cotação usando o formulário acima.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Representante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço Unit.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qtd
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diferença
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gruposProdutos.map(({ nome, produtos: produtosGrupo }) => (
                    <React.Fragment key={nome}>
                      {/* Cabeçalho do grupo */}
                      <tr className="bg-gray-50">
                        <td
                          colSpan={9}
                          className="px-6 py-3 text-sm font-semibold text-gray-900 bg-gray-100"
                        >
                          {nome} ({produtosGrupo.length} cotações)
                        </td>
                      </tr>
                      {/* Produtos do grupo */}
                      {produtosGrupo.map((produto) => (
                        <tr
                          key={produto.id}
                          className={`hover:bg-gray-50 ${
                            isMelhorPreco(produto)
                              ? "bg-green-50 border-l-4 border-green-500"
                              : "border-l-4 border-transparent"
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap pl-10">
                            <div className="flex items-center">
                              <div>
                                {editingId === produto.id ? (
                                  <Input
                                    value={editData?.nome || ""}
                                    onChange={(e) =>
                                      updateEditData("nome", e.target.value)
                                    }
                                    className="w-48"
                                  />
                                ) : (
                                  <div className="text-sm text-gray-500">
                                    {produto.nome}
                                  </div>
                                )}
                                {isMelhorPreco(produto) &&
                                  editingId !== produto.id && (
                                    <Badge
                                      variant="default"
                                      className="mt-1 bg-green-600"
                                    >
                                      Menor Preço
                                    </Badge>
                                  )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingId === produto.id ? (
                              <Select
                                value={editData?.representante}
                                onValueChange={(value) =>
                                  updateEditData("representante", value)
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Medley">Medley</SelectItem>
                                  <SelectItem value="EMS">EMS</SelectItem>
                                  <SelectItem value="Eurofarma">
                                    Eurofarma
                                  </SelectItem>
                                  <SelectItem value="Germed">Germed</SelectItem>
                                  <SelectItem value="Neo Química">
                                    Neo Química
                                  </SelectItem>
                                  <SelectItem value="Sanofi">Sanofi</SelectItem>
                                  <SelectItem value="Bayer">Bayer</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge variant="outline">
                                {produto.representante}
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {editingId === produto.id ? (
                              <Input
                                type="number"
                                step="0.01"
                                value={editData?.precoUnitario || ""}
                                onChange={(e) =>
                                  updateEditData(
                                    "precoUnitario",
                                    parseFloat(e.target.value)
                                  )
                                }
                                className="w-24"
                              />
                            ) : (
                              formatCurrency(Number(produto.precoUnitario) || 0)
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {editingId === produto.id ? (
                              <Input
                                type="number"
                                value={editData?.quantidade || ""}
                                onChange={(e) =>
                                  updateEditData(
                                    "quantidade",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-20"
                              />
                            ) : (
                              produto.quantidade
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {editingId === produto.id ? (
                              <Select
                                value={editData?.unidadeMedida}
                                onValueChange={(value) =>
                                  updateEditData("unidadeMedida", value)
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Comprimido">
                                    Comprimido
                                  </SelectItem>
                                  <SelectItem value="Cápsula">
                                    Cápsula
                                  </SelectItem>
                                  <SelectItem value="ml">ml</SelectItem>
                                  <SelectItem value="mg">mg</SelectItem>
                                  <SelectItem value="Frasco">Frasco</SelectItem>
                                  <SelectItem value="Tubo">Tubo</SelectItem>
                                  <SelectItem value="Caixa">Caixa</SelectItem>
                                  <SelectItem value="Unidade">
                                    Unidade
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              produto.unidadeMedida
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                            {editingId === produto.id
                              ? formatCurrency(
                                  (Number(editData?.precoUnitario) || 0) *
                                    (Number(editData?.quantidade) || 0)
                                )
                              : formatCurrency(
                                  (Number(produto.precoUnitario) || 0) *
                                    (Number(produto.quantidade) || 0)
                                )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(() => {
                              const diferenca =
                                calcularDiferencaPercentual(produto);
                              if (diferenca === null || isNaN(diferenca))
                                return "-";
                              return (
                                <span className="text-orange-600">
                                  {diferenca.toFixed(1)}% mais caro
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(produto.dataAtualizacao)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {editingId === produto.id ? (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={handleSave}
                                  className="bg-green-600 hover:bg-green-700"
                                  title="Salvar"
                                >
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancel}
                                  title="Cancelar"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(produto)}
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onDuplicateProduto(produto)}
                                  className="text-blue-600 hover:text-blue-700"
                                  title="Duplicar cotação"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onRemoveProduto(produto.id)}
                                  className="text-red-600 hover:text-red-700"
                                  title="Remover cotação"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Tabelas por Representante - Menores Preços */}
      <div className="grid grid-cols-1 gap-8">
        {representantes.map(({ representante, produtos }) => (
          <Card key={representante}>
            <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {representante} - Melhores Preços ({produtos.length})
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-green-600 border-white"
                  onClick={() => {
                    const whatsappInfo = criarMensagemWhatsApp(
                      representante,
                      produtos
                    );
                    if (whatsappInfo) {
                      window.open(
                        `https://wa.me/55${whatsappInfo.telefone}?text=${whatsappInfo.mensagem}`,
                        "_blank"
                      );
                    }
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Enviar WhatsApp
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço Unit.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qtd
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {produtos.map((produto) => (
                      <tr
                        key={produto.id}
                        className={`hover:bg-gray-50 ${
                          isMelhorPreco(produto)
                            ? "bg-green-50 border-l-4 border-green-500"
                            : "border-l-4 border-transparent"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={
                                !!produtosSelecionados[representante]?.has(
                                  produto.id
                                )
                              }
                              onChange={() =>
                                handleToggleProduto(representante, produto.id)
                              }
                              className="accent-green-600"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {produto.nome}
                              </div>
                              {isMelhorPreco(produto) && (
                                <Badge
                                  variant="default"
                                  className="mt-1 bg-green-600"
                                >
                                  Menor Preço
                                </Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(produto.precoUnitario)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {produto.quantidade}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {produto.unidadeMedida}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                          {formatCurrency(produto.precoTotal)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(produto.dataAtualizacao)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onDuplicateProduto(produto)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Duplicar cotação"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
