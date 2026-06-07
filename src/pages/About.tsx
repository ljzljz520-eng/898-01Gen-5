import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Shield, 
  BookOpen, 
  Users,
  Heart,
  ArrowLeft,
  MessageSquareWarning,
  Clock
} from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: '多维度评价',
      description: '从课程难度、作业量、考核方式、给分厚道度四个维度全面评价课程，帮助你了解课程全貌。'
    },
    {
      icon: Clock,
      title: '学期标记',
      description: '每条评价都显示修读学期，避免旧培养方案内容误导，确保信息时效性。'
    },
    {
      icon: Shield,
      title: '内容审核',
      description: '严格的内容审核机制，拦截恶意打分和试题泄露，保障评价真实有效。'
    },
    {
      icon: BookOpen,
      title: '分类筛选',
      description: '支持按专业必修、通识课、跨院课分类筛选，快速找到你需要的课程。'
    }
  ];

  const guidelines = [
    '客观真实：请分享你的真实选课体验，帮助他人做出明智选择',
    '文明友善：禁止人身攻击、辱骂等不文明用语',
    '保护隐私：不要泄露任何考试题目及答案',
    '拒绝恶意：禁止恶意打分、刷分等行为',
    '尊重版权：不要发布侵犯他人版权的内容',
    '遵守法律：遵守国家法律法规和学校规章制度'
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 mb-8 opacity-0 animate-fade-in-up">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif mb-4">
              关于选课经验墙
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              一个由学生自发建设的课程评价分享平台，致力于打破信息不对称，帮助每一位同学做出明智的选课决策。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 font-serif mb-6 text-center">
              社区规范
            </h2>
            <div className="bg-primary-50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <MessageSquareWarning className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">
                    如何写出有价值的评价
                  </h3>
                  <ul className="space-y-2">
                    {guidelines.map((guideline, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <Heart className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-50 text-accent-700 rounded-full text-sm mb-4">
              <Users className="w-4 h-4" />
              学生共建 · 实名匿名结合
            </div>
            <p className="text-gray-600">
              我们相信，每一份真实的评价，都能帮助后来人少走弯路。
            </p>
            <p className="text-gray-500 text-sm mt-2">
              让我们一起建设一个更好的选课社区 ❤️
            </p>
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm">
          © 2025 选课经验墙. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default About;
