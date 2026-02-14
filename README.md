<div align="center">

<p align="center">
  <img src="public/banner.png" alt="Banner" width="100%" />
</p>
</div>

# MyAmministratore

> Pannello di amministrazione per MySagra - Sistema di gestione ordini e cucina per sagre ed eventi

## 📋 Descrizione

MyAmministratore è un'applicazione web moderna per la gestione completa di sagre ed eventi. Permette di amministrare categorie, cibi, ingredienti, ordini, casse, stampanti e utenti attraverso un'interfaccia intuitiva e responsive.

## ✨ Funzionalità

- 🍽️ **Gestione Cucina**
  - Categorie con upload immagini
  - Cibi e piatti con ingredienti
  - Gestione ingredienti e allergeni
  
- 📦 **Gestione Ordini**
  - Visualizzazione e monitoraggio ordini in tempo reale
  - Stati ordine personalizzabili
  
- 💰 **Gestione Casse**
  - Configurazione casse multiple
  - Monitoraggio transazioni
  
- 🖨️ **Stampanti**
  - Configurazione stampanti di rete
  - Gestione code di stampa
  
- 👥 **Utenti**
  - Sistema di autenticazione sicuro
  - Gestione ruoli e permessi

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js 5](https://next-auth.js.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 📦 Prerequisiti

- **Node.js** >= 20.x
- **npm** >= 10.x
- **Docker** (opzionale, per deployment)

## 🚀 Installazione Locale

### 1. Clona il repository

```bash
git clone https://github.com/MySagra/myamministratore.git
cd myamministratore
```

### 2. Installa le dipendenze

```bash
npm install
```

### 3. Configura le variabili d'ambiente

Crea un file `.env` nella root del progetto:

```env
# Backend API URL
API_URL=http://localhost:4300

# NextAuth Configuration
AUTH_SECRET=your-secret-key-here
AUTH_URL=http://localhost:5000
```

> **Nota**: Genera `AUTH_SECRET` con: `openssl rand -base64 32`

### 4. Avvia il server di sviluppo

```bash
npm run dev
```

L'applicazione sarà disponibile su **http://localhost:5000**

## 🐳 Deployment con Docker

### Build dell'immagine

```bash
docker compose build
```

### Avvia i container

```bash
docker compose up -d
```

L'applicazione sarà disponibile su **http://localhost:5000**

### Verifica i log

```bash
docker compose logs -f amministratore
```

### Ferma i container

```bash
docker compose down
```

## 📁 Struttura del Progetto

```
myamministratore/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Pagine dashboard
│   ├── login/             # Pagina login
│   └── layout.tsx         # Layout principale
├── components/            # Componenti React
│   ├── dashboard/        # Componenti specifici dashboard
│   └── ui/               # Componenti UI riutilizzabili (Shadcn)
├── actions/              # Server Actions
├── lib/                  # Utilities e configurazioni
│   ├── api.ts           # Client API
│   ├── api-types.ts     # TypeScript types
│   └── auth.ts          # Configurazione NextAuth
├── public/              # Asset statici
└── docker-compose.yml   # Configurazione Docker
```

## 🔧 Scripts Disponibili

```bash
npm run dev      # Avvia il server di sviluppo (porta 5000)
npm run build    # Build di produzione
npm start        # Avvia il server di produzione (porta 5000)
npm run lint     # Esegue ESLint
```

## 🌐 Variabili d'Ambiente

| Variabile | Descrizione | Default |
|-----------|-------------|---------|
| `API_URL` | URL del backend API | `http://localhost:4300` |
| `AUTH_SECRET` | Secret key per NextAuth | - |
| `AUTH_URL` | URL pubblico dell'applicazione | `http://localhost:5000` |
| `NODE_ENV` | Ambiente di esecuzione | `development` |

## 🤝 Contribuire

Questo progetto fa parte dell'ecosistema **MySagra**. Per contribuire:

1. Fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è parte di MySagra. Per informazioni sulla licenza, visita [MySagra.com](https://mysagra.com)

## 🔗 Link Utili

- [Documentazione MySagra](https://mysagra.com)
- [Supporto Professionale](https://mysagra.com/#professional-services)
- [GitHub MySagra](https://github.com/MySagra)

## 📞 Supporto

Per assistenza e supporto professionale, visita [mysagra.com/#professional-services](https://mysagra.com/#professional-services)

---

Made with ❤️ by [MySagra](https://mysagra.com)
