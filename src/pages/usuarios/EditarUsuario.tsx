import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export default function EditarUsuario() {
  const { id } = useParams();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) fetchUsuario();
    // eslint-disable-next-line
  }, [id]);

  async function fetchUsuario() {
    setLoading(true);
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) {
      toast({ variant: "destructive", title: "Usuário não encontrado" });
      navigate("/usuarios");
      return;
    }
    setNome(data.nome);
    setEmail(data.email);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || !email) {
      toast({ variant: "destructive", title: "Preencha nome e email" });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("usuarios")
      .update({ nome, email })
      .eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Erro ao atualizar usuário" });
    } else {
      toast({ title: "Usuário atualizado com sucesso" });
      navigate("/usuarios");
    }
    setLoading(false);
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Editar Usuário</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={loading}
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
