import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AdicionarUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || !email) {
      toast({ variant: "destructive", title: "Preencha nome e email" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("usuarios").insert([{ nome, email }]);
    if (error) {
      toast({ variant: "destructive", title: "Erro ao cadastrar usuário" });
    } else {
      toast({ title: "Usuário cadastrado com sucesso" });
      navigate("/usuarios");
    }
    setLoading(false);
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Novo Usuário</CardTitle>
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
            {loading ? "Salvando..." : "Cadastrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
