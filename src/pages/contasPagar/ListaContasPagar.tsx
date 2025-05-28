import { useState, useEffect, useRef } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Input as UiInput } from "@/components/ui/input";
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
  const [statusFilter, setStatusFilter] = useState<string>("__all__");
  const [fornecedorFilter, setFornecedorFilter] = useState<string>("__all__");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("__all__");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [partialPayId, setPartialPayId] = useState<string | null>(null);
  const [partialPayOpen, setPartialPayOpen] = useState(false);
  const [partialPayLoading, setPartialPayLoading] = useState(false);
  const [partialPayTotal, setPartialPayTotal] = useState<number>(0);
  const [partialPayValue, setPartialPayValue] = useState<string>("");

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

  async function marcarComoPago(id: string) {
    setPayingId(id);
    const { error } = await supabase
      .from("contas_pagar")
      .update({ status: "pago", data_pagamento: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível marcar como pago.",
      });
    } else {
      toast({
        title: "Conta paga",
        description: "Status atualizado com sucesso.",
      });
      fetchContas();
    }
    setPayingId(null);
  }

  async function handleUploadComprovante(contaId: string, file: File) {
    setUploadingId(contaId);
    const fileExt = file.name.split(".").pop();
    const filePath = `comprovantes/${contaId}_${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("comprovantes")
      .upload(filePath, file);
    if (uploadError) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao enviar comprovante.",
      });
      setUploadingId(null);
      return;
    }
    const { data: urlData } = supabase.storage
      .from("comprovantes")
      .getPublicUrl(filePath);
    const url = urlData?.publicUrl || null;
    const { error: updateError } = await supabase
      .from("contas_pagar")
      .update({ comprovante_url: url })
      .eq("id", contaId);
    if (updateError) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao salvar comprovante.",
      });
    } else {
      toast({
        title: "Comprovante enviado",
        description: "Comprovante anexado com sucesso.",
      });
      fetchContas();
    }
    setUploadingId(null);
  }

  function triggerFileInput(contaId: string) {
    if (fileInputRef.current) {
      fileInputRef.current.dataset.contaId = contaId;
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const contaId = e.target.dataset.contaId;
    if (file && contaId) {
      handleUploadComprovante(contaId, file);
    }
  }

  function openPartialPayDialog(conta: ContaPagarWithJoin) {
    setPartialPayId(conta.id);
    setPartialPayTotal(conta.valor_total);
    setPartialPayValue("");
    setPartialPayOpen(true);
  }

  async function handlePartialPay() {
    if (!partialPayId) return;
    setPartialPayLoading(true);
    const valorPago = parseFloat(
      partialPayValue.replace(/[^\d,.]/g, "").replace(",", ".")
    );
    if (isNaN(valorPago) || valorPago <= 0) {
      toast({
        variant: "destructive",
        title: "Valor inválido",
        description: "Informe um valor válido.",
      });
      setPartialPayLoading(false);
      return;
    }
    const status = valorPago >= partialPayTotal ? "pago" : "em_aberto";
    const { error } = await supabase
      .from("contas_pagar")
      .update({
        valor_pago: valorPago,
        status,
        data_pagamento: status === "pago" ? new Date().toISOString() : null,
      })
      .eq("id", partialPayId);
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível registrar o pagamento.",
      });
    } else {
      toast({
        title: "Pagamento registrado",
        description: "Pagamento parcial salvo com sucesso.",
      });
      fetchContas();
      setPartialPayOpen(false);
    }
    setPartialPayLoading(false);
  }

  // Filtros locais
  const filteredContas = contas.filter((conta) => {
    const matchStatus =
      statusFilter !== "__all__" ? conta.status === statusFilter : true;
    const matchFornecedor =
      fornecedorFilter !== "__all__"
        ? conta.fornecedor_id === fornecedorFilter
        : true;
    const matchCategoria =
      categoriaFilter !== "__all__"
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
              <SelectItem value="__all__">Todos</SelectItem>
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
              <SelectItem value="__all__">Todos</SelectItem>
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
              <SelectItem value="__all__">Todas</SelectItem>
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={payingId === conta.id}
                        title="Marcar como pago"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Marcar como pago?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja marcar esta conta como paga?
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => marcarComoPago(conta.id)}
                          className="bg-green-600 text-white hover:bg-green-700"
                        >
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    size="sm"
                    variant="ghost"
                    title="Pagamento parcial"
                    onClick={() => openPartialPayDialog(conta)}
                    disabled={payingId === conta.id}
                  >
                    %
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    title="Upload comprovante"
                    onClick={() => triggerFileInput(conta.id)}
                    disabled={uploadingId === conta.id}
                  >
                    <UploadCloud className="h-4 w-4" />
                  </Button>
                  {conta.comprovante_url && (
                    <a
                      href={conta.comprovante_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 underline ml-1"
                    >
                      Ver
                    </a>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <input
        type="file"
        accept="image/*,application/pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={onFileChange}
      />
      <Dialog open={partialPayOpen} onOpenChange={setPartialPayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pagamento Parcial</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div>
              Total da conta: <b>{formatCurrency(partialPayTotal)}</b>
            </div>
            <UiInput
              type="text"
              placeholder="Valor pago (ex: 100,00)"
              value={partialPayValue}
              onChange={(e) => setPartialPayValue(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPartialPayOpen(false)}
              disabled={partialPayLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePartialPay}
              disabled={partialPayLoading || !partialPayValue}
            >
              {partialPayLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
