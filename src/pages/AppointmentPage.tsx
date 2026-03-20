import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  MapPin, 
  Star, 
  ChevronLeft,
  ChevronRight,
  Search,
  Stethoscope,
  User,
  Shield,
  Heart,
  Award,
  Phone,
  MessageSquare,
  CheckCircle,
  Building2
} from 'lucide-react';
import Header from '@/components/shared/Header';
import AIAssistant from '@/components/shared/AIAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import './AppointmentPage.css';

// 轮播图数据
const BANNER_SLIDES = [
  {
    id: 1,
    image: '/banner-doctor-1.jpg',
    title: '专业乳腺科医生团队',
    subtitle: '20年临床经验，守护您的乳腺健康',
    cta: '立即预约',
  },
  {
    id: 2,
    image: '/banner-doctor-2.jpg',
    title: '多学科联合会诊',
    subtitle: '汇集乳腺外科、肿瘤科、影像科专家',
    cta: '了解详情',
  },
  {
    id: 3,
    image: '/banner-doctor-3.jpg',
    title: '一对一健康咨询',
    subtitle: '耐心解答您的每一个疑问',
    cta: '免费咨询',
  },
];

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
    available: true,
    nextAvailable: '明天 09:00',
    price: '¥50',
    tags: ['专家', '热门'],
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
    available: true,
    nextAvailable: '今天 14:00',
    price: '¥30',
    tags: ['专家'],
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
    available: false,
    nextAvailable: '后天 10:00',
    price: '¥20',
    tags: [],
  },
  {
    id: 4,
    name: '陈医生',
    title: '乳腺科主任医师',
    hospital: '协和医院',
    department: '乳腺外科',
    rating: 4.9,
    consultations: 4520,
    experience: '25年',
    specialty: '乳腺癌保乳手术、乳房重建',
    avatar: '陈',
    available: true,
    nextAvailable: '明天 14:00',
    price: '¥100',
    tags: ['专家', '知名'],
  },
  {
    id: 5,
    name: '刘医生',
    title: '乳腺科副主任医师',
    hospital: '肿瘤医院',
    department: '乳腺肿瘤科',
    rating: 4.8,
    consultations: 2890,
    experience: '18年',
    specialty: '乳腺癌化疗、靶向治疗',
    avatar: '刘',
    available: true,
    nextAvailable: '今天 16:00',
    price: '¥40',
    tags: ['专家'],
  },
  {
    id: 6,
    name: '赵医生',
    title: '乳腺科主治医师',
    hospital: '市第一人民医院',
    department: '乳腺外科',
    rating: 4.6,
    consultations: 1560,
    experience: '10年',
    specialty: '乳腺超声诊断、微创活检',
    avatar: '赵',
    available: true,
    nextAvailable: '明天 10:00',
    price: '¥25',
    tags: [],
  },
];

// 服务特色 - 带弹窗内容
const SERVICES = [
  { 
    icon: Shield, 
    title: '专业诊疗', 
    desc: '资深专家团队',
    dialogTitle: '专业诊疗服务',
    dialogContent: [
      '汇聚全国知名乳腺科专家',
      '平均临床经验超过15年',
      '乳腺癌早期诊断准确率达98%',
      '采用国际先进诊疗技术',
      '多学科联合会诊模式'
    ]
  },
  { 
    icon: Heart, 
    title: '贴心服务', 
    desc: '全程陪诊服务',
    dialogTitle: '贴心服务体系',
    dialogContent: [
      '一对一专属健康顾问',
      '全程陪诊，省心省力',
      '术前术后关怀服务',
      '定期随访，跟踪康复',
      '心理疏导与情绪支持'
    ]
  },
  { 
    icon: Award, 
    title: '权威认证', 
    desc: '三甲医院合作',
    dialogTitle: '权威认证资质',
    dialogContent: [
      '与50+三甲医院深度合作',
      '国家卫健委认证平台',
      'ISO9001质量管理体系认证',
      '患者隐私保护认证',
      '医疗数据安全等级保护'
    ]
  },
  { 
    icon: Phone, 
    title: '24小时热线', 
    desc: '随时为您解答',
    dialogTitle: '24小时服务热线',
    dialogContent: [
      '400-123-4567 全天候服务',
      '专业医护团队在线答疑',
      '紧急情况快速响应',
      '预约挂号绿色通道',
      '健康咨询与用药指导'
    ]
  },
];

// 医院列表数据
const HOSPITALS = [
  { name: '市中心医院', level: '三甲', address: '市中心区健康路1号', distance: '1.2km' },
  { name: '省人民医院', level: '三甲', address: '省城区人民大道88号', distance: '3.5km' },
  { name: '协和医院', level: '三甲', address: '市东区协和路168号', distance: '5.8km' },
  { name: '肿瘤医院', level: '三甲', address: '市南区抗癌路66号', distance: '4.2km' },
  { name: '市妇幼保健院', level: '三甲', address: '市西区妇幼路33号', distance: '2.1km' },
  { name: '市第一人民医院', level: '三甲', address: '市北区医院路99号', distance: '6.5km' },
  { name: '中医药大学附属医院', level: '三甲', address: '市东区中医路77号', distance: '7.2km' },
  { name: '军区总医院', level: '三甲', address: '市南区军管路55号', distance: '8.1km' },
  { name: '市第二人民医院', level: '三甲', address: '市西区解放路22号', distance: '3.8km' },
  { name: '国际医疗中心', level: '特需', address: '市CBD国际路100号', distance: '4.5km' },
  { name: '市中医院', level: '三甲', address: '市北区中山东路11号', distance: '5.2km' },
  { name: '市儿童医院', level: '三甲', address: '市南区儿童路88号', distance: '6.8km' },
  { name: '市第三人民医院', level: '三甲', address: '市北区建设路55号', distance: '4.8km' },
  { name: '市第四人民医院', level: '三甲', address: '市南区和平路88号', distance: '5.5km' },
  { name: '市第五人民医院', level: '三甲', address: '市东区解放大道66号', distance: '6.2km' },
  { name: '市第六人民医院', level: '三甲', address: '市西区人民路99号', distance: '7.0km' },
  { name: '市第七人民医院', level: '三甲', address: '市北区工业路33号', distance: '5.8km' },
  { name: '市第八人民医院', level: '三甲', address: '市南区文化路77号', distance: '6.5km' },
  { name: '市第九人民医院', level: '三甲', address: '市东区科技路44号', distance: '7.5km' },
  { name: '市第十人民医院', level: '三甲', address: '市西区教育路22号', distance: '8.0km' },
];

// 统计数据
const STATS = [
  { value: '50+', label: '合作医院' },
  { value: '200+', label: '专业医生' },
  { value: '10万+', label: '服务患者' },
  { value: '98%', label: '满意度' },
];

// 时间段数据
const TIME_SLOTS = [
  { time: '08:00-08:30', available: true },
  { time: '08:30-09:00', available: true },
  { time: '09:00-09:30', available: false },
  { time: '09:30-10:00', available: true },
  { time: '10:00-10:30', available: true },
  { time: '10:30-11:00', available: false },
  { time: '14:00-14:30', available: true },
  { time: '14:30-15:00', available: true },
  { time: '15:00-15:30', available: true },
  { time: '15:30-16:00', available: false },
];

export default function AppointmentPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<typeof DOCTORS[0] | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingStep, setBookingStep] = useState(1);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    phone: '',
    idCard: '',
    symptoms: '',
  });
  const [activeServiceDialog, setActiveServiceDialog] = useState<number | null>(null);

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // 过滤医生
  const filteredDoctors = DOCTORS.filter(doctor => {
    return doctor.name.includes(searchQuery) || 
      doctor.hospital.includes(searchQuery) ||
      doctor.specialty.includes(searchQuery);
  });

  // 生成日期选项
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        display: i === 0 ? '今天' : i === 1 ? '明天' : `${date.getMonth() + 1}月${date.getDate()}日`,
        weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()],
      });
    }
    return dates;
  };

  const dates = generateDates();

  // 处理预约
  const handleBook = () => {
    if (bookingStep === 1) {
      if (!selectedDate || !selectedTime) {
        toast.error('请选择预约日期和时间');
        return;
      }
      setBookingStep(2);
    } else {
      if (!patientInfo.name || !patientInfo.phone) {
        toast.error('请填写完整信息');
        return;
      }
      toast.success('预约成功！', {
        description: `您已预约${selectedDoctor?.name}医生 ${selectedDate} ${selectedTime}`,
      });
      setShowBookingDialog(false);
      setBookingStep(1);
      setSelectedDate('');
      setSelectedTime('');
      setPatientInfo({ name: '', phone: '', idCard: '', symptoms: '' });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  };

  return (
    <div className="page-bg">
      <Header onSearch={() => {}} />
      
      <div className="appointment-page">
        {/* 轮播图区域 */}
        <div className="banner-section">
          <div className="banner-slider">
            {BANNER_SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="banner-overlay" />
                <div className="banner-content">
                  <h2 className="banner-title">{slide.title}</h2>
                  <p className="banner-subtitle">{slide.subtitle}</p>
                  <Link to="/consult">
                    <Button className="banner-cta">{slide.cta}</Button>
                  </Link>
                </div>
              </div>
            ))}
            
            {/* 轮播控制 */}
            <button className="banner-nav prev" onClick={prevSlide}>
              <ChevronLeft size={24} />
            </button>
            <button className="banner-nav next" onClick={nextSlide}>
              <ChevronRight size={24} />
            </button>
            
            {/* 轮播指示器 */}
            <div className="banner-dots">
              {BANNER_SLIDES.map((_, index) => (
                <button
                  key={index}
                  className={`banner-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 服务特色 - 可点击 */}
        <div className="services-section">
          <div className="services-container">
            {SERVICES.map((service, index) => (
              <div 
                key={index} 
                className="service-item"
                onClick={() => setActiveServiceDialog(index)}
              >
                <div className="service-icon-wrapper">
                  <service.icon size={28} />
                </div>
                <div className="service-text">
                  <div className="service-title">{service.title}</div>
                  <div className="service-desc">{service.desc}</div>
                </div>
                <div className="service-click-hint">点击查看</div>
              </div>
            ))}
          </div>
        </div>

        <div className="appointment-container">
          {/* 搜索栏 */}
          <div className="search-section">
            <div className="search-box large">
              <Search size={20} />
              <Input
                placeholder="搜索医生姓名、医院或专长..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* 医生网格 */}
          <div className="doctors-section">
            <div className="section-header">
              <h2 className="section-title">专业医生团队</h2>
              <span className="section-count">共 {filteredDoctors.length} 位医生</span>
            </div>
            <div className="doctors-grid">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="doctor-card" onClick={() => {
                  setSelectedDoctor(doctor);
                  setShowBookingDialog(true);
                  setBookingStep(1);
                }}>
                  <div className="doctor-avatar-large">{doctor.avatar}</div>
                  <div className="doctor-info">
                    <div className="doctor-name-row">
                      <span className="doctor-name">{doctor.name}</span>
                      {doctor.tags.map((tag, idx) => (
                        <span key={idx} className={`doctor-tag ${tag === '热门' ? 'hot' : ''}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="doctor-title">{doctor.title}</div>
                    <div className="doctor-hospital">
                      <MapPin size={12} />
                      {doctor.hospital}
                    </div>
                    <div className="doctor-stats-row">
                      <span className="stat-item">
                        <Star size={12} />
                        {doctor.rating}分
                      </span>
                      <span className="stat-item">
                        <User size={12} />
                        {doctor.consultations}次
                      </span>
                      <span className="stat-item">
                        <Clock size={12} />
                        {doctor.experience}
                      </span>
                    </div>
                    <div className="doctor-specialty">{doctor.specialty}</div>
                  </div>
                  <div className="doctor-card-footer">
                    <div className="price">{doctor.price}</div>
                    <Button 
                      className="book-btn"
                      disabled={!doctor.available}
                    >
                      {doctor.available ? '立即预约' : '约满'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 统计数据 */}
          <div className="stats-section">
            <div className="stats-grid">
              {STATS.map((stat, index) => (
                <div key={index} className="stat-box">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 预约须知 */}
          <div className="appointment-tips">
            <div className="tips-header">
              <Stethoscope size={18} />
              <span>预约须知</span>
            </div>
            <ul className="tips-list">
              <li>请提前15分钟到达医院，携带身份证和医保卡</li>
              <li>如需取消预约，请提前2小时操作</li>
              <li>首次就诊建议携带既往检查报告</li>
              <li>如有紧急情况，请拨打24小时热线：400-123-4567</li>
            </ul>
          </div>
        </div>

        {/* 底部医院列表 */}
        <div className="hospitals-section">
          <div className="hospitals-container">
            <div className="hospitals-header">
              <div className="hospitals-icon">
                <Building2 size={28} />
              </div>
              <div className="hospitals-title-wrapper">
                <h2 className="hospitals-title">合作医院</h2>
                <p className="hospitals-subtitle">覆盖全市优质医疗资源，为您提供便捷的就医服务</p>
              </div>
            </div>
            <div className="hospitals-grid">
              {HOSPITALS.map((hospital, index) => (
                <div key={index} className="hospital-card">
                  <div className="hospital-header">
                    <h4 className="hospital-name">{hospital.name}</h4>
                    <span className="hospital-level">{hospital.level}</span>
                  </div>
                  <div className="hospital-info">
                    <div className="hospital-address">
                      <MapPin size={14} />
                      {hospital.address}
                    </div>
                    <div className="hospital-distance">
                      <span className="distance-badge">{hospital.distance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI助手浮动按钮 */}
      <AIAssistant />

      {/* 预约弹窗 */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-lg booking-dialog">
          <DialogHeader>
            <DialogTitle>
              {bookingStep === 1 ? '选择预约时间' : '填写就诊信息'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedDoctor && (
            <div className="booking-doctor-info">
              <div className="booking-doctor-avatar">{selectedDoctor.avatar}</div>
              <div className="booking-doctor-details">
                <div className="booking-doctor-name">{selectedDoctor.name}</div>
                <div className="booking-doctor-title">{selectedDoctor.title} · {selectedDoctor.hospital}</div>
              </div>
            </div>
          )}

          {bookingStep === 1 ? (
            <div className="booking-step-1">
              <div className="date-selection">
                <label className="selection-label">选择日期</label>
                <div className="date-list">
                  {dates.map((date) => (
                    <button
                      key={date.date}
                      className={`date-item ${selectedDate === date.date ? 'active' : ''}`}
                      onClick={() => setSelectedDate(date.date)}
                    >
                      <span className="date-display">{date.display}</span>
                      <span className="date-weekday">{date.weekday}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div className="time-selection">
                  <label className="selection-label">选择时间</label>
                  <div className="time-grid">
                    {TIME_SLOTS.map((slot, idx) => (
                      <button
                        key={idx}
                        className={`time-item ${selectedTime === slot.time ? 'active' : ''} ${!slot.available ? 'disabled' : ''}`}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                      >
                        {slot.time}
                        {!slot.available && <span className="time-status">约满</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="booking-step-2">
              <div className="form-group">
                <label>就诊人姓名 <span className="required">*</span></label>
                <Input
                  placeholder="请输入真实姓名"
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>手机号码 <span className="required">*</span></label>
                <Input
                  placeholder="请输入手机号码"
                  value={patientInfo.phone}
                  onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>身份证号</label>
                <Input
                  placeholder="请输入身份证号（选填）"
                  value={patientInfo.idCard}
                  onChange={(e) => setPatientInfo({ ...patientInfo, idCard: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>症状描述</label>
                <textarea
                  className="symptoms-input"
                  placeholder="请简要描述您的症状或咨询目的"
                  value={patientInfo.symptoms}
                  onChange={(e) => setPatientInfo({ ...patientInfo, symptoms: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="booking-summary">
                <div className="summary-item">
                  <span>预约时间：</span>
                  <strong>{selectedDate} {selectedTime}</strong>
                </div>
                <div className="summary-item">
                  <span>挂号费用：</span>
                  <strong className="price">{selectedDoctor?.price}</strong>
                </div>
              </div>
            </div>
          )}

          <div className="booking-actions">
            {bookingStep === 2 && (
              <Button variant="outline" onClick={() => setBookingStep(1)}>
                上一步
              </Button>
            )}
            <Button className="confirm-btn" onClick={handleBook}>
              {bookingStep === 1 ? '下一步' : '确认预约'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 服务特色弹窗 */}
      <Dialog open={activeServiceDialog !== null} onOpenChange={() => setActiveServiceDialog(null)}>
        <DialogContent className="sm:max-w-md service-dialog">
          {activeServiceDialog !== null && (
            <>
              <DialogHeader>
                <DialogTitle className="service-dialog-title">
                  <div className="service-dialog-icon">
                    {(() => {
                      const IconComponent = SERVICES[activeServiceDialog].icon;
                      return <IconComponent size={24} />;
                    })()}
                  </div>
                  {SERVICES[activeServiceDialog].dialogTitle}
                </DialogTitle>
              </DialogHeader>
              <div className="service-dialog-content">
                <ul className="service-dialog-list">
                  {SERVICES[activeServiceDialog].dialogContent.map((item, idx) => (
                    <li key={idx} className="service-dialog-item">
                      <CheckCircle size={18} className="service-check-icon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="service-dialog-footer">
                <Link to="/consult">
                  <Button className="service-dialog-btn">
                    <MessageSquare size={16} />
                    立即咨询
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
