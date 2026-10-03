import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  FolderTree,
  Image,
  Building2,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInquiries } from '../../services/db';
import { SEO } from '../../components/SEO';

export const AdminLayout: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newInquiriesCount, setNewInquiriesCount] = useState<number>(0);

  useEffect(() => {
    async function checkNewInquiries() {
      try {
        const inqs = await getInquiries();
        const count = inqs.filter(i => (i.status || '').toLowerCase() === 'new').length;
        setNewInquiriesCount(count);
      } catch (err) {
        console.warn("Inquiry count notice:", err);
      }
    }
    checkNewInquiries();
  }, [location.pathname]);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products', path: '/admin/products', icon: Layers },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Gallery', path: '/admin/gallery', icon: Image },
    { name: 'Projects', path: '/admin/projects', icon: Building2 },
    { name: 'Inquiries', path: '/admin/inquiries', icon: Inbox },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] flex flex-col md:flex-row text-[#2C2926]">
      <SEO
        title="MOZAIK Admin Console"
        description="Protected administration area for MOZAIK natural stone collection."
        noIndex={true}
      />
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#1C1A18] text-white p-4 flex items-center justify-between border-b border-[#2C2926]">
        <div className="flex items-center space-x-2">
          <span className="font-serif text-xl tracking-[0.2em] font-medium">MOZAIK</span>
          <span className="text-[9px] uppercase tracking-wider text-[#D4CCB8] bg-[#2C2926] px-2 py-0.5">Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-[#D4CCB8] hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1C1A18] text-[#EFECE6] flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Mark in Sidebar */}
          <div className="p-6 border-b border-[#2C2926]">
            <Link to="/admin" className="block">
              <span className="font-serif text-2xl tracking-[0.2em] font-medium text-white block">
                MOZAIK
              </span>
              <span className="text-[10px] tracking-[0.3em] text-[#D4CCB8] uppercase block mt-0.5 font-mono">
                ADMIN
              </span>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 text-xs uppercase tracking-[0.16em] transition-colors rounded-xs ${
                    active
                      ? 'bg-[#2C2926] text-white font-medium border-l-2 border-[#D4CCB8]'
                      : 'text-[#A89F8D] hover:text-white hover:bg-[#2C2926]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#D4CCB8]" />
                    <span>{item.name}</span>
                  </div>
                  {item.name === 'Inquiries' && newInquiriesCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-semibold">
                      {newInquiriesCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Status & Actions */}
        <div className="p-4 border-t border-[#2C2926] space-y-3">
          <div className="px-4 py-2 bg-[#2C2926]/60 rounded-xs">
            <span className="text-[10px] text-[#A89F8D] uppercase tracking-wider block">
              Active Curator
            </span>
            <span className="text-xs text-white truncate block font-mono">
              {user?.email || 'mohrivai991@gmail.com'}
            </span>
          </div>

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-2 text-xs text-[#D4CCB8] hover:text-white hover:bg-[#2C2926] rounded-xs transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Live Website
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-red-300 hover:text-white hover:bg-red-950/60 rounded-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
