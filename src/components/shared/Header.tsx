import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User, 
  Menu, 
  X,
  MessageSquare,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import './Header.css';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const navItems = [
  { path: '/', label: '首页', icon: Heart },
  { path: '/consult', label: '在线咨询', icon: MessageSquare },
  { path: '/appointment', label: '预约挂号', icon: MessageSquare },
  { path: '/reports', label: '检查报告', icon: MessageSquare },
  { path: '/doctors', label: '我的医生', icon: User },
  { path: '/faq', label: '常见问题', icon: MessageSquare },
  { path: '/emergency', label: '紧急联系', icon: Bell },
];

export default function Header({ onSearch }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const handleSearch = () => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
    setIsSearchOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <div className="logo-icon">
            <Heart size={24} />
          </div>
          <div className="logo-text">
            <span className="logo-title">乳此安心</span>
            <span className="logo-subtitle">乳腺癌防治平台</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          {/* Search */}
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <button className="action-btn" title="搜索">
                <Search size={20} />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>搜索</DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-2 mt-4">
                <Input
                  placeholder="搜索医生、疾病、文章..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search size={18} />
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Notifications */}
          <button className="action-btn" title="通知">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>

          {/* User */}
          <button className="action-btn user" title="个人中心">
            <User size={20} />
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="action-btn mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav-items">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
