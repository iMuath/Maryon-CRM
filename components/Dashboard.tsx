import React, { useEffect, useState } from 'react';
import { DollarSign, Users, CheckCircle, AlertCircle, Facebook, Instagram, Twitter, Linkedin, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card } from './ui/Card';
import { useLocalization } from '../hooks/useLocalization';
import { mockSocialInsights, mockEmailMarketingInsights, mockLandingPageInsights } from '../data/mockData';
import type { SocialMediaInsight, EmailMarketingInsight, LandingPageInsight } from '../types';
import { GoogleGenAI } from '@google/genai';

const KPI_CARDS = [
  { id: 'revenue', icon: DollarSign, value: '$1.2M', change: '+12.5%', changeType: 'increase' },
  { id: 'leads', icon: Users, value: '350', change: '+8.2%', changeType: 'increase' },
  { id: 'deals', icon: CheckCircle, value: '75', change: '-2.1%', changeType: 'decrease' },
  { id: 'tickets', icon: AlertCircle, value: '12', change: '+5', changeType: 'increase' },
];

const salesData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
];

const kpiLabels: { [key: string]: string } = {
    revenue: 'total_revenue',
    leads: 'new_leads',
    deals: 'deals_closed',
    tickets: 'support_tickets'
}

const KPICard: React.FC<{ card: typeof KPI_CARDS[0] }> = ({ card }) => {
    const {t} = useLocalization();
    return (
        <Card className="flex flex-col">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-maryon-text-secondary">{t(kpiLabels[card.id])}</h3>
                <card.icon className="w-5 h-5 text-maryon-text-muted" />
            </div>
            <p className="mt-4 text-3xl font-bold text-maryon-text-primary">{card.value}</p>
            <p className={`mt-1 text-sm ${card.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                {card.change} vs last month
            </p>
        </Card>
    );
}

const AiSummaryCard: React.FC = () => {
    const { t } = useLocalization();
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const generateSummary = async () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                
                const kpiText = KPI_CARDS.map(c => `${t(kpiLabels[c.id])}: ${c.value} (${c.change})`).join(', ');
                const salesText = salesData.map(d => `${d.name}: $${d.revenue}`).join(', ');

                const prompt = `As a business analyst for Maryon Real Estate, provide a short, insightful summary (2-3 sentences) of the company's performance based on this data. Highlight the most important trend. Data: KPIs - [${kpiText}]. Recent Sales Data - [${salesText}].`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                
                setSummary(response.text);
            } catch (error) {
                console.error("Error generating AI summary:", error);
                setSummary("Could not generate summary at this time.");
            } finally {
                setIsLoading(false);
            }
        };
        generateSummary();
    }, [t]);

    return (
        <Card className="col-span-full bg-maryon-text-primary text-white">
            <div className="flex items-start justify-between">
                 <h2 className="text-xl font-semibold mb-2">{t('ai_summary')}</h2>
                 <Sparkles className="w-6 h-6 text-maryon-accent" />
            </div>
            {isLoading ? (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <div className="w-2 h-2 bg-maryon-accent rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-maryon-accent rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-maryon-accent rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    <span className="text-sm text-gray-300">{t('generating_summary')}</span>
                </div>
            ) : (
                <p className="text-gray-300">{summary}</p>
            )}
        </Card>
    )
}

const platformIcons: Record<SocialMediaInsight['platform'], React.ElementType> = {
    Facebook: Facebook,
    Instagram: Instagram,
    Twitter: Twitter,
    LinkedIn: Linkedin,
};

const SocialInsightsCard: React.FC = () => {
    const { t } = useLocalization();
    return (
        <Card>
            <h2 className="text-xl font-semibold text-maryon-text-primary mb-4">{t('social_media_insights')}</h2>
            <div className="space-y-4">
                {mockSocialInsights.map(insight => {
                    const Icon = platformIcons[insight.platform];
                    const isPositive = insight.weeklyChange >= 0;
                    return (
                        <div key={insight.platform} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Icon className="w-6 h-6 me-4 text-maryon-text-secondary" />
                                <div>
                                    <p className="font-semibold text-maryon-text-primary">{insight.platform}</p>
                                    <p className="text-sm text-maryon-text-secondary">{insight.followers.toLocaleString()} {t('followers')}</p>
                                </div>
                            </div>
                            <div className={`text-end text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                <p>{isPositive ? '+' : ''}{insight.weeklyChange}%</p>
                                <p className="text-xs text-maryon-text-muted">{t('weekly_change')}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

const EmailMarketingInsightsCard: React.FC = () => {
    const { t } = useLocalization();
    const headers = ['campaign', 'open_rate', 'ctr', 'conversion_rate', 'cpa', 'roas', 'bounce_rate', 'avg_time_on_page'];

    return (
        <Card>
            <h2 className="text-xl font-semibold text-maryon-text-primary mb-4">{t('email_marketing_insights')}</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-start text-maryon-text-secondary">
                    <thead className="text-xs text-maryon-text-secondary uppercase bg-maryon-hover">
                        <tr>
                            {headers.map(header => (
                                <th key={header} scope="col" className="px-6 py-3">{t(header)}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {mockEmailMarketingInsights.map((insight) => (
                            <tr key={insight.campaign} className="border-b border-maryon-border hover:bg-maryon-hover">
                                <th scope="row" className="px-6 py-4 font-medium text-maryon-text-primary whitespace-nowrap">
                                    {insight.campaign}
                                </th>
                                <td className="px-6 py-4">{insight.openRate.toFixed(1)}%</td>
                                <td className="px-6 py-4">{insight.ctr.toFixed(1)}%</td>
                                <td className="px-6 py-4">{insight.conversionRate.toFixed(1)}%</td>
                                <td className="px-6 py-4">${insight.cpa.toFixed(2)}</td>
                                <td className="px-6 py-4">{insight.roas.toFixed(1)}x</td>
                                <td className="px-6 py-4">{insight.bounceRate.toFixed(1)}%</td>
                                <td className="px-6 py-4">{insight.avgTimeOnPage}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const LandingPageInsightsCard: React.FC = () => {
    const { t } = useLocalization();
    const headers = ['page', 'views', 'conversions', 'leads', 'bounce_rate'];

    return (
        <Card>
            <h2 className="text-xl font-semibold text-maryon-text-primary mb-4">{t('landing_page_insights')}</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-start text-maryon-text-secondary">
                    <thead className="text-xs text-maryon-text-secondary uppercase bg-maryon-hover">
                        <tr>
                            {headers.map(header => (
                                <th key={header} scope="col" className="px-6 py-3">{t(header)}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {mockLandingPageInsights.map((insight) => (
                            <tr key={insight.pageTitle} className="border-b border-maryon-border hover:bg-maryon-hover">
                                <th scope="row" className="px-6 py-4 font-medium text-maryon-text-primary whitespace-nowrap">
                                    {insight.pageTitle}
                                </th>
                                <td className="px-6 py-4">{insight.views.toLocaleString()}</td>
                                <td className="px-6 py-4">{insight.conversionRate.toFixed(1)}%</td>
                                <td className="px-6 py-4">{insight.leads.toLocaleString()}</td>
                                <td className="px-6 py-4">{insight.bounceRate.toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

export const Dashboard: React.FC = () => {
    const {t} = useLocalization();
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AiSummaryCard />
        {KPI_CARDS.map(card => <KPICard key={card.id} card={card} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-semibold text-maryon-text-primary mb-4">{t('sales_overview')}</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                      color: '#1f2937'
                  }}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)'}}
                />
                <Legend />
                <Bar dataKey="revenue" name={t('revenue')} fill="#1f2937">
                   {salesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? "#c0a062" : "#1f2937"}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <SocialInsightsCard />
      </div>
      <EmailMarketingInsightsCard />
      <LandingPageInsightsCard />
    </div>
  );
};
