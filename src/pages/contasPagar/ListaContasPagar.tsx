import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import type { ContaPagar } from "@/types/contasPagar";

// Types for joined data
interface ContaPagarWithJoin extends ContaPagar {
  fornecedor?: { id: string; nome: string } | null;
  categoria?: { id: string; nome: string } | null;
}

export default function ListaContasPagar() {
  const [contas, setContas] = useState<ContaPagarWithJoin[]>([]);
  const [fornecedores, setFornecedores] = useState<
    { id: string; nome: string }[]
  >([]);
  const [categorias, setCategorias] = useState<{ id: string; nome: string }[]>(
    []
  );
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [fornecedorFilter, setFornecedorFilter] = useState<string>("");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilters();
    fetchContas();
  }, []);

  async function fetchFilters() {
    const { data: forn } = await supabase
      .from("fornecedores")
      .select("id, nome")
      .order("nome");
    setFornecedores(forn || []);
    const { data: cats } = await supabase
      .from("categorias_despesa")
      .select("id, nome")
      .order("nome");
    setCategorias(cats || []);
  }

  async function fetchContas() {
    setLoading(true);
    const { data, error } = await supabase
      .from("contas_pagar")
      .select(
        "*, fornecedor:fornecedores(id, nome), categoria:categorias_despesa(id, nome)"
      )
      .order("data_vencimento", { ascending: true });
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as contas.",
      });
      setLoading(false);
      return;
    }
    setContas(data || []);
    setLoading(false);
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "em_aberto":
        return "default";
      case "pago":
        return "secondary";
      case "atrasado":
        return "destructive";
      default:
        return "secondary";
    }
  }

  function formatStatus(status: string) {
    switch (status) {
      case "em_aberto":
        return "Em Aberto";
      case "pago":
        return "Pago";
      case "atrasado":
        return "Atrasado";
      default:
        return status;
    }
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  // Filtros locais
  const filteredContas = contas.filter((conta) => {
    const matchStatus = statusFilter ? conta.status === statusFilter : true;
    const matchFornecedor = fornecedorFilter
      ? conta.fornecedor_id === fornecedorFilter
      : true;
    const matchCategoria = categoriaFilter
      ? conta.categoria_id === categoriaFilter
      : true;
    const matchSearch = search
      ? conta.descricao.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchStatus && matchFornecedor && matchCategoria && matchSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-end justify-between">
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="em_aberto">Em Aberto</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="atrasado">Atrasado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={fornecedorFilter} onValueChange={setFornecedorFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Fornecedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {fornecedores.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              {categorias.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          className="w-56"
          placeholder="Buscar descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7}>Carregando...</TableCell>
            </TableRow>
          ) : filteredContas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>Nenhuma conta encontrada.</TableCell>
            </TableRow>
          ) : (
            filteredContas.map((conta) => (
              <TableRow key={conta.id}>
                <TableCell>{conta.descricao}</TableCell>
                <TableCell>{conta.fornecedor?.nome || "-"}</TableCell>
                <TableCell>{conta.categoria?.nome || "-"}</TableCell>
                <TableCell>{formatCurrency(conta.valor_total)}</TableCell>
                <TableCell>
                  {format(new Date(conta.data_vencimento), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(conta.status)}>
                    {formatStatus(conta.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                  <Button size="sm" variant="ghost">
                    Pagar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
