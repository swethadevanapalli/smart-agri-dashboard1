import { Sprout, Cloud, Satellite, Image } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md"></div>
              <div className="relative bg-agri-gradient p-2 rounded-lg">
                <Sprout className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">AgriSmart</h1>
              <p className="text-xs text-muted-foreground">Smart Agriculture Monitoring</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <NavItem icon={Satellite} label="Satellite" />
            <NavItem icon={Cloud} label="Weather" />
            <NavItem icon={Image} label="Analysis" />
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavItem({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
