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
import { ShoppingCart, Edit, Save, X, Copy } from "lucide-react";

interface CotacaoTableProps {
  produtos: Produto[];
  onEditProduto: (id: string, produto: Produto) => void;
  onDuplicateProduto: (produto: Produto) => void;
  isMelhorPreco: (produto: Produto) => boolean;
  formatCurrency: (value: number) => string;
}

export function CotacaoTable({
  produtos,
  onEditProduto,
  onDuplicateProduto,
  isMelhorPreco,
  formatCurrency,
}: CotacaoTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Produto | null>(null);

  // Calcular os melhores preços por produto
  const getMelhoresPrecos = (): MelhorPreco[] => {
    const produtosAgrupados = produtos.reduce((acc, produto) => {
      if (!acc[produto.nome]) {
        acc[produto.nome] = [];
      }
      acc[produto.nome].push(produto);
      return acc;
    }, {} as Record<string, Produto[]>);

    return Object.entries(produtosAgrupados).map(([nome, produtosList]) => {
      const menorPreco = Math.min(...produtosList.map((p) => p.precoUnitario));
      const produtoMenorPreco = produtosList.find(
        (p) => p.precoUnitario === menorPreco
      )!;

      return {
        nome,
        menorPreco,
        representante: produtoMenorPreco.representante,
        unidadeMedida: produtoMenorPreco.unidadeMedida,
      };
    });
  };

  const melhoresPrecos = getMelhoresPrecos();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleEdit = (produto: Produto) => {
    setEditingId(produto.id);
    setEditData({ ...produto });
  };
  const handleSave = () => {
    if (editData) {
      const precoTotal = editData.precoUnitario * editData.quantidade;
      const produtoAtualizado: Produto = {
        ...editData,
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

  return (
    <div className="space-y-6">
      {/* Tabela de Todas as Cotações */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Todas as Cotações ({produtos.length}) - Ordenadas por Preço
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
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
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
                              <div className="text-sm font-medium text-gray-900">
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
                          formatCurrency(produto.precoUnitario)
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
                              <SelectItem value="Cápsula">Cápsula</SelectItem>
                              <SelectItem value="ml">ml</SelectItem>
                              <SelectItem value="mg">mg</SelectItem>
                              <SelectItem value="Frasco">Frasco</SelectItem>
                              <SelectItem value="Tubo">Tubo</SelectItem>
                              <SelectItem value="Caixa">Caixa</SelectItem>
                              <SelectItem value="Unidade">Unidade</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          produto.unidadeMedida
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        {editingId === produto.id
                          ? formatCurrency(
                              (editData?.precoUnitario || 0) *
                                (editData?.quantidade || 0)
                            )
                          : formatCurrency(produto.precoTotal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(produto.dataAtualizacao)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {" "}
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
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
