import React from 'react';
import { Card } from './ui/Card';
import { useLocalization } from '../hooks/useLocalization';

const CodeBlock: React.FC<{ children: React.ReactNode, lang?: string }> = ({ children, lang = 'bash' }) => (
    <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
        <code className={`language-${lang}`}>
            {children}
        </code>
    </pre>
);

export const ApiDocumentation: React.FC = () => {
    const { t } = useLocalization();

    return (
        <Card>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-maryon-text-primary">{t('api_docs')}</h2>
                <p className="text-sm text-maryon-text-secondary mt-1">{t('api_docs_desc')}</p>
            </div>
            <div className="prose prose-sm md:prose-base max-w-none text-maryon-text-primary" 
                 // Fix: Cast style object to React.CSSProperties to allow CSS custom properties.
                 style={{
                    '--tw-prose-headings': '#1f2937',
                    '--tw-prose-body': '#1f2937',
                    '--tw-prose-bold': '#1f2937',
                    '--tw-prose-code': '#1f2937',
                 } as React.CSSProperties}>
                
                <h2>{t('api_authentication')}</h2>
                <p>{t('api_auth_desc')}</p>
                <CodeBlock>
                    {`curl "https://api.maryon.com/v1/customers" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                </CodeBlock>

                <hr className="my-8 border-maryon-border" />

                <h2>{t('api_endpoints')}</h2>
                
                <h3 className="font-semibold">{t('api_get_customers')}</h3>
                <p>Returns a list of all your customers.</p>
                <CodeBlock>
                    {`GET /v1/customers`}
                </CodeBlock>
                
                <h3 className="font-semibold mt-6">{t('api_create_deal')}</h3>
                <p>Creates a new deal in your sales pipeline.</p>
                <CodeBlock lang="javascript">
                    {`const deal = await maryon.deals.create({
  title: "Riyadh Villa Project",
  value: 5000000,
  customer_id: "C001",
  status: "Proposal"
});`}
                </CodeBlock>
            </div>
        </Card>
    );
};
