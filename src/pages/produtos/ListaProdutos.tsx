import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface Produto {
  id: string;
  codigo: string;
  nome: string;
  laboratorio?: string;
  grupo?: string;
  curva_abc?: string;
  estoque: number;
  preco_compra: number;
  preco_custo: number;
  preco_venda: number;
  created_at?: string;
  updated_at?: string;
}

const PAGE_SIZE = 50;

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    fetchProdutos(1, true);
    // eslint-disable-next-line
  }, []);

  async function fetchProdutos(
    pageNumber: number,
    reset = false,
    buscaTerm = busca
  ) {
    setLoading(true);
    const from = (pageNumber - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    let query = supabase
      .from("produtos")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);
    if (buscaTerm) {
      query = query.ilike("nome", `%${buscaTerm}%`);
    }
    const { data, error } = await query;
    if (error) {
      setLoading(false);
      return;
    }
    if (reset) {
      setProdutos(data || []);
    } else {
      setProdutos((prev) => [...prev, ...(data || [])]);
    }
    setHasMore((data?.length || 0) === PAGE_SIZE);
    setLoading(false);
  }

  function handleLoadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProdutos(nextPage);
  }

  function handleBuscar(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchProdutos(1, true, busca);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Produtos</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBuscar} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Buscar produto pelo nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="border rounded px-2 py-1 w-64"
          />
          <Button type="submit" disabled={loading}>
            Buscar
          </Button>
        </form>
        <div className="overflow-x-auto">
          <Table className="min-w-[900px] w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Laboratório</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead>Curva ABC</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Preço Compra</TableHead>
                <TableHead>Preço Custo</TableHead>
                <TableHead>Preço Venda</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.codigo}</TableCell>
                  <TableCell>{p.nome}</TableCell>
                  <TableCell>{p.laboratorio}</TableCell>
                  <TableCell>{p.grupo}</TableCell>
                  <TableCell>{p.curva_abc}</TableCell>
                  <TableCell>{p.estoque}</TableCell>
                  <TableCell>
                    {p.preco_compra.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell>
                    {p.preco_custo.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell>
                    {p.preco_venda.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {hasMore && (
          <div className="flex justify-center mt-4">
            <Button onClick={handleLoadMore} disabled={loading}>
              {loading ? "Carregando..." : "Carregar mais"}
            </Button>
          </div>
        )}
        {!hasMore && produtos.length > 0 && (
          <div className="text-center text-xs text-muted-foreground mt-4">
            Todos os produtos foram carregados.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
