
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AlertTriangle, CheckCircle, HelpCircle, Info } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Custom component renderers for specific markdown elements
  const components = {
    h2: ({ node, ...props }: any) => (
      <h2 className="text-2xl font-semibold text-legal-primary mt-10 mb-4 pb-2 border-b border-legal-tertiary" {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 className="text-xl font-medium text-legal-secondary mt-6 mb-3" {...props} />
    ),
    p: ({ node, children, ...props }: any) => {
      // Apply special styling for risk indicators
      const text = children?.toString().toLowerCase() || '';
      
      if (text.includes('hohes risiko') || text.includes('problematisch')) {
        return (
          <p className="flex items-start gap-3 p-4 bg-red-50 text-red-800 rounded-md my-4 border-l-4 border-legal-risk-high" {...props}>
            <AlertTriangle className="h-5 w-5 text-legal-risk-high mt-0.5 flex-shrink-0" />
            <span>{children}</span>
          </p>
        );
      } else if (text.includes('mittleres risiko') || text.includes('beachten')) {
        return (
          <p className="flex items-start gap-3 p-4 bg-orange-50 text-orange-800 rounded-md my-4 border-l-4 border-legal-risk-medium" {...props}>
            <AlertTriangle className="h-5 w-5 text-legal-risk-medium mt-0.5 flex-shrink-0" />
            <span>{children}</span>
          </p>
        );
      } else if (text.includes('niedriges risiko') || text.includes('konform')) {
        return (
          <p className="flex items-start gap-3 p-4 bg-green-50 text-green-800 rounded-md my-4 border-l-4 border-legal-risk-low" {...props}>
            <CheckCircle className="h-5 w-5 text-legal-risk-low mt-0.5 flex-shrink-0" />
            <span>{children}</span>
          </p>
        );
      } else if (text.includes('hinweis:') || text.includes('beachten sie:')) {
        return (
          <p className="flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-md my-4 border-l-4 border-blue-300" {...props}>
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>{children}</span>
          </p>
        );
      }
      
      return <p className="my-4 text-slate-700 leading-relaxed" {...props}>{children}</p>;
    },
    ul: ({ node, ...props }: any) => (
      <ul className="list-disc pl-6 my-4 space-y-2 text-slate-700" {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol className="list-decimal pl-6 my-4 space-y-2 text-slate-700" {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li className="my-1" {...props} />
    ),
    a: ({ node, ...props }: any) => (
      <a className="text-legal-secondary hover:underline font-medium" {...props} target="_blank" rel="noopener noreferrer" />
    ),
    hr: ({ node, ...props }: any) => (
      <hr className="my-8 border-gray-200" {...props} />
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="border-l-4 border-legal-primary pl-4 italic my-6 text-gray-600 bg-legal-tertiary/50 p-3 rounded-r" {...props} />
    ),
    code: ({ node, inline, ...props }: any) => (
      inline 
        ? <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
        : <code className="block bg-slate-100 p-4 rounded-md my-4 text-sm font-mono overflow-x-auto" {...props} />
    ),
    strong: ({ node, ...props }: any) => (
      <strong className="font-semibold" {...props} />
    ),
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
