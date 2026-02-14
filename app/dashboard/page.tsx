"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  UtensilsCrossed,
  ChefHat,
  Leaf,
  Printer,
  Users,
  Landmark,
  ShoppingBag,
  TrendingUp,
  Calendar,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { useSession } from "next-auth/react";

const navigationCards = [
  {
    title: "Categorie",
    description: "Gestisci le categorie del menu",
    icon: ChefHat,
    href: "/dashboard/categories",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
  },
  {
    title: "Cibi",
    description: "Gestisci i prodotti del menu",
    icon: UtensilsCrossed,
    href: "/dashboard/foods",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  {
    title: "Ingredienti",
    description: "Gestisci gli ingredienti disponibili",
    icon: Leaf,
    href: "/dashboard/ingredients",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
  },
  {
    title: "Stampanti",
    description: "Configura le stampanti di rete",
    icon: Printer,
    href: "/dashboard/printers",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    title: "Utenti",
    description: "Gestisci gli utenti del sistema",
    icon: Users,
    href: "/dashboard/users",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  },
  {
    title: "Registratori di Cassa",
    description: "Configura i punti cassa",
    icon: Landmark,
    href: "/dashboard/cash-registers",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
  },
  {
    title: "Ordini",
    description: "Visualizza e gestisci gli ordini",
    icon: ShoppingBag,
    href: "/dashboard/orders",
    color: "text-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();

  const formatName = (name: string | null | undefined) => {
    if (!name) return "Utente";
    const lowerName = name.toLowerCase();
    return lowerName.charAt(0).toUpperCase() + lowerName.slice(1);
  };

  const userName = formatName(session?.user?.name);

  return (
    <div className="space-y-8 p-8">
      {/* Welcome Section */}
      <div className="flex items-center gap-6">
        <div className="shrink-0">
          <Logo width={80} height={80} />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Benvenuto {userName}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Sistema di gestione MySagra - Amministrazione completa della tua sagra
          </p>
        </div>
      </div>

      {/* Info Sagra */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Stato Sagra
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Attiva</div>
            <Badge className="mt-2 bg-green-500 text-white">
              In corso
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Periodo
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2026</div>
            <p className="text-xs text-muted-foreground mt-2">
              Stagione corrente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Località
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Italia</div>
            <p className="text-xs text-muted-foreground mt-2">
              Gestione locale
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Sezioni</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {navigationCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center mb-2`}
                    >
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Suggerimenti Rapidi</CardTitle>
          <CardDescription>
            Inizia dalla configurazione di base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">1.</span>
              <span>
                Configura prima le <strong>Categorie</strong> del menu
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">2.</span>
              <span>
                Aggiungi i <strong>Cibi</strong> e assegnali alle categorie
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">3.</span>
              <span>
                Imposta le <strong>Stampanti</strong> per la cucina
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">4.</span>
              <span>
                Crea gli <strong>Utenti</strong> per il personale
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">5.</span>
              <span>
                Configura i <strong>Registratori di Cassa</strong> nei punti vendita
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
