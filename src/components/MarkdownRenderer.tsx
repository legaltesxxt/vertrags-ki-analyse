
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Custom component renderers for specific markdown elements
  const components = {
    h2: ({ node, ...props }: any) => (
      <h2 className="text-xl font-semibold text-legal-primary mt-6 mb-3" {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 className="text-lg font-medium text-legal-secondary mt-4 mb-2" {...props} />
    ),
    p: ({ node, children, ...props }: any) => {
      // Apply special styling for risk indicators
      const text = children?.toString().toLowerCase() || '';
      
      if (text.includes('hohes risiko') || text.includes('problematisch')) {
        return (
          <p className="flex items-start gap-2 p-3 bg-red-50 text-red-800 rounded-md my-3" {...props}>
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <span>{children}</span>
          </p>
        );
      } else if (text.includes('mittleres risiko') || text.includes('beachten')) {
        return (
          <p className="flex items-start gap-2 p-3 bg-orange-50 text-orange-800 rounded-md my-3" {...props}>
            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <span>{children}</span>
          </p>
        );
      } else if (text.includes('niedriges risiko') || text.includes('konform')) {
        return (
          <p className="flex items-start gap-2 p-3 bg-green-50 text-green-800 rounded-md my-3" {...props}>
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>{children}</span>
          </p>
        );
      }
      
      return <p className="my-3 text-gray-700" {...props}>{children}</p>;
    },
    ul: ({ node, ...props }: any) => (
      <ul className="list-disc pl-6 my-3 space-y-1" {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol className="list-decimal pl-6 my-3 space-y-1" {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li className="my-1" {...props} />
    ),
    a: ({ node, ...props }: any) => (
      <a className="text-legal-secondary hover:underline" {...props} target="_blank" rel="noopener noreferrer" />
    ),
    hr: ({ node, ...props }: any) => (
      <hr className="my-6 border-gray-200" {...props} />
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="border-l-4 border-legal-primary pl-4 italic my-4 text-gray-600" {...props} />
    ),
    code: ({ node, inline, ...props }: any) => (
      inline 
        ? <code className="bg-gray-100 px-1 rounded text-sm" {...props} />
        : <code className="block bg-gray-100 p-3 rounded-md my-4 text-sm overflow-x-auto" {...props} />
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
