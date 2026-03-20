import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Phone,
  Heart,
  Shield,
  Stethoscope,
  CheckCircle,
  BookOpen,
  Users
} from 'lucide-react';
import AIAssistant from '@/components/shared/AIAssistant';
import Header from '@/components/shared/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import './FAQPage.css';

// FAQ分类
const CATEGORIES = [
  { 
    id: 'prevention', 
    name: '预防筛查', 
    icon: Shield,
    description: '乳腺癌预防与早期筛查相关知识'
  },
  { 
    id: 'diagnosis', 
    name: '诊断治疗', 
    icon: Stethoscope,
    description: '乳腺癌诊断方法与治疗方案'
  },
  { 
    id: 'surgery', 
    name: '手术康复', 
    icon: Heart,
    description: '手术前后注意事项与康复指导'
  },
  { 
    id: 'life', 
    name: '生活护理', 
    icon: Users,
    description: '日常生活中的护理与注意事项'
  },
  { 
    id: 'platform', 
    name: '平台使用', 
    icon: BookOpen,
    description: '平台功能使用指南'
  },
];

// FAQ数据
const FAQS = [
  // 预防筛查
  {
    id: 1,
    category: 'prevention',
    question: '乳腺癌的早期症状有哪些？',
    answer: '乳腺癌的早期症状包括：\n\n1. 乳房出现无痛性肿块，质地较硬，边界不清\n2. 乳头溢液，特别是血性溢液\n3. 乳房皮肤出现橘皮样改变或酒窝征\n4. 乳头内陷或方向改变\n5. 乳房持续性疼痛或不适\n6. 腋窝淋巴结肿大\n\n⚠️ 重要提示：早期乳腺癌可能没有明显症状，定期筛查是发现早期乳腺癌的最佳方式。',
    views: 12580,
    helpful: 98,
  },
  {
    id: 2,
    category: 'prevention',
    question: '如何进行乳腺自我检查？',
    answer: '乳腺自我检查建议每月进行一次，最佳时间是月经结束后7-10天。检查步骤如下：\n\n**第一步：观察**\n站在镜子前，观察乳房外观是否有变化，包括大小、形状、皮肤颜色、乳头是否有凹陷或溢液。\n\n**第二步：触摸（站立）**\n抬起左臂，用右手的指腹（不是指尖）按压检查左乳，从外上象限开始，顺时针方向检查整个乳房，包括乳头和腋窝。\n\n**第三步：触摸（平躺）**\n平躺在床上，在左肩下垫一个枕头，重复第二步的检查方法。\n\n**第四步：检查乳头**\n轻轻挤压乳头，观察是否有溢液。\n\n💡 建议40岁以上女性每年进行一次乳腺X光检查（钼靶）。',
    views: 10234,
    helpful: 96,
  },
  {
    id: 3,
    category: 'prevention',
    question: '乳腺癌筛查多久做一次？',
    answer: '乳腺癌筛查频率建议根据年龄和风险因素而定：\n\n**一般风险人群：**\n• 20-39岁：每1-3年进行一次临床乳腺检查\n• 40-44岁：可选择每年进行乳腺X光筛查\n• 45-54岁：建议每年进行乳腺X光筛查\n• 55岁以上：建议每两年进行乳腺X光筛查\n\n**高风险人群（有以下情况）：**\n• 有乳腺癌家族史\n• 携带BRCA1/2基因突变\n• 既往有乳腺不典型增生\n• 胸部接受过放射治疗\n\n高风险人群需要：\n• 更早开始筛查（通常30岁开始）\n• 增加筛查频率\n• 可能需要结合MRI检查\n\n👩‍⚕️ 具体筛查方案请咨询您的医生，制定个性化筛查计划。',
    views: 9876,
    helpful: 95,
  },
  {
    id: 4,
    category: 'prevention',
    question: '乳腺癌会遗传吗？',
    answer: '乳腺癌确实有一定的遗传倾向，但大多数乳腺癌（约85%）并非遗传性。\n\n**遗传性乳腺癌特点：**\n• 约占所有乳腺癌的5-10%\n• 主要与BRCA1和BRCA2基因突变有关\n• 携带者终生患乳腺癌风险高达70%\n• 发病年龄通常较早\n\n**建议进行基因检测的人群：**\n• 家族中有多人患乳腺癌或卵巢癌\n• 有亲属在50岁前患乳腺癌\n• 家族中有男性乳腺癌患者\n• 本人或亲属携带已知基因突变\n\n**降低遗传风险的方法：**\n• 定期筛查\n• 健康生活方式\n• 预防性药物（如他莫昔芬）\n• 预防性手术（乳腺切除）\n\n如有家族史，建议咨询遗传咨询师。',
    views: 11234,
    helpful: 97,
  },
  // 诊断治疗
  {
    id: 5,
    category: 'diagnosis',
    question: '乳腺增生会变成癌症吗？',
    answer: '大多数乳腺增生不会发展成癌症，但需要区分类型：\n\n**单纯性乳腺增生（生理性）：**\n• 与月经周期相关的乳房胀痛\n• 乳腺组织增厚但结构正常\n• 不会增加患癌风险\n• 通常无需特殊治疗\n\n**乳腺不典型增生（病理性）：**\n• 乳腺细胞出现异常变化\n• 分为导管不典型增生和小叶不典型增生\n• 患癌风险增加4-5倍\n• 需要密切随访\n\n**建议：**\n• 定期乳腺超声检查\n• 40岁以上配合钼靶检查\n• 如有异常及时就医\n• 保持健康生活方式\n\n📋 大多数乳腺增生是良性的，不必过度担心，但定期检查很重要。',
    views: 14567,
    helpful: 99,
  },
  {
    id: 6,
    category: 'diagnosis',
    question: '乳腺癌的治疗方法有哪些？',
    answer: '乳腺癌的治疗需要根据癌症分期、分子分型、患者年龄和身体状况等因素制定个体化方案。主要治疗方法包括：\n\n**手术治疗：**\n• 保乳手术：切除肿瘤及周围少量组织，保留乳房\n• 乳房全切术：切除整个乳房\n• 前哨淋巴结活检：检查淋巴结是否转移\n• 乳房重建术：术后乳房重建\n\n**放射治疗：**\n• 保乳手术后通常需要放疗\n• 降低局部复发风险\n• 一般持续3-6周\n\n**化学治疗：**\n• 使用抗癌药物杀灭癌细胞\n• 可在术前（新辅助）或术后（辅助）进行\n• 通常需要多个疗程\n\n**内分泌治疗：**\n• 适用于激素受体阳性患者\n• 使用他莫昔芬或芳香化酶抑制剂\n• 通常需要5-10年\n\n**靶向治疗：**\n• 针对HER2阳性患者\n• 使用曲妥珠单抗等药物\n• 精准打击癌细胞\n\n**免疫治疗：**\n• 适用于特定类型乳腺癌\n• 激活自身免疫系统对抗癌症\n\n👨‍⚕️ 具体治疗方案需要医生根据您的具体情况制定。',
    views: 8765,
    helpful: 94,
  },
  {
    id: 7,
    category: 'diagnosis',
    question: '乳腺癌术后能怀孕吗？',
    answer: '乳腺癌术后是可以怀孕的，但需要谨慎考虑时机和相关风险：\n\n**怀孕时机：**\n• 一般建议治疗结束后2-3年再怀孕\n• 需要完成所有治疗（手术、化疗、放疗）\n• 复发风险较高的患者可能需要等待更长时间\n• 建议与主治医生充分沟通\n\n**怀孕对乳腺癌的影响：**\n• 目前研究未发现怀孕会增加复发风险\n• 但怀孕期间激素水平变化需要密切监测\n• 建议在医生指导下进行\n\n**孕期注意事项：**\n• 选择对乳腺影响小的产检方式\n• 避免乳腺X光检查\n• 超声检查是安全的\n• 哺乳期可能需要调整\n\n**生育力保护：**\n• 化疗前可考虑冻卵或冻胚\n• 使用卵巢功能抑制药物\n• 咨询生殖医学专家\n\n💕 乳腺癌不是生育的绝对禁忌，但需要个体化评估和规划。',
    views: 7654,
    helpful: 93,
  },
  // 手术康复
  {
    id: 8,
    category: 'surgery',
    question: '术后需要注意什么？',
    answer: '乳腺癌术后康复是一个重要过程，需要注意以下方面：\n\n**伤口护理：**\n• 保持伤口清洁干燥\n• 按时换药，观察有无红肿、渗液\n• 避免伤口沾水，一般术后2周可淋浴\n• 如有异常及时就医\n\n**功能锻炼：**\n• 术后24小时开始手指活动\n• 术后3-5天开始肘部活动\n• 术后1-2周开始肩部活动\n• 循序渐进，避免过度用力\n\n**淋巴水肿预防：**\n• 避免患侧手臂受伤、感染\n• 避免患侧测血压、抽血\n• 避免患侧提重物（>5kg）\n• 可佩戴压力袖套\n\n**饮食营养：**\n• 高蛋白饮食促进伤口愈合\n• 多吃新鲜蔬菜水果\n• 避免辛辣刺激食物\n• 保持营养均衡\n\n**心理调适：**\n• 接受身体变化\n• 寻求家人朋友支持\n• 必要时寻求心理咨询\n• 加入患者互助组织\n\n**定期复查：**\n• 术后2年内每3-6个月复查\n• 术后3-5年每6-12个月复查\n• 5年后每年复查\n\n🏥 严格遵医嘱，有任何不适及时联系医生。',
    views: 9876,
    helpful: 96,
  },
  {
    id: 9,
    category: 'surgery',
    question: '如何缓解化疗副作用？',
    answer: '化疗副作用是暂时的，可以通过以下方法缓解：\n\n**恶心呕吐：**\n• 少食多餐，避免一次吃太多\n• 避免油腻、辛辣食物\n• 化疗前不要空腹\n• 按医嘱使用止吐药\n• 尝试生姜、薄荷等天然止吐方法\n\n**脱发：**\n• 使用温和洗发水\n• 避免高温吹风、染发烫发\n• 可考虑佩戴假发或帽子\n• 脱发是暂时的，化疗结束后会重新生长\n\n**疲劳：**\n• 保证充足睡眠\n• 适当运动，如散步\n• 合理安排活动，避免过度劳累\n• 必要时可短暂午休\n\n**免疫力下降：**\n• 注意个人卫生\n• 避免去人群密集场所\n• 避免接触感冒患者\n• 饮食注意食品安全\n\n**口腔溃疡：**\n• 使用软毛牙刷\n• 避免辛辣刺激食物\n• 可用淡盐水漱口\n• 必要时使用口腔护理药物\n\n**白细胞减少：**\n• 定期监测血常规\n• 必要时使用升白药物\n• 注意预防感染\n\n💊 具体用药请严格遵医嘱，不要自行调整药物。',
    views: 8234,
    helpful: 95,
  },
  // 生活护理
  {
    id: 10,
    category: 'life',
    question: '哺乳期可以做乳腺检查吗？',
    answer: '哺乳期可以进行乳腺检查，但需要注意一些特殊事项：\n\n**可以进行的检查：**\n\n**乳腺超声：**\n• 安全无辐射\n• 哺乳期首选检查方法\n• 不会影响哺乳\n• 可清晰显示乳腺结构\n\n**乳腺MRI：**\n• 无辐射，哺乳期可进行\n• 但需使用造影剂\n• 建议检查前哺乳或排空乳房\n• 造影剂后4小时可恢复哺乳\n\n**需要谨慎的检查：**\n\n**乳腺X光（钼靶）：**\n• 有少量辐射\n• 通常建议哺乳期后进行\n• 如确需检查，可排空乳房后进行\n• 辐射量很小，对哺乳影响有限\n\n**检查前准备：**\n• 检查前排空乳房\n• 告知医生您正在哺乳\n• 如有疼痛或肿块及时告知\n\n**哺乳期乳腺特点：**\n• 乳腺组织较致密\n• 影像学表现与非哺乳期不同\n• 需要经验丰富的医生判读\n\n👶 乳腺检查不会影响哺乳，如有异常请及时就医。',
    views: 6543,
    helpful: 92,
  },
  {
    id: 11,
    category: 'life',
    question: '乳腺癌患者饮食上有什么注意事项？',
    answer: '合理的饮食有助于乳腺癌患者的康复和预后：\n\n**推荐食物：**\n\n**蔬菜水果：**\n• 十字花科蔬菜（西兰花、卷心菜）\n• 深色蔬菜（菠菜、胡萝卜）\n• 浆果类水果（蓝莓、草莓）\n• 柑橘类水果\n\n**优质蛋白：**\n• 鱼类（富含Omega-3）\n• 豆类及豆制品\n• 瘦肉、禽肉\n• 鸡蛋、低脂奶制品\n\n**全谷物：**\n• 燕麦、糙米、全麦面包\n• 提供膳食纤维和B族维生素\n\n**需要限制的食物：**\n\n**高脂肪食物：**\n• 油炸食品\n• 加工肉类\n• 高脂肪红肉\n\n**高糖食物：**\n• 甜点、含糖饮料\n• 精制碳水化合物\n\n**酒精：**\n• 建议完全戒酒\n• 酒精增加复发风险\n\n**保健品：**\n• 谨慎使用含雌激素的保健品\n• 服用任何补充剂前咨询医生\n\n**体重管理：**\n• 保持健康体重\n• 肥胖增加复发风险\n• 适度运动\n\n🥗 均衡饮食、多样化摄入是最佳原则。',
    views: 7890,
    helpful: 94,
  },
  // 平台使用
  {
    id: 12,
    category: 'platform',
    question: '如何进行在线咨询？',
    answer: '使用我们的在线咨询服务非常简单：\n\n**第一步：进入咨询页面**\n• 点击顶部导航栏"在线咨询"\n• 或从首页快捷入口进入\n\n**第二步：选择咨询方式**\n• 文字咨询：随时发送您的问题\n• 语音通话：预约语音沟通（开发中）\n• 视频咨询：面对面交流（开发中）\n\n**第三步：描述您的问题**\n• 详细描述症状和疑问\n• 可上传相关检查报告图片\n• 提供既往病史信息\n\n**第四步：等待医生回复**\n• 医生通常会在5分钟内回复\n• 您会收到消息通知\n• 可随时查看对话记录\n\n**第五步：后续跟进**\n• 如需进一步检查，可在线预约\n• 可预约医生门诊\n• 医生会给出后续建议\n\n**咨询小贴士：**\n• 尽量详细描述问题\n• 准备好相关检查报告\n• 列出您想咨询的问题清单\n• 保持耐心，医生会认真回复\n\n💬 如有紧急问题，请拨打24小时热线：400-123-4567',
    views: 5432,
    helpful: 98,
  },
  {
    id: 13,
    category: 'platform',
    question: '如何查看我的检查报告？',
    answer: '您可以通过以下步骤查看检查报告：\n\n**查看报告：**\n\n**第一步：进入报告页面**\n• 点击顶部导航栏"检查报告"\n• 或从首页快捷入口进入\n\n**第二步：浏览报告列表**\n• 所有报告按时间倒序排列\n• 可按报告类型筛选\n• 可搜索特定报告\n\n**第三步：查看报告详情**\n• 点击报告卡片查看详情\n• 查看检查结果和医生建议\n• 查看各项指标数据\n\n**报告管理功能：**\n\n**下载报告：**\n• 支持PDF格式下载\n• 可保存到本地或云端\n• 方便分享给其他医生\n\n**打印报告：**\n• 支持直接打印\n• 打印前可预览\n\n**咨询医生：**\n• 查看报告后可直接咨询医生\n• 医生会解读报告内容\n• 给出专业建议\n\n**上传外部报告：**\n• 支持上传其他医院检查报告\n• 统一管理所有健康数据\n• 方便医生全面了解病情\n\n📋 如有报告相关问题，请联系客服。',
    views: 4567,
    helpful: 97,
  },
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [likedFaqs, setLikedFaqs] = useState<number[]>([]);

  // 过滤FAQ
  const filteredFaqs = FAQS.filter(faq => {
    const matchCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchSearch = faq.question.includes(searchQuery) || faq.answer.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  // 切换展开状态
  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 点赞
  const handleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedFaqs.includes(id)) {
      setLikedFaqs(likedFaqs.filter(faqId => faqId !== id));
    } else {
      setLikedFaqs([...likedFaqs, id]);
      toast.success('感谢您的反馈！');
    }
  };

  return (
    <div className="page-bg">
      <Header onSearch={() => {}} />
      
      <div className="faq-page">
        <div className="faq-container">
          {/* 页面标题 */}
          <div className="page-header">
            <div className="page-title-section">
              <h1 className="page-title">
                <HelpCircle size={28} />
                常见问题
              </h1>
              <p className="page-subtitle">解答您关于乳腺癌防治的疑问</p>
            </div>
          </div>

          {/* 搜索框 */}
          <div className="faq-search-section">
            <div className="search-box large">
              <Search size={20} />
              <Input
                placeholder="搜索您的问题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* 分类导航 */}
          <div className="category-section">
            <button
              className={`category-card ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              <div className="category-icon all">
                <BookOpen size={24} />
              </div>
              <div className="category-info">
                <div className="category-name">全部问题</div>
                <div className="category-count">{FAQS.length}个问题</div>
              </div>
            </button>
            {CATEGORIES.map((category) => {
              const count = FAQS.filter(f => f.category === category.id).length;
              return (
                <button
                  key={category.id}
                  className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className={`category-icon ${category.id}`}>
                    <category.icon size={24} />
                  </div>
                  <div className="category-info">
                    <div className="category-name">{category.name}</div>
                    <div className="category-count">{count}个问题</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* FAQ列表 */}
          <div className="faq-list-section">
            <div className="section-header">
              <h2 className="section-title">
                {selectedCategory === 'all' ? '全部问题' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
              </h2>
              <span className="section-count">共 {filteredFaqs.length} 个问题</span>
            </div>
            <div className="faq-list">
              {filteredFaqs.map((faq) => (
                <div 
                  key={faq.id} 
                  className={`faq-item ${expandedId === faq.id ? 'expanded' : ''}`}
                >
                  <div 
                    className="faq-question"
                    onClick={() => toggleExpand(faq.id)}
                  >
                    <div className="question-content">
                      <span className="question-icon">Q</span>
                      <span className="question-text">{faq.question}</span>
                    </div>
                    <div className="question-actions">
                      <span className="view-count">
                        <Heart size={14} />
                        {faq.views}次浏览
                      </span>
                      {expandedId === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                  {expandedId === faq.id && (
                    <div className="faq-answer">
                      <div className="answer-content">
                        <span className="answer-icon">A</span>
                        <div className="answer-text">
                          {faq.answer.split('\n').map((line, idx) => (
                            <p key={idx}>{line}</p>
                          ))}
                        </div>
                      </div>
                      <div className="answer-actions">
                        <button 
                          className={`like-btn ${likedFaqs.includes(faq.id) ? 'liked' : ''}`}
                          onClick={(e) => handleLike(faq.id, e)}
                        >
                          <CheckCircle size={14} />
                          {likedFaqs.includes(faq.id) ? '已解决' : '有帮助'} ({faq.helpful}%)
                        </button>
                        <Link to="/consult" className="consult-link">
                          <MessageSquare size={14} />
                          咨询医生
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 未找到答案 */}
          <div className="not-found-section">
            <div className="not-found-content">
              <HelpCircle size={40} />
              <h3>没找到您想要的答案？</h3>
              <p>我们的医生团队随时为您提供专业解答</p>
              <div className="not-found-actions">
                <Link to="/consult">
                  <Button className="consult-btn">
                    <MessageSquare size={16} />
                    在线咨询
                  </Button>
                </Link>
                <Link to="/emergency">
                  <Button variant="outline">
                    <Phone size={16} />
                    紧急联系
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI助手浮动按钮 */}
      <AIAssistant />
    </div>
  );
}
