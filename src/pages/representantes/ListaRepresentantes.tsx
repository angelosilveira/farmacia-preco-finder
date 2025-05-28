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
import { toast } from "@/components/ui/use-toast";
import { Users, Search, Edit, Trash2, PhoneCall, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Representante {
  id: string;
  nome: string;
  empresa: string;
  telefone: string;
  email: string;
}

export default function ListaRepresentantes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [representantes, setRepresentantes] = useState<Representante[]>([]);

  useEffect(() => {
    fetchRepresentantes();
  }, []);

  async function fetchRepresentantes() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("representantes")
        .select("*")
        .order("nome");

      if (error) throw error;

      setRepresentantes(data || []);
    } catch (error) {
      console.error("Erro ao buscar representantes:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os representantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const filteredRepresentantes = representantes.filter((rep) =>
    Object.values(rep).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleEdit = (id: string) => {
    // Implementar edição
    console.log("Editar representante:", id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja remover este representante?")) {
      try {
        const { error } = await supabase
          .from("representantes")
          .delete()
          .eq("id", id);

        if (error) throw error;

        setRepresentantes((prev) => prev.filter((rep) => rep.id !== id));
        toast({
          title: "Sucesso",
          description: "Representante removido com sucesso.",
        });
      } catch (error) {
        console.error("Erro ao remover representante:", error);
        toast({
          title: "Erro",
          description: "Não foi possível remover o representante.",
          variant: "destructive",
        });
      }
    }
  };
  const handleWhatsApp = (telefone: string) => {
    const numero = telefone.replace(/\D/g, "");
    window.open(`https://wa.me/55${numero}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">
          Carregando representantes...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Lista de Representantes</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar representantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRepresentantes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <div className="flex flex-col items-center py-4 text-muted-foreground">
                    <Users className="h-10 w-10 mb-2" />
                    <p>Nenhum representante encontrado.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredRepresentantes.map((representante) => (
                <TableRow key={representante.id}>
                  <TableCell className="font-medium">
                    {representante.nome}
                  </TableCell>
                  <TableCell>{representante.empresa}</TableCell>
                  <TableCell>{representante.telefone}</TableCell>
                  <TableCell>{representante.email}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleWhatsApp(representante.telefone)}
                      >
                        <PhoneCall className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(representante.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(representante.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
