import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  Download, 
  Eye, 
  Search,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Printer,
  Share2,
  MessageSquare,
  Upload,
  TrendingUp,
  Bell,
  BookOpen,
  ChevronRight,
  Clock,
  Activity,
  Shield,
  ArrowUpRight
} from 'lucide-react';
import AIAssistant from '@/components/shared/AIAssistant';
import Header from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import './ReportsPage.css';

// 报告数据
const REPORTS = [
  {
    id: 'R20240201001',
    type: '乳腺超声',
    hospital: '市中心医院',
    doctor: '李医生',
    date: '2024-02-01',
    status: 'normal',
    summary: '双侧乳腺未见明显异常',
    details: '双侧乳腺腺体结构清晰，未见明显肿块及异常回声。双侧腋窝未见明显肿大淋巴结。',
    indicators: [
      { name: '乳腺组织', value: '正常', status: 'normal' },
      { name: '淋巴结', value: '未见异常', status: 'normal' },
      { name: '血流信号', value: '正常', status: 'normal' },
    ],
    recommendations: '建议每年定期复查，保持乳腺健康。',
  },
  {
    id: 'R20240115002',
    type: '乳腺钼靶',
    hospital: '省人民医院',
    doctor: '王医生',
    date: '2024-01-15',
    status: 'attention',
    summary: '右乳可见良性钙化灶',
    details: '右乳外上象限可见散在点状钙化，BI-RADS分级：2级（良性发现）。左乳未见明显异常。',
    indicators: [
      { name: 'BI-RADS分级', value: '2级', status: 'attention' },
      { name: '钙化灶', value: '良性', status: 'attention' },
      { name: '乳腺密度', value: 'B型', status: 'normal' },
    ],
    recommendations: '建议6个月后复查，观察钙化灶变化情况。',
  },
  {
    id: 'R20231210003',
    type: '血常规检查',
    hospital: '市妇幼保健院',
    doctor: '张医生',
    date: '2023-12-10',
    status: 'normal',
    summary: '各项指标均在正常范围内',
    details: '白细胞、红细胞、血小板计数及血红蛋白含量均在正常参考范围内。',
    indicators: [
      { name: '白细胞', value: '6.5×10⁹/L', status: 'normal' },
      { name: '血红蛋白', value: '125g/L', status: 'normal' },
      { name: '血小板', value: '220×10⁹/L', status: 'normal' },
    ],
    recommendations: '继续保持良好的生活习惯。',
  },
  {
    id: 'R20231105004',
    type: '肿瘤标志物',
    hospital: '肿瘤医院',
    doctor: '刘医生',
    date: '2023-11-05',
    status: 'normal',
    summary: '肿瘤标志物水平正常',
    details: 'CA15-3、CA125、CEA等乳腺癌相关肿瘤标志物均在正常参考范围内。',
    indicators: [
      { name: 'CA15-3', value: '12.5 U/mL', status: 'normal' },
      { name: 'CA125', value: '15.2 U/mL', status: 'normal' },
      { name: 'CEA', value: '1.8 ng/mL', status: 'normal' },
    ],
    recommendations: '定期监测肿瘤标志物变化。',
  },
  {
    id: 'R20231020005',
    type: '乳腺MRI',
    hospital: '协和医院',
    doctor: '陈医生',
    date: '2023-10-20',
    status: 'normal',
    summary: '乳腺MRI未见明显异常',
    details: '双侧乳腺实质呈散在纤维腺体型，未见明显肿块及异常强化灶。',
    indicators: [
      { name: '乳腺实质', value: '正常', status: 'normal' },
      { name: '强化模式', value: '正常', status: 'normal' },
      { name: '淋巴结', value: '未见异常', status: 'normal' },
    ],
    recommendations: '建议每年进行一次乳腺MRI检查。',
  },
];

// 报告类型
const REPORT_TYPES = [
  { id: 'all', name: '全部' },
  { id: 'ultrasound', name: '乳腺超声' },
  { id: 'mammogram', name: '乳腺钼靶' },
  { id: 'mri', name: '乳腺MRI' },
  { id: 'blood', name: '血液检查' },
  { id: 'tumor', name: '肿瘤标志物' },
];

// 状态配置
const STATUS_CONFIG = {
  normal: { label: '正常', color: '#10b981', icon: CheckCircle, bgColor: '#d1fae5' },
  attention: { label: '需关注', color: '#f59e0b', icon: AlertCircle, bgColor: '#fef3c7' },
  abnormal: { label: '异常', color: '#ef4444', icon: AlertCircle, bgColor: '#fee2e2' },
};

// 检查提醒
const CHECKUP_REMINDERS = [
  { type: '乳腺超声', nextDate: '2024-08-01', daysLeft: 180, icon: Activity },
  { type: '乳腺钼靶', nextDate: '2024-07-15', daysLeft: 165, icon: Shield },
];

// 健康趋势数据
const HEALTH_TRENDS = [
  { month: '10月', ca153: 12.5, ca125: 15.2 },
  { month: '11月', ca153: 12.8, ca125: 14.9 },
  { month: '12月', ca153: 12.2, ca125: 15.5 },
  { month: '1月', ca153: 12.5, ca125: 15.2 },
  { month: '2月', ca153: 12.3, ca125: 15.0 },
];

// 报告解读指南
const GUIDE_ITEMS = [
  { title: 'BI-RADS分级解读', desc: '了解乳腺影像报告和数据系统', icon: BookOpen },
  { title: '肿瘤标志物意义', desc: 'CA15-3、CA125等指标说明', icon: Activity },
  { title: '检查前注意事项', desc: '不同检查项目的准备要求', icon: Clock },
];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<typeof REPORTS[0] | null>(null);
  const [showReportDetail, setShowReportDetail] = useState(false);
  const [showTrendDetail, setShowTrendDetail] = useState(false);

  // 过滤报告
  const filteredReports = REPORTS.filter(report => {
    const matchType = selectedType === 'all' || 
      (selectedType === 'ultrasound' && report.type === '乳腺超声') ||
      (selectedType === 'mammogram' && report.type === '乳腺钼靶') ||
      (selectedType === 'mri' && report.type === '乳腺MRI') ||
      (selectedType === 'blood' && report.type === '血常规检查') ||
      (selectedType === 'tumor' && report.type === '肿瘤标志物');
    const matchSearch = report.type.includes(searchQuery) || 
      report.hospital.includes(searchQuery) ||
      report.doctor.includes(searchQuery);
    return matchType && matchSearch;
  });

  // 统计数据
  const stats = {
    total: REPORTS.length,
    normal: REPORTS.filter(r => r.status === 'normal').length,
    attention: REPORTS.filter(r => r.status === 'attention').length,
  };

  const handleViewReport = (report: typeof REPORTS[0]) => {
    setSelectedReport(report);
    setShowReportDetail(true);
  };

  const handleDownload = (report: typeof REPORTS[0]) => {
    toast.success('报告下载中', {
      description: `${report.type}报告正在下载...`,
    });
  };

  const handlePrint = () => {
    toast.info('打印功能', {
      description: '请连接打印机后重试',
    });
  };

  const handleShare = () => {
    toast.info('分享功能', {
      description: '报告分享链接已复制',
    });
  };

  return (
    <div className="page-bg">
      <Header onSearch={() => {}} />
      
      <div className="reports-page">
        <div className="reports-container">
          {/* 页面标题 */}
          <div className="page-header">
            <h1 className="page-title">检查报告</h1>
            <p className="page-subtitle">查看和管理您的所有检查报告，追踪健康变化趋势</p>
          </div>

          {/* 统计概览卡片 */}
          <div className="stats-overview">
            <div className="stat-card total">
              <div className="stat-icon">
                <FileText size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">总报告数</span>
              </div>
            </div>
            <div className="stat-card normal">
              <div className="stat-icon">
                <CheckCircle size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.normal}</span>
                <span className="stat-label">正常报告</span>
              </div>
            </div>
            <div className="stat-card attention">
              <div className="stat-icon">
                <AlertCircle size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.attention}</span>
                <span className="stat-label">需关注</span>
              </div>
            </div>
            <div className="stat-card trend" onClick={() => setShowTrendDetail(true)}>
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">趋势</span>
                <span className="stat-label">点击查看</span>
              </div>
              <ArrowUpRight size={16} className="trend-arrow" />
            </div>
          </div>

          {/* 搜索和筛选 */}
          <div className="filter-section">
            <div className="type-tabs">
              {REPORT_TYPES.map((type) => (
                <button
                  key={type.id}
                  className={`type-tab ${selectedType === type.id ? 'active' : ''}`}
                  onClick={() => setSelectedType(type.id)}
                >
                  {type.name}
                </button>
              ))}
            </div>
            <div className="search-box">
              <Search size={18} />
              <Input
                placeholder="搜索报告..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* 报告列表 - 置顶 */}
          <div className="reports-list-section">
            <div className="list-header">
              <span>共 {filteredReports.length} 份报告</span>
              <div className="list-actions">
                <button className="sort-btn">
                  <Calendar size={14} />
                  按时间排序
                </button>
              </div>
            </div>
            <div className="reports-list">
              {filteredReports.map((report) => {
                const statusConfig = STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG];
                const StatusIcon = statusConfig.icon;
                return (
                  <div key={report.id} className="report-item">
                    <div className="report-main">
                      <div className="report-type-icon" style={{ background: statusConfig.bgColor, color: statusConfig.color }}>
                        <FileText size={20} />
                      </div>
                      <div className="report-info">
                        <div className="report-header-row">
                          <span className="report-type">{report.type}</span>
                          <span className="report-status" style={{ color: statusConfig.color, background: statusConfig.bgColor }}>
                            <StatusIcon size={12} />
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="report-summary-text">{report.summary}</div>
                        <div className="report-meta">
                          <span><Stethoscope size={12} /> {report.doctor}</span>
                          <span><Calendar size={12} /> {report.date}</span>
                          <span className="report-id">{report.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="report-actions">
                      <button onClick={() => handleViewReport(report)}>
                        <Eye size={16} />
                        查看
                      </button>
                      <button onClick={() => handleDownload(report)}>
                        <Download size={16} />
                        下载
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 底部内容区 - 两栏布局 */}
          <div className="reports-bottom-section">
            {/* 左侧 - 检查提醒 */}
            <div className="reminders-section">
              <div className="section-header">
                <Bell size={18} />
                <h3>检查提醒</h3>
              </div>
              <div className="reminders-list">
                {CHECKUP_REMINDERS.map((reminder, index) => (
                  <div key={index} className="reminder-card">
                    <div className="reminder-icon">
                      <reminder.icon size={20} />
                    </div>
                    <div className="reminder-info">
                      <div className="reminder-type">{reminder.type}</div>
                      <div className="reminder-date">建议检查日期：{reminder.nextDate}</div>
                    </div>
                    <div className="reminder-countdown">
                      <span className="days">{reminder.daysLeft}</span>
                      <span className="label">天后</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/appointment" className="schedule-btn">
                <Calendar size={16} />
                预约检查
              </Link>
            </div>

            {/* 右侧 - 报告解读指南 */}
            <div className="guide-section">
              <div className="section-header">
                <BookOpen size={18} />
                <h3>报告解读指南</h3>
              </div>
              <div className="guide-list">
                {GUIDE_ITEMS.map((item, index) => (
                  <div key={index} className="guide-item">
                    <div className="guide-icon">
                      <item.icon size={18} />
                    </div>
                    <div className="guide-content">
                      <div className="guide-title">{item.title}</div>
                      <div className="guide-desc">{item.desc}</div>
                    </div>
                    <ChevronRight size={16} className="guide-arrow" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 上传报告 */}
          <div className="upload-section">
            <div className="upload-content">
              <div className="upload-icon-wrapper">
                <Upload size={28} />
              </div>
              <div>
                <strong>上传其他医院检查报告</strong>
                <p>将不同医院的检查报告统一管理，方便对比和追踪</p>
              </div>
            </div>
            <Button className="upload-btn" onClick={() => toast.info('上传功能开发中')}>
              <Upload size={16} />
              上传报告
            </Button>
          </div>
        </div>
      </div>

      {/* AI助手浮动按钮 */}
      <AIAssistant />

      {/* 报告详情弹窗 */}
      <Dialog open={showReportDetail} onOpenChange={setShowReportDetail}>
        <DialogContent className="sm:max-w-2xl report-detail-dialog">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="report-detail-title">
                  <FileText size={22} />
                  {selectedReport.type}报告
                  <span 
                    className="detail-status"
                    style={{ 
                      color: STATUS_CONFIG[selectedReport.status as keyof typeof STATUS_CONFIG].color,
                      background: STATUS_CONFIG[selectedReport.status as keyof typeof STATUS_CONFIG].bgColor
                    }}
                  >
                    {STATUS_CONFIG[selectedReport.status as keyof typeof STATUS_CONFIG].label}
                  </span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="report-detail-content">
                {/* 基本信息 */}
                <div className="detail-section">
                  <h4 className="section-title">基本信息</h4>
                  <div className="detail-info-grid">
                    <div className="info-item">
                      <span className="info-label">报告编号</span>
                      <span className="info-value">{selectedReport.id}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">检查日期</span>
                      <span className="info-value">{selectedReport.date}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">检查医院</span>
                      <span className="info-value">{selectedReport.hospital}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">检查医生</span>
                      <span className="info-value">{selectedReport.doctor}</span>
                    </div>
                  </div>
                </div>

                {/* 检查结果 */}
                <div className="detail-section">
                  <h4 className="section-title">检查结果</h4>
                  <div className="result-summary">
                    <strong>检查结论：</strong>{selectedReport.summary}
                  </div>
                  <div className="result-details">
                    <strong>详细描述：</strong>{selectedReport.details}
                  </div>
                </div>

                {/* 指标详情 */}
                <div className="detail-section">
                  <h4 className="section-title">指标详情</h4>
                  <div className="indicators-table">
                    {selectedReport.indicators.map((indicator, idx) => (
                      <div key={idx} className="indicator-row">
                        <span className="indicator-name">{indicator.name}</span>
                        <span className={`indicator-value ${indicator.status}`}>
                          {indicator.value}
                        </span>
                        <span className={`indicator-status ${indicator.status}`}>
                          {indicator.status === 'normal' ? '正常' : '需关注'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 医生建议 */}
                <div className="detail-section">
                  <h4 className="section-title">医生建议</h4>
                  <div className="recommendations">
                    {selectedReport.recommendations}
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="report-detail-actions">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer size={16} />
                  打印
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 size={16} />
                  分享
                </Button>
                <Button variant="outline" onClick={() => handleDownload(selectedReport)}>
                  <Download size={16} />
                  下载PDF
                </Button>
                <Link to="/consult">
                  <Button className="consult-btn">
                    <MessageSquare size={16} />
                    咨询医生
                  </Button>
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 健康趋势弹窗 */}
      <Dialog open={showTrendDetail} onOpenChange={setShowTrendDetail}>
        <DialogContent className="sm:max-w-lg trend-dialog">
          <DialogHeader>
            <DialogTitle className="trend-dialog-title">
              <TrendingUp size={22} />
              健康趋势分析
            </DialogTitle>
          </DialogHeader>
          
          <div className="trend-content">
            <div className="trend-chart">
              <h4 className="trend-chart-title">肿瘤标志物趋势（近5个月）</h4>
              <div className="chart-container">
                <div className="chart-y-axis">
                  <span>20</span>
                  <span>15</span>
                  <span>10</span>
                  <span>5</span>
                  <span>0</span>
                </div>
                <div className="chart-bars">
                  {HEALTH_TRENDS.map((data, index) => (
                    <div key={index} className="chart-bar-group">
                      <div className="chart-bar-wrapper">
                        <div 
                          className="chart-bar ca153"
                          style={{ height: `${(data.ca153 / 20) * 100}%` }}
                          title={`CA15-3: ${data.ca153}`}
                        />
                        <div 
                          className="chart-bar ca125"
                          style={{ height: `${(data.ca125 / 20) * 100}%` }}
                          title={`CA125: ${data.ca125}`}
                        />
                      </div>
                      <span className="chart-label">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color ca153" />
                  <span>CA15-3</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color ca125" />
                  <span>CA125</span>
                </div>
              </div>
            </div>
            
            <div className="trend-summary">
              <h4>趋势分析</h4>
              <p>您的肿瘤标志物指标在过去5个月中保持稳定，均在正常参考范围内。建议继续保持定期监测。</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
