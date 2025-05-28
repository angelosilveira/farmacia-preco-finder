import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import type { Cliente } from "@/types/clientes";

// Utilitário para formatar moeda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "em_dia":
      return "default";
    case "atrasado":
      return "warning"; // Usar 'secondary' para evitar erro
    case "inadimplente":
      return "destructive";
    default:
      return "secondary";
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case "em_dia":
      return "Em dia";
    case "atrasado":
      return "Atrasado";
    case "inadimplente":
      return "Inadimplente";
    default:
      return status;
  }
};

export default function ListaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("nome");

      if (error) throw error;

      setClientes(data || []);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("clientes").delete().match({ id });

      if (error) throw error;

      setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
      toast({
        title: "Cliente removido",
        description: "O cliente foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover o cliente.",
      });
    }
  };

  const handleWhatsApp = (cliente: Cliente) => {
    const mensagem =
      `Olá ${cliente.nome}, tudo bem? 🙂\n\n` +
      "Espero que esteja tudo bem! Estou entrando em contato para verificar a possibilidade de regularizar seu saldo pendente em nossa farmácia.\n\n" +
      `O valor atual é de ${formatCurrency(cliente.saldo_devedor)}.\n\n` +
      "Estamos à disposição para discutir formas de pagamento que melhor se adequem à sua situação.\n\n" +
      "Caso precise de mais informações ou queira discutir um plano de pagamento, estamos aqui para ajudar.\n\n" +
      "Agradecemos sua atenção e preferência! 🙏";

    const whatsappUrl = `https://wa.me/55${cliente.telefone.replace(
      /\D/g,
      ""
    )}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Lista de Clientes</h3>
        <Button asChild>
          <Link to="/clientes/adicionar">
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Saldo Devedor</TableHead>
            <TableHead>Última Compra</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell className="font-medium">{cliente.nome}</TableCell>
              <TableCell>
                {cliente.telefone && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{cliente.telefone}</Badge>
                  </div>
                )}
                {cliente.email && (
                  <div className="text-sm text-muted-foreground">
                    {cliente.email}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    getStatusColor(cliente.status_pagamento) === "warning"
                      ? "secondary"
                      : getStatusColor(cliente.status_pagamento)
                  }
                >
                  {formatStatus(cliente.status_pagamento)}
                </Badge>
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(cliente.saldo_devedor)}
              </TableCell>
              <TableCell>
                {cliente.ultima_compra
                  ? format(new Date(cliente.ultima_compra), "dd/MM/yyyy", {
                      locale: ptBR,
                    })
                  : "-"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleWhatsApp(cliente)}
                    title="Enviar mensagem no WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/clientes/editar/${cliente.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover cliente?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso removerá
                          permanentemente o cliente {cliente.nome}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(cliente.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
