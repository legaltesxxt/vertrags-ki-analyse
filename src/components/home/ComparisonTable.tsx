
import React from 'react';
import { Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ComparisonTable = () => {
  const comparisons = [
    {
      criteria: "Expertise im Schweizer Recht",
      deinTool: true,
      selbst: false,
      chatGPT: false,
      anwalt: true,
    },
    {
      criteria: "Kosten",
      deinTool: "Günstig",
      selbst: "Kostenlos",
      chatGPT: "Günstig",
      anwalt: "Teuer",
      isText: true
    },
    {
      criteria: "Risiko-Analyse",
      deinTool: true,
      selbst: false,
      chatGPT: false,
      anwalt: true,
    },
    {
      criteria: "Dauer",
      deinTool: "Sofort",
      selbst: "Lang",
      chatGPT: "Mittel",
      anwalt: "Lang",
      isText: true
    },
    {
      criteria: "Kritische Klauseln erkennen",
      deinTool: true,
      selbst: false,
      chatGPT: false,
      anwalt: true,
    },
    {
      criteria: "Benutzerfreundlichkeit",
      deinTool: true,
      selbst: false,
      chatGPT: true,
      anwalt: false,
    },
  ];

  const renderCell = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-legal-risk-low mx-auto" />
      ) : (
        <X className="h-5 w-5 text-legal-risk-high mx-auto" />
      );
    }
    return <span className="text-sm text-slate-600">{value}</span>;
  };

  return (
    <section className="my-16">
      <h2 className="text-2xl font-semibold text-legal-primary text-center mb-8">
        Vergleich der Analysemethoden
      </h2>
      <div className="rounded-xl border border-border/50 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-legal-tertiary/30">
              <TableHead className="w-[250px] font-semibold">Kriterien</TableHead>
              <TableHead className="text-center font-semibold">Dein Tool</TableHead>
              <TableHead className="text-center font-semibold">Selbst prüfen</TableHead>
              <TableHead className="text-center font-semibold">ChatGPT</TableHead>
              <TableHead className="text-center font-semibold">Anwalt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisons.map((row) => (
              <TableRow key={row.criteria}>
                <TableCell className="font-medium">{row.criteria}</TableCell>
                <TableCell className="text-center">{renderCell(row.deinTool)}</TableCell>
                <TableCell className="text-center">{renderCell(row.selbst)}</TableCell>
                <TableCell className="text-center">{renderCell(row.chatGPT)}</TableCell>
                <TableCell className="text-center">{renderCell(row.anwalt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default ComparisonTable;
