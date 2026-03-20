import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Search,
  ChevronRight,
  Stethoscope,
  Heart,
  Scan
} from 'lucide-react';
import Header from '@/components/shared/Header';
import AIAssistant from '@/components/shared/AIAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import './MyDoctorsPage.css';

// 医生数据
const DOCTORS = [
  {
    id: 1,
    name: '李医生',
    title: '乳腺科主任医师',
    hospital: '市中心医院',
    department: '乳腺外科',
    rating: 4.9,
    consultations: 3280,
    experience: '20年',
    specialty: '乳腺癌早期诊断、乳腺微创手术',
    avatar: '李',
    isOnline: true,
    bodyPart: 'left-breast',
    bodyPartName: '左乳',
    color: '#ff6b9d',
  },
  {
    id: 2,
    name: '王医生',
    title: '乳腺科副主任医师',
    hospital: '省人民医院',
    department: '乳腺肿瘤科',
    rating: 4.8,
    consultations: 2156,
    experience: '15年',
    specialty: '乳腺癌综合治疗、术后康复',
    avatar: '王',
    isOnline: false,
    bodyPart: 'right-breast',
    bodyPartName: '右乳',
    color: '#40e0d0',
  },
  {
    id: 3,
    name: '张医生',
    title: '乳腺科主治医师',
    hospital: '市妇幼保健院',
    department: '乳腺科',
    rating: 4.7,
    consultations: 1890,
    experience: '12年',
    specialty: '乳腺增生、乳腺良性肿瘤',
    avatar: '张',
    isOnline: true,
    bodyPart: 'lymph',
    bodyPartName: '淋巴系统',
    color: '#8b5cf6',
  },
];

// 身体部位
const BODY_PARTS = [
  { id: 'left-breast', name: '左乳', x: 35, y: 38, color: '#ff6b9d' },
  { id: 'right-breast', name: '右乳', x: 65, y: 38, color: '#40e0d0' },
  { id: 'lymph', name: '淋巴', x: 50, y: 22, color: '#8b5cf6' },
  { id: 'chest', name: '胸部', x: 50, y: 32, color: '#f59e0b' },
];

export default function MyDoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<typeof DOCTORS[0] | null>(null);
  const [showDoctorDetail, setShowDoctorDetail] = useState(false);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // 过滤医生
  const filteredDoctors = DOCTORS.filter(doctor => {
    return doctor.name.includes(searchQuery) || 
      doctor.hospital.includes(searchQuery) ||
      doctor.specialty.includes(searchQuery);
  });

  // 处理在线咨询
  const handleConsult = (e: React.MouseEvent, doctor: typeof DOCTORS[0]) => {
    e.stopPropagation();
    toast.success(`正在连接${doctor.name}医生...`);
  };

  // 查看医生详情
  const viewDoctorDetail = (doctor: typeof DOCTORS[0]) => {
    setSelectedDoctor(doctor);
    setShowDoctorDetail(true);
  };

  return (
    <div className="page-bg">
      <Header onSearch={() => {}} />
      
      <div className="mydoctors-page">
        {/* 页面标题 */}
        <div className="page-header-section">
          <h1 className="page-title">我的医生</h1>
          <p className="page-subtitle">管理您的专属医疗团队，一目了然的健康守护</p>
        </div>

        <div className="mydoctors-container">
          {/* 搜索栏 */}
          <div className="search-section">
            <div className="search-box">
              <Search size={18} />
              <Input
                placeholder="搜索医生姓名、医院或专长..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* 主体内容 */}
          <div className="main-content">
            {/* 左侧医生列表 */}
            <div className="doctors-section">
              <div className="section-header">
                <h2 className="section-title">
                  <Stethoscope size={18} />
                  我的医生团队
                </h2>
                <span className="section-count">{filteredDoctors.length} 位医生</span>
              </div>
              
              <div className="doctors-list">
                {filteredDoctors.map((doctor) => (
                  <div 
                    key={doctor.id} 
                    className="doctor-card-enhanced"
                    onClick={() => viewDoctorDetail(doctor)}
                    onMouseEnter={() => setHoveredPart(doctor.bodyPart)}
                    onMouseLeave={() => setHoveredPart(null)}
                  >
                    <div className="doctor-card-header">
                      <div className={`doctor-avatar-enhanced ${doctor.isOnline ? 'online' : ''}`} style={{ background: doctor.color }}>
                        {doctor.avatar}
                      </div>
                      <div className="doctor-header-info">
                        <div className="name-row">
                          <span className="doctor-name">{doctor.name}</span>
                          {doctor.isOnline && <span className="online-dot"></span>}
                        </div>
                        <div className="doctor-title">{doctor.title}</div>
                        <div className="body-part-tag" style={{ background: `${doctor.color}20`, color: doctor.color }}>
                          负责：{doctor.bodyPartName}
                        </div>
                      </div>
                    </div>
                    
                    <div className="doctor-card-body">
                      <div className="info-row">
                        <MapPin size={14} />
                        <span>{doctor.hospital}</span>
                      </div>
                      <div className="info-row">
                        <Star size={14} />
                        <span>{doctor.rating}分 · {doctor.consultations}次咨询</span>
                      </div>
                      <div className="specialty">{doctor.specialty}</div>
                    </div>
                    
                    <div className="doctor-card-footer">
                      <Button 
                        className="consult-btn-sm"
                        onClick={(e) => handleConsult(e, doctor)}
                      >
                        <MessageSquare size={14} />
                        咨询
                      </Button>
                      <Link to="/appointment">
                        <Button variant="outline" className="appointment-btn-sm">
                          <Calendar size={14} />
                          预约
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 右侧人体透视图 */}
            <div className="body-map-section">
              <div className="body-map-card">
                <h3 className="body-map-title">
                  <Scan size={18} />
                  健康监测透视图
                </h3>
                
                <div className="body-visual-enhanced">
                  {/* 人体透视图SVG */}
                  <svg viewBox="0 0 300 420" className="body-svg-enhanced">
                    <defs>
                      {/* 透视效果渐变 */}
                      <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#e8f4f8" />
                        <stop offset="50%" stopColor="#f0f9ff" />
                        <stop offset="100%" stopColor="#e8f4f8" />
                      </linearGradient>
                      
                      {/* 骨骼渐变 */}
                      <linearGradient id="boneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#e2e8f0" />
                      </linearGradient>
                      
                      {/* 器官渐变 */}
                      <radialGradient id="organGradient">
                        <stop offset="0%" stopColor="#ffe4ec" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ffc4d6" stopOpacity="0.6" />
                      </radialGradient>
                      
                      {/* 高亮发光效果 */}
                      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {/* 身体轮廓 - 半透明 */}
                    <ellipse cx="150" cy="55" rx="45" ry="50" fill="url(#bodyGradient)" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6"/>
                    
                    {/* 颈部 */}
                    <path d="M135 95 L135 115 L165 115 L165 95" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.7"/>
                    
                    {/* 胸腔轮廓 - 半透明 */}
                    <path d="M75 115 Q150 105 225 115 L235 200 Q150 210 65 200 Z" fill="url(#bodyGradient)" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.5"/>
                    
                    {/* 肋骨轮廓 - 透视效果 */}
                    <ellipse cx="150" cy="145" rx="70" ry="35" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.6"/>
                    <ellipse cx="150" cy="165" rx="65" ry="30" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.5"/>
                    <ellipse cx="150" cy="182" rx="58" ry="25" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.4"/>
                    
                    {/* 脊柱 */}
                    <line x1="150" y1="115" x2="150" y2="200" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" opacity="0.5"/>
                    
                    {/* 锁骨 */}
                    <path d="M85 125 Q150 115 215 125" fill="none" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
                    
                    {/* 左乳 - 透视效果 */}
                    <ellipse 
                      cx="115" cy="155" rx="32" ry="28" 
                      fill={hoveredPart === 'left-breast' ? '#ff6b9d' : 'url(#organGradient)'}
                      stroke={hoveredPart === 'left-breast' ? '#ff4d94' : '#ffb3c9'}
                      strokeWidth={hoveredPart === 'left-breast' ? '3' : '2'}
                      opacity={hoveredPart === 'left-breast' ? '1' : '0.85'}
                      className="body-part-organ"
                      filter={hoveredPart === 'left-breast' ? 'url(#glow)' : ''}
                    />
                    {/* 左乳内部结构线 */}
                    <ellipse cx="115" cy="155" rx="20" ry="16" fill="none" stroke={hoveredPart === 'left-breast' ? '#fff' : '#ffb3c9'} strokeWidth="1" opacity="0.5"/>
                    <ellipse cx="115" cy="155" rx="10" ry="8" fill="none" stroke={hoveredPart === 'left-breast' ? '#fff' : '#ffb3c9'} strokeWidth="1" opacity="0.3"/>
                    
                    {/* 右乳 - 透视效果 */}
                    <ellipse 
                      cx="185" cy="155" rx="32" ry="28" 
                      fill={hoveredPart === 'right-breast' ? '#40e0d0' : 'url(#organGradient)'}
                      stroke={hoveredPart === 'right-breast' ? '#20b2aa' : '#ffb3c9'}
                      strokeWidth={hoveredPart === 'right-breast' ? '3' : '2'}
                      opacity={hoveredPart === 'right-breast' ? '1' : '0.85'}
                      className="body-part-organ"
                      filter={hoveredPart === 'right-breast' ? 'url(#glow)' : ''}
                    />
                    {/* 右乳内部结构线 */}
                    <ellipse cx="185" cy="155" rx="20" ry="16" fill="none" stroke={hoveredPart === 'right-breast' ? '#fff' : '#ffb3c9'} strokeWidth="1" opacity="0.5"/>
                    <ellipse cx="185" cy="155" rx="10" ry="8" fill="none" stroke={hoveredPart === 'right-breast' ? '#fff' : '#ffb3c9'} strokeWidth="1" opacity="0.3"/>
                    
                    {/* 腋下淋巴 - 左侧 */}
                    <circle 
                      cx="70" cy="130" r="15" 
                      fill={hoveredPart === 'lymph' ? '#8b5cf6' : '#ede9fe'}
                      stroke={hoveredPart === 'lymph' ? '#7c3aed' : '#c4b5fd'}
                      strokeWidth={hoveredPart === 'lymph' ? '3' : '2'}
                      opacity={hoveredPart === 'lymph' ? '0.9' : '0.7'}
                      className="body-part-organ"
                      filter={hoveredPart === 'lymph' ? 'url(#glow)' : ''}
                    />
                    {/* 淋巴内部纹理 */}
                    <circle cx="70" cy="130" r="8" fill="none" stroke={hoveredPart === 'lymph' ? '#fff' : '#c4b5fd'} strokeWidth="1" opacity="0.5"/>
                    <line x1="62" y1="130" x2="78" y2="130" stroke={hoveredPart === 'lymph' ? '#fff' : '#c4b5fd'} strokeWidth="1" opacity="0.4"/>
                    <line x1="70" y1="122" x2="70" y2="138" stroke={hoveredPart === 'lymph' ? '#fff' : '#c4b5fd'} strokeWidth="1" opacity="0.4"/>
                    
                    {/* 腋下淋巴 - 右侧 */}
                    <circle 
                      cx="230" cy="130" r="15" 
                      fill={hoveredPart === 'lymph' ? '#8b5cf6' : '#ede9fe'}
                      stroke={hoveredPart === 'lymph' ? '#7c3aed' : '#c4b5fd'}
                      strokeWidth={hoveredPart === 'lymph' ? '3' : '2'}
                      opacity={hoveredPart === 'lymph' ? '0.9' : '0.7'}
                      className="body-part-organ"
                      filter={hoveredPart === 'lymph' ? 'url(#glow)' : ''}
                    />
                    {/* 淋巴内部纹理 */}
                    <circle cx="230" cy="130" r="8" fill="none" stroke={hoveredPart === 'lymph' ? '#fff' : '#c4b5fd'} strokeWidth="1" opacity="0.5"/>
                    <line x1="222" y1="130" x2="238" y2="130" stroke={hoveredPart === 'lymph' ? '#fff' : '#c4b5fd'} strokeWidth="1" opacity="0.4"/>
                    <line x1="230" y1="122" x2="230" y2="138" stroke={hoveredPart === 'lymph' ? '#fff' : '#c4b5fd'} strokeWidth="1" opacity="0.4"/>
                    
                    {/* 颈部淋巴 */}
                    <circle 
                      cx="150" cy="95" r="12" 
                      fill={hoveredPart === 'lymph' ? '#8b5cf6' : '#ede9fe'}
                      stroke={hoveredPart === 'lymph' ? '#7c3aed' : '#c4b5fd'}
                      strokeWidth={hoveredPart === 'lymph' ? '3' : '2'}
                      opacity={hoveredPart === 'lymph' ? '0.9' : '0.6'}
                      className="body-part-organ"
                      filter={hoveredPart === 'lymph' ? 'url(#glow)' : ''}
                    />
                    
                    {/* 心脏 - 位于两乳之间偏左 */}
                    <path 
                      d="M140 140 Q135 135 140 130 Q145 135 150 140 Q155 135 160 130 Q165 135 160 140 Q150 155 140 140" 
                      fill="#fecaca" 
                      stroke="#f87171" 
                      strokeWidth="1" 
                      opacity="0.5"
                    />
                    
                    {/* 肺部轮廓 */}
                    <ellipse cx="100" cy="145" rx="25" ry="30" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" opacity="0.3"/>
                    <ellipse cx="200" cy="145" rx="25" ry="30" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" opacity="0.3"/>
                    
                    {/* 标注线 - 左乳 */}
                    <line x1="83" y1="155" x2="50" y2="155" stroke="#ff6b9d" strokeWidth="1.5" strokeDasharray="4,2" opacity={hoveredPart === 'left-breast' ? '1' : '0.5'}/>
                    <circle cx="50" cy="155" r="4" fill="#ff6b9d" opacity={hoveredPart === 'left-breast' ? '1' : '0.5'}/>
                    
                    {/* 标注线 - 右乳 */}
                    <line x1="217" y1="155" x2="250" y2="155" stroke="#40e0d0" strokeWidth="1.5" strokeDasharray="4,2" opacity={hoveredPart === 'right-breast' ? '1' : '0.5'}/>
                    <circle cx="250" cy="155" r="4" fill="#40e0d0" opacity={hoveredPart === 'right-breast' ? '1' : '0.5'}/>
                    
                    {/* 标注线 - 淋巴 */}
                    <line x1="150" y1="83" x2="150" y2="55" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4,2" opacity={hoveredPart === 'lymph' ? '1' : '0.5'}/>
                    <circle cx="150" cy="55" r="4" fill="#8b5cf6" opacity={hoveredPart === 'lymph' ? '1' : '0.5'}/>
                  </svg>
                  
                  {/* 部位标签 */}
                  <div className="body-labels-enhanced">
                    {BODY_PARTS.map((part) => (
                      <div 
                        key={part.id}
                        className={`body-label-enhanced ${hoveredPart === part.id ? 'active' : ''}`}
                        style={{ 
                          left: `${part.x}%`, 
                          top: `${part.y}%`,
                          background: part.color,
                        }}
                      >
                        {part.name}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="body-map-legend-enhanced">
                  {DOCTORS.map((doctor) => (
                    <div 
                      key={doctor.id} 
                      className={`legend-item-enhanced ${hoveredPart === doctor.bodyPart ? 'active' : ''}`}
                      onMouseEnter={() => setHoveredPart(doctor.bodyPart)}
                      onMouseLeave={() => setHoveredPart(null)}
                    >
                      <div className="legend-info">
                        <span className="legend-dot" style={{ background: doctor.color }}></span>
                        <span className="legend-name">{doctor.bodyPartName}</span>
                      </div>
                      <span className="legend-doctor">{doctor.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 健康提示 */}
              <div className="health-tips-card-enhanced">
                <div className="tips-header">
                  <Heart size={16} />
                  <span>健康小贴士</span>
                </div>
                <p>每月进行一次乳腺自我检查，40岁以上建议每年进行专业筛查。发现异常请及时就医。</p>
              </div>
            </div>
          </div>

          {/* 添加更多医生 */}
          <div className="add-more-section">
            <p>需要寻找更多专业医生？</p>
            <Link to="/appointment">
              <Button className="browse-btn">
                浏览全部医生
                <ChevronRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* AI助手浮动按钮 */}
      <AIAssistant />

      {/* 医生详情弹窗 */}
      <Dialog open={showDoctorDetail} onOpenChange={setShowDoctorDetail}>
        <DialogContent className="sm:max-w-md doctor-detail-dialog">
          {selectedDoctor && (
            <>
              <DialogHeader>
                <DialogTitle>医生详情</DialogTitle>
              </DialogHeader>
              
              <div className="detail-content">
                <div className={`detail-avatar ${selectedDoctor.isOnline ? 'online' : ''}`} style={{ background: selectedDoctor.color }}>
                  {selectedDoctor.avatar}
                </div>
                
                <div className="detail-header">
                  <div className="detail-name-row">
                    <span className="detail-name">{selectedDoctor.name}</span>
                    <span className="detail-title">{selectedDoctor.title}</span>
                  </div>
                  {selectedDoctor.isOnline && <span className="detail-online-badge">在线</span>}
                </div>
                
                <div className="detail-body-part" style={{ background: `${selectedDoctor.color}20`, color: selectedDoctor.color }}>
                  负责部位：{selectedDoctor.bodyPartName}
                </div>
                
                <div className="detail-hospital">
                  <MapPin size={14} />
                  {selectedDoctor.hospital} · {selectedDoctor.department}
                </div>
                
                <div className="detail-specialty">{selectedDoctor.specialty}</div>
                
                <div className="detail-stats">
                  <div className="detail-stat">
                    <span className="stat-value">{selectedDoctor.rating}</span>
                    <span className="stat-label">评分</span>
                  </div>
                  <div className="detail-stat">
                    <span className="stat-value">{selectedDoctor.consultations}</span>
                    <span className="stat-label">咨询量</span>
                  </div>
                  <div className="detail-stat">
                    <span className="stat-value">{selectedDoctor.experience}</span>
                    <span className="stat-label">经验</span>
                  </div>
                </div>
              </div>

              <div className="detail-actions">
                <Link to="/consult" className="action-btn-wide">
                  <Button className="consult-btn-wide">
                    <MessageSquare size={16} />
                    立即咨询
                  </Button>
                </Link>
                <Link to="/appointment" className="action-btn-wide">
                  <Button variant="outline" className="appointment-btn-wide">
                    <Calendar size={16} />
                    预约挂号
                  </Button>
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
