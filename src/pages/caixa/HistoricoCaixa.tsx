import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Search, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FechamentoCaixa = {
  id: string;
  valor_inicial: number;
  dinheiro: number;
  pix: number;
  cartao_credito: number;
  cartao_debito: number;
  total: number;
  diferenca: number;
  observacoes: string | null;
  data_fechamento: string;
  created_at: string;
  responsavel_nome: string;
};

export default function HistoricoCaixa() {
  const [fechamentos, setFechamentos] = useState<FechamentoCaixa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFechamento, setSelectedFechamento] =
    useState<FechamentoCaixa | null>(null);

  useEffect(() => {
    fetchFechamentos();
  }, []);

  async function fetchFechamentos() {
    try {
      const { data, error } = await supabase
        .from("fechamentos_caixa")
        .select("*")
        .order("data_fechamento", { ascending: false });

      if (error) throw error;

      setFechamentos(data);
    } catch (error) {
      console.error("Erro ao buscar fechamentos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico de fechamentos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const filteredFechamentos = fechamentos.filter((fechamento) => {
    const searchLower = search.toLowerCase();
    const date = format(new Date(fechamento.data_fechamento), "dd/MM/yyyy");
    return (
      date.includes(searchLower) ||
      fechamento.observacoes?.toLowerCase().includes(searchLower) ||
      formatCurrency(fechamento.total).includes(search)
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">
          Carregando histórico de fechamentos...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar fechamentos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[300px]"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Responsável</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Diferença</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFechamentos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground h-24"
                >
                  {search
                    ? "Nenhum fechamento encontrado"
                    : "Nenhum fechamento registrado"}
                </TableCell>
              </TableRow>
            ) : (
              filteredFechamentos.map((fechamento) => (
                <TableRow key={fechamento.id}>
                  <TableCell>{fechamento.responsavel_nome}</TableCell>
                  <TableCell>
                    {format(
                      new Date(fechamento.data_fechamento),
                      "dd/MM/yyyy HH:mm"
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(fechamento.total)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        fechamento.diferenca < 0
                          ? "text-destructive"
                          : fechamento.diferenca > 0
                          ? "text-green-600"
                          : ""
                      }
                    >
                      {formatCurrency(fechamento.diferenca)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {fechamento.observacoes || "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedFechamento(fechamento)}
                      title="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selectedFechamento}
        onOpenChange={() => setSelectedFechamento(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Fechamento</DialogTitle>
            <DialogDescription>
              {selectedFechamento &&
                format(
                  new Date(selectedFechamento.data_fechamento),
                  "dd 'de' MMMM 'de' yyyy, HH:mm",
                  {
                    locale: ptBR,
                  }
                )}
            </DialogDescription>
          </DialogHeader>
          {selectedFechamento && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Valor Inicial</p>
                  <p className="text-lg font-medium">
                    {formatCurrency(selectedFechamento.valor_inicial)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Final</p>
                  <p className="text-lg font-medium">
                    {formatCurrency(selectedFechamento.total)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dinheiro</p>
                  <p className="text-lg font-medium">
                    {formatCurrency(selectedFechamento.dinheiro)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">PIX</p>
                  <p className="text-lg font-medium">
                    {formatCurrency(selectedFechamento.pix)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Cartão de Crédito
                  </p>
                  <p className="text-lg font-medium">
                    {formatCurrency(selectedFechamento.cartao_credito)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Cartão de Débito
                  </p>
                  <p className="text-lg font-medium">
                    {formatCurrency(selectedFechamento.cartao_debito)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Diferença</p>
                <p
                  className={`text-lg font-medium ${
                    selectedFechamento.diferenca < 0
                      ? "text-destructive"
                      : selectedFechamento.diferenca > 0
                      ? "text-green-600"
                      : ""
                  }`}
                >
                  {formatCurrency(selectedFechamento.diferenca)}
                </p>
              </div>

              {selectedFechamento.observacoes && (
                <div>
                  <p className="text-sm text-muted-foreground">Observações</p>
                  <p className="mt-1">{selectedFechamento.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
