import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Loader2, BoxIcon } from "lucide-react";

export default function VisaoGeralCategorias() {
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count, error } = await supabase
          .from("categorias")
          .select("*", { count: "exact", head: true });

        if (error) throw error;
        setTotalCategorias(count || 0);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Total de Categorias
          </CardTitle>
          <BoxIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCategorias}</div>
          <p className="text-xs text-muted-foreground">
            Categorias cadastradas no sistema
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
