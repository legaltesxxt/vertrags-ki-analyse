
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AlertTriangle, CheckCircle, HelpCircle, Info, FileText, BookOpen, Lightbulb } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content
}) => {
  // Custom component renderers for specific markdown elements
  const components = {
    h2: ({
      node,
      ...props
    }: any) => <h2 className="text-2xl font-light tracking-tight text-legal-primary mt-10 mb-4 pb-2 border-b border-legal-tertiary/60" {...props} />,
    h3: ({
      node,
      ...props
    }: any) => <h3 className="text-xl font-medium text-legal-secondary mt-8 mb-3" {...props} />,
    h4: ({
      node,
      ...props
    }: any) => <h4 className="text-lg font-medium text-legal-primary/80 mt-6 mb-2" {...props} />,
    p: ({
      node,
      children,
      ...props
    }: any) => {
      // Apply special styling for risk indicators
      const text = children?.toString().toLowerCase() || '';
      if (text.includes('rechtlich unzulässig') || text.includes('hohes risiko') || text.includes('problematisch')) {
        return <div className="flex items-start gap-3 p-4 bg-red-50 text-red-800 rounded-lg my-4 border border-legal-risk-high/30" {...props}>
            <AlertTriangle className="h-5 w-5 text-legal-risk-high mt-0.5 flex-shrink-0" />
            <span className="text-sm leading-relaxed">{children}</span>
          </div>;
      } else if (text.includes('rechtlich fraglich') || text.includes('mittleres risiko') || text.includes('beachten')) {
        return <div className="flex items-start gap-3 p-4 bg-orange-50 text-orange-800 rounded-lg my-4 border border-legal-risk-medium/30" {...props}>
            <AlertTriangle className="h-5 w-5 text-legal-risk-medium mt-0.5 flex-shrink-0" />
            <span className="text-sm leading-relaxed">{children}</span>
          </div>;
      } else if (text.includes('rechtskonform') || text.includes('niedriges risiko') || text.includes('konform')) {
        return <div className="flex items-start gap-3 p-4 bg-green-50 text-green-800 rounded-lg my-4 border border-legal-risk-low/30" {...props}>
            <CheckCircle className="h-5 w-5 text-legal-risk-low mt-0.5 flex-shrink-0" />
            <span className="text-sm leading-relaxed">{children}</span>
          </div>;
      } else if (text.includes('hinweis:') || text.includes('beachten sie:')) {
        return <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-lg my-4 border border-blue-300/30" {...props}>
            <Info className="h-5 w-5 text-legal-primary mt-0.5 flex-shrink-0" />
            <span className="text-sm leading-relaxed">{children}</span>
          </div>;
      }
      return <p className="my-4 text-slate-700 text-sm leading-relaxed" {...props}>{children}</p>;
    },
    ul: ({
      node,
      ...props
    }: any) => <ul className="list-disc pl-6 my-4 space-y-2 text-slate-700 text-sm" {...props} />,
    ol: ({
      node,
      ...props
    }: any) => <ol className="list-decimal pl-6 my-4 space-y-2 text-slate-700 text-sm" {...props} />,
    li: ({
      node,
      ...props
    }: any) => <li className="my-1 text-sm" {...props} />,
    a: ({
      node,
      href,
      children,
      ...props
    }: any) => {
      return (
        <a 
          href={href} 
          className="text-legal-primary hover:text-legal-secondary underline decoration-legal-tertiary/50 hover:decoration-legal-secondary/70 transition-all" 
          target="_blank" 
          rel="noopener noreferrer" 
          {...props}
        >
          {children}
        </a>
      );
    },
    hr: ({
      node,
      ...props
    }: any) => <hr className="my-8 border-gray-200" {...props} />,
    blockquote: ({
      node,
      ...props
    }: any) => <blockquote className="border-l-4 border-legal-primary pl-4 italic my-6 text-slate-600 bg-legal-tertiary/30 p-3 rounded-r text-sm" {...props} />,
    code: ({
      node,
      inline,
      ...props
    }: any) => inline ? <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono" {...props} /> : <code className="block bg-slate-100 p-4 rounded-md my-4 text-xs font-mono overflow-x-auto" {...props} />,
    strong: ({
      node,
      ...props
    }: any) => <strong className="font-semibold" {...props} />,
    table: ({
      node,
      ...props
    }: any) => <div className="my-6 overflow-x-auto">
        <Table className="w-full border-collapse bg-white rounded-lg shadow-sm">
          {props.children}
        </Table>
      </div>,
    thead: ({
      node,
      ...props
    }: any) => <TableHeader className="bg-legal-tertiary/20">{props.children}</TableHeader>,
    tbody: ({
      node,
      ...props
    }: any) => <TableBody>{props.children}</TableBody>,
    tr: ({
      node,
      ...props
    }: any) => <TableRow className="border-b border-gray-200 hover:bg-slate-50/70">{props.children}</TableRow>,
    th: ({
      node,
      ...props
    }: any) => <TableHead className="py-3 px-4 text-left font-medium text-legal-primary text-sm">{props.children}</TableHead>,
    td: ({
      node,
      ...props
    }: any) => <TableCell className="py-3 px-4 text-sm text-slate-700">{props.children}</TableCell>
  };

  return <div className="markdown-content prose max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>;
};

export default MarkdownRenderer;
