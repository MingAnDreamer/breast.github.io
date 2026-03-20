import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Calendar, 
  FileText, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Paperclip, 
  Image, 
  Smile,
  MoreHorizontal,
  PhoneCall,
  Video,
  Star,
  ChevronRight,
  HelpCircle,
  Stethoscope,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Header from '@/components/shared/Header';
import AIAssistant from '@/components/shared/AIAssistant';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import './ConsultPage.css';

// Message Type
interface Message {
  id: string;
  type: 'user' | 'doctor';
  content: string;
  timestamp: Date;
  quickReplies?: string[];
  attachments?: { type: 'image' | 'file'; name: string }[];
}

// Doctor Info
const DOCTOR_INFO = {
  name: '李医生',
  title: '乳腺科主治医师',
  hospital: '市中心医院',
  experience: '15年',
  rating: 4.9,
  consultations: 3280,
  responseTime: '< 5分钟',
  tags: ['乳腺健康', '癌症预防', '术后康复'],
  avatar: '李',
  specialty: '擅长乳腺癌早期筛查、乳腺良性肿瘤诊治、乳腺癌术后康复指导',
};

// Quick Questions
const QUICK_QUESTIONS = [
  '乳腺癌的早期症状有哪些？',
  '如何进行乳腺自我检查？',
  '乳腺癌筛查多久做一次？',
  '术后需要注意什么？',
  '如何缓解化疗副作用？',
  '乳腺增生需要治疗吗？',
];

// FAQ List - 扩展更多问题
const FAQ_LIST = [
  { q: '乳腺癌会遗传吗？', a: '约5-10%的乳腺癌与遗传有关，BRCA基因突变携带者风险较高。' },
  { q: '乳腺增生会变成癌症吗？', a: '单纯性乳腺增生癌变风险极低，但不典型增生需要密切随访。' },
  { q: '哺乳期可以做乳腺检查吗？', a: '建议哺乳期结束后再进行乳腺X光检查，超声检查相对安全。' },
  { q: '乳腺癌术后能怀孕吗？', a: '治疗结束后2-3年，经医生评估后可考虑怀孕。' },
  { q: '乳腺结节需要手术吗？', a: '大多数良性结节无需手术，定期随访即可。恶性或可疑结节需手术。' },
  { q: '男性也会得乳腺癌吗？', a: '男性也可能患乳腺癌，约占所有乳腺癌病例的1%。' },
  { q: '乳腺癌筛查从几岁开始？', a: '一般建议40岁开始筛查，有家族史者可能需要更早开始。' },
  { q: '乳腺疼痛是癌症吗？', a: '大多数乳腺疼痛与月经周期相关，是良性症状，但持续疼痛应就医。' },
];

// Service List with links
const SERVICE_LIST = [
  { 
    icon: Calendar, 
    name: '预约挂号', 
    desc: '快速预约专家号',
    path: '/appointment',
    color: 'appointment'
  },
  { 
    icon: FileText, 
    name: '检查报告', 
    desc: '查看您的检查报告',
    path: '/reports',
    color: 'record'
  },
  { 
    icon: Stethoscope, 
    name: '我的医生', 
    desc: '管理您的医生团队',
    path: '/doctors',
    color: 'consult'
  },
];

// Typing Indicator Component
const TypingIndicator: React.FC = () => (
  <div className="chat-message doctor">
    <div className="chat-message-avatar doctor">{DOCTOR_INFO.avatar}</div>
    <div className="chat-message-content">
      <div className="chat-typing">
        <div className="typing-dots">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
        <span className="typing-text">正在输入...</span>
      </div>
    </div>
  </div>
);

// Message Bubble Component
const MessageBubble: React.FC<{ message: Message; onQuickReply?: (text: string) => void }> = ({ 
  message, 
  onQuickReply 
}) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={`chat-message ${message.type}`}>
      <div className={`chat-message-avatar ${message.type}`}>
        {isUser ? '我' : DOCTOR_INFO.avatar}
      </div>
      <div className="chat-message-content">
        <div className="chat-message-bubble">
          {message.content}
          {message.attachments && message.attachments.length > 0 && (
            <div className="message-attachments">
              {message.attachments.map((att, idx) => (
                <div key={idx} className="message-attachment">
                  {att.type === 'image' ? <Image size={16} /> : <FileText size={16} />}
                  <span>{att.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="chat-message-time">
          {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </div>
        {!isUser && message.quickReplies && message.quickReplies.length > 0 && (
          <div className="chat-quick-replies">
            {message.quickReplies.map((reply, index) => (
              <button 
                key={index} 
                className="chat-quick-reply"
                onClick={() => onQuickReply?.(reply)}
              >
                {reply}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Consult Page Component
const ConsultPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'doctor',
      content: `您好！我是${DOCTOR_INFO.name}，${DOCTOR_INFO.title}。很高兴为您服务！\n\n请问有什么乳腺健康方面的问题需要咨询吗？我会尽力为您解答。`,
      timestamp: new Date(),
      quickReplies: QUICK_QUESTIONS.slice(0, 3),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDoctorDetail, setShowDoctorDetail] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  // Auto scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate doctor response
    setTimeout(() => {
      setIsTyping(false);
      
      const responses: Record<string, string> = {
        '乳腺癌的早期症状有哪些？': '乳腺癌的早期症状包括：\n\n1. 乳房出现无痛性肿块\n2. 乳头溢液，特别是血性溢液\n3. 乳房皮肤出现橘皮样改变或凹陷\n4. 乳头内陷或方向改变\n5. 乳房持续性疼痛\n\n⚠️ 如果您发现以上任何症状，建议尽快就医检查。',
        '如何进行乳腺自我检查？': '乳腺自我检查建议每月进行一次，最佳时间是月经结束后7-10天。\n\n检查步骤：\n1. 观察乳房外观是否有变化\n2. 用手指指腹按压检查是否有肿块\n3. 检查乳头是否有溢液\n\n💡 建议配合专业筛查，40岁以上女性每年进行一次乳腺X光检查。',
        '乳腺癌筛查多久做一次？': '乳腺癌筛查频率建议：\n\n• 40-44岁：可选择每年筛查\n• 45-54岁：建议每年筛查\n• 55岁以上：建议每两年筛查\n\n👨‍⚕️ 有家族史或高风险因素的人群需要更早开始并增加频率。具体方案请咨询您的医生。',
        '术后需要注意什么？': '乳腺癌术后注意事项：\n\n1. 保持伤口清洁干燥\n2. 按医嘱进行功能锻炼\n3. 定期复查，监测恢复情况\n4. 保持乐观心态，积极配合治疗\n5. 合理饮食，保证营养\n\n🏥 如有异常情况，请及时联系您的主治医生。',
        '如何缓解化疗副作用？': '缓解化疗副作用的方法：\n\n1. 恶心呕吐：少食多餐，避免油腻食物\n2. 脱发：使用温和洗发水，避免高温吹风\n3. 疲劳：保证充足睡眠，适当运动\n4. 免疫力下降：注意个人卫生，避免感染\n\n💊 具体用药请遵医嘱，不要自行调整。',
        '乳腺增生需要治疗吗？': '乳腺增生是否需要治疗取决于具体情况：\n\n• 单纯性增生：通常无需特殊治疗，定期复查即可\n• 伴有明显疼痛：可考虑药物治疗\n• 不典型增生：需要密切随访，必要时手术\n\n📋 建议定期做乳腺超声检查，遵医嘱处理。',
      };

      const defaultResponses = [
        '感谢您的咨询。这是一个很好的问题，建议您到医院进行详细检查，医生会根据您的具体情况给出专业建议。如有其他问题，欢迎继续咨询。',
        '您的问题很重要。乳腺健康需要专业评估，建议您预约门诊进行面对面咨询，这样可以获得更准确的诊断和治疗建议。',
        '了解了您的情况。乳腺疾病的诊治需要结合体检和检查结果，建议您点击右侧"预约挂号"预约专家门诊。',
      ];
      
      const defaultResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      
      const doctorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'doctor',
        content: responses[content.trim()] || defaultResponse,
        timestamp: new Date(),
        quickReplies: QUICK_QUESTIONS.filter(q => q !== content.trim()).slice(0, 3),
      };
      
      setMessages(prev => [...prev, doctorMessage]);
    }, 1500 + Math.random() * 1000);
  }, []);

  // Handle send button click
  const handleSend = useCallback(() => {
    sendMessage(inputValue);
  }, [inputValue, sendMessage]);

  // Handle key press
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Handle file upload
  const handleFileUpload = () => {
    toast.info('文件上传功能开发中', {
      description: '您可以先通过文字描述您的情况',
    });
  };

  // Handle image upload
  const handleImageUpload = () => {
    toast.info('图片上传功能开发中', {
      description: '您可以先通过文字描述您的情况',
    });
  };

  // Handle voice call
  const handleVoiceCall = () => {
    toast.info('语音通话功能开发中', {
      description: '请使用文字咨询或预约门诊',
    });
  };

  // Handle video call
  const handleVideoCall = () => {
    toast.info('视频通话功能开发中', {
      description: '请使用文字咨询或预约门诊',
    });
  };

  // Toggle FAQ expand
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = message.timestamp.toLocaleDateString('zh-CN');
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  return (
    <div className="page-bg">
      <Header onSearch={() => {}} />
      
      <div className="consult-page">
        <div className="consult-container">
          {/* 主内容区 - 两栏布局 */}
          <div className="consult-layout">
            {/* 左侧边栏 */}
            <aside className="consult-sidebar">
              <div className="sidebar-card">
                <div className="sidebar-header">
                  <h3 className="sidebar-title">
                    <div className="sidebar-title-icon">
                      <MessageSquare size={16} />
                    </div>
                    服务导航
                  </h3>
                </div>
                <nav className="sidebar-nav">
                  <Link to="/consult" className="sidebar-nav-item active">
                    <div className="sidebar-nav-icon">
                      <MessageSquare size={14} />
                    </div>
                    <span>在线咨询</span>
                    <span className="sidebar-nav-badge">在线</span>
                  </Link>
                  <Link to="/appointment" className="sidebar-nav-item">
                    <div className="sidebar-nav-icon">
                      <Calendar size={14} />
                    </div>
                    <span>预约挂号</span>
                  </Link>
                  <Link to="/reports" className="sidebar-nav-item">
                    <div className="sidebar-nav-icon">
                      <FileText size={14} />
                    </div>
                    <span>检查报告</span>
                  </Link>
                  <Link to="/doctors" className="sidebar-nav-item">
                    <div className="sidebar-nav-icon">
                      <Star size={14} />
                    </div>
                    <span>我的医生</span>
                  </Link>
                  <Link to="/faq" className="sidebar-nav-item">
                    <div className="sidebar-nav-icon">
                      <HelpCircle size={14} />
                    </div>
                    <span>常见问题</span>
                  </Link>
                  <Link to="/emergency" className="sidebar-nav-item emergency">
                    <div className="sidebar-nav-icon">
                      <AlertCircle size={14} />
                    </div>
                    <span>紧急联系</span>
                  </Link>
                </nav>
              </div>

              {/* AI助手入口 */}
              <Link to="/ai" className="ai-entry-card">
                <div className="ai-entry-img">
                  <img src="/ai-doctor.png" alt="AI助手" />
                </div>
                <div className="ai-entry-content">
                  <div className="ai-entry-title">
                    <Sparkles size={14} />
                    AI智能助手
                  </div>
                  <p>24小时在线，随时为您解答健康问题</p>
                </div>
                <ChevronRight size={18} className="ai-entry-arrow" />
              </Link>

              {/* 快捷服务卡片 */}
              <div className="sidebar-services">
                <h4 className="sidebar-services-title">快捷服务</h4>
                <div className="sidebar-services-list">
                  {SERVICE_LIST.map((service, index) => (
                    <Link key={index} to={service.path} className="sidebar-service-item">
                      <div className={`sidebar-service-icon ${service.color}`}>
                        <service.icon size={16} />
                      </div>
                      <span>{service.name}</span>
                      <ArrowRight size={14} className="sidebar-service-arrow" />
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            {/* 中间主内容区 */}
            <main className="consult-main">
              {/* 聊天卡片 */}
              <div className="chat-card">
                {/* 聊天头部 */}
                <div className="chat-header">
                  <div className="chat-header-info" onClick={() => setShowDoctorDetail(true)} style={{ cursor: 'pointer' }}>
                    <div className="chat-avatar online">{DOCTOR_INFO.avatar}</div>
                    <div className="chat-header-text">
                      <div className="chat-header-name">{DOCTOR_INFO.name}</div>
                      <div className="chat-header-status">在线为您服务</div>
                    </div>
                  </div>
                  <div className="chat-header-actions">
                    <button className="chat-action-btn" title="语音通话" onClick={handleVoiceCall}>
                      <PhoneCall size={18} />
                    </button>
                    <button className="chat-action-btn" title="视频通话" onClick={handleVideoCall}>
                      <Video size={18} />
                    </button>
                    <button className="chat-action-btn" title="更多">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>

                {/* 聊天消息区 */}
                <div className="chat-messages" ref={messagesContainerRef}>
                  {Object.entries(groupedMessages).map(([date, msgs]) => (
                    <div key={date} style={{ display: 'contents' }}>
                      <div className="chat-date-divider">
                        <span className="chat-date-text">{date}</span>
                      </div>
                      {msgs.map(message => (
                        <MessageBubble 
                          key={message.id} 
                          message={message}
                          onQuickReply={sendMessage}
                        />
                      ))}
                    </div>
                  ))}
                  {isTyping && <TypingIndicator />}
                </div>

                {/* 聊天输入区 */}
                <div className="chat-input-area">
                  <div className="chat-input-wrapper">
                    <div className="chat-input-actions">
                      <button className="chat-input-btn" title="添加附件" onClick={handleFileUpload}>
                        <Paperclip size={18} />
                      </button>
                      <button className="chat-input-btn" title="发送图片" onClick={handleImageUpload}>
                        <Image size={18} />
                      </button>
                      <button className="chat-input-btn" title="表情">
                        <Smile size={18} />
                      </button>
                    </div>
                    <textarea
                      className="chat-input-field"
                      placeholder="输入您的问题，医生会尽快回复..."
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={1}
                      style={{ height: '44px' }}
                    />
                    <button 
                      className="chat-send-btn"
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 底部常见问题区域 */}
              <div className="faq-section">
                <div className="faq-section-header">
                  <div className="faq-section-icon">
                    <HelpCircle size={20} />
                  </div>
                  <h3 className="faq-section-title">常见问题解答</h3>
                  <p className="faq-section-subtitle">点击问题查看详细解答，或直接点击发送到咨询窗口</p>
                </div>
                <div className="faq-grid">
                  {FAQ_LIST.map((faq, index) => (
                    <div 
                      key={index} 
                      className={`faq-card ${expandedFaq === index ? 'expanded' : ''}`}
                    >
                      <div 
                        className="faq-card-question"
                        onClick={() => toggleFaq(index)}
                      >
                        <span className="faq-q-badge">Q</span>
                        <span className="faq-question-text">{faq.q}</span>
                        <ChevronRight 
                          size={16} 
                          className={`faq-expand-icon ${expandedFaq === index ? 'rotated' : ''}`}
                        />
                      </div>
                      {expandedFaq === index && (
                        <div className="faq-card-answer">
                          <p>{faq.a}</p>
                        </div>
                      )}
                      <button 
                        className="faq-send-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          sendMessage(faq.q);
                        }}
                      >
                        <MessageSquare size={12} />
                        咨询此问题
                      </button>
                    </div>
                  ))}
                </div>
                <div className="faq-section-footer">
                  <Link to="/faq" className="view-all-faq-btn">
                    查看更多问题
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </main>

            {/* 右侧医生信息栏 */}
            <aside className="consult-info">
              {/* 医生信息卡片 */}
              <div className="info-card doctor-card" onClick={() => setShowDoctorDetail(true)}>
                <div className="info-card-body">
                  <div className="doctor-info">
                    <div className="doctor-avatar-large">{DOCTOR_INFO.avatar}</div>
                    <div className="doctor-name">{DOCTOR_INFO.name}</div>
                    <div className="doctor-title">{DOCTOR_INFO.title}</div>
                    <div className="doctor-hospital">{DOCTOR_INFO.hospital}</div>
                    <div className="doctor-tags">
                      {DOCTOR_INFO.tags.map((tag, index) => (
                        <span key={index} className={`doctor-tag ${index === 0 ? 'primary' : 'secondary'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="doctor-stats">
                      <div className="doctor-stat">
                        <div className="doctor-stat-value">{DOCTOR_INFO.rating}</div>
                        <div className="doctor-stat-label">评分</div>
                      </div>
                      <div className="doctor-stat">
                        <div className="doctor-stat-value">{DOCTOR_INFO.consultations}</div>
                        <div className="doctor-stat-label">咨询量</div>
                      </div>
                      <div className="doctor-stat">
                        <div className="doctor-stat-value">{DOCTOR_INFO.experience}</div>
                        <div className="doctor-stat-label">经验</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 联系卡片 */}
              <Link to="/emergency" className="info-card contact-card">
                <div className="info-card-header">
                  <div className="info-card-icon">
                    <Phone size={14} />
                  </div>
                  <h4 className="info-card-title">紧急联系</h4>
                </div>
                <div className="info-card-body">
                  <div className="contact-item">
                    <div className="contact-icon">
                      <Phone size={16} />
                    </div>
                    <span>400-123-4567</span>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">
                      <Mail size={16} />
                    </div>
                    <span>help@rcax.com</span>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">
                      <Clock size={16} />
                    </div>
                    <span>24小时服务热线</span>
                  </div>
                </div>
              </Link>
            </aside>
          </div>
        </div>
      </div>

      {/* AI助手浮动按钮 */}
      <AIAssistant />

      {/* 医生详情弹窗 */}
      <Dialog open={showDoctorDetail} onOpenChange={setShowDoctorDetail}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>医生详情</DialogTitle>
          </DialogHeader>
          <div className="doctor-detail">
            <div className="doctor-detail-avatar">{DOCTOR_INFO.avatar}</div>
            <div className="doctor-detail-name">{DOCTOR_INFO.name}</div>
            <div className="doctor-detail-title">{DOCTOR_INFO.title}</div>
            <div className="doctor-detail-hospital">{DOCTOR_INFO.hospital}</div>
            <div className="doctor-detail-specialty">
              <strong>擅长：</strong>{DOCTOR_INFO.specialty}
            </div>
            <div className="doctor-detail-stats">
              <div className="detail-stat">
                <span className="detail-stat-value">{DOCTOR_INFO.rating}</span>
                <span className="detail-stat-label">患者评分</span>
              </div>
              <div className="detail-stat">
                <span className="detail-stat-value">{DOCTOR_INFO.consultations}</span>
                <span className="detail-stat-label">咨询次数</span>
              </div>
              <div className="detail-stat">
                <span className="detail-stat-value">{DOCTOR_INFO.responseTime}</span>
                <span className="detail-stat-label">平均回复</span>
              </div>
            </div>
            <div className="doctor-detail-actions">
              <Button className="detail-btn primary" onClick={() => setShowDoctorDetail(false)}>
                <MessageSquare size={16} />
                继续咨询
              </Button>
              <Link to="/appointment">
                <Button className="detail-btn secondary" variant="outline">
                  <Calendar size={16} />
                  预约门诊
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultPage;
