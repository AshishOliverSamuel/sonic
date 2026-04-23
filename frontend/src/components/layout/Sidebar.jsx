import { Home, Search } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
];

function NavItem({ item, mobile = false }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 rounded-md px-3 py-3 font-semibold transition',
          mobile ? 'flex-1 justify-center text-xs' : 'text-sm',
          isActive ? 'bg-sonic-elevated text-white' : 'text-sonic-muted hover:bg-white/5 hover:text-white',
        ].join(' ')
      }
      end={item.to === '/'}
    >
      <Icon className="h-5 w-5" />
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <>
      <aside className="fixed bottom-[90px] left-0 top-0 z-30 hidden w-60 border-r border-sonic-border bg-sonic-sidebar px-4 py-6 md:block">
        <NavLink to="/" className="mb-8 flex items-center gap-3 px-2">
          <img src="/images/logo.jpeg" alt="Sonic" className="h-10 w-10 rounded-md object-cover" />
          <span className="text-2xl font-extrabold tracking-normal text-white">Sonic</span>
        </NavLink>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>
      </aside>

      <nav className="fixed bottom-[90px] left-0 right-0 z-40 flex h-16 items-center gap-2 border-t border-sonic-border bg-sonic-sidebar px-3 md:hidden">
        {navItems.map((item) => (
          <NavItem key={item.to} item={item} mobile />
        ))}
      </nav>
    </>
  );
}

