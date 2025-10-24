
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Index from "./pages/Index";
import AnalysisResults from "./pages/AnalysisResults";
import DemoAnalysis from "./pages/DemoAnalysis";
import AnalyseGeheim from "./pages/AnalyseGeheim";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Preise from "./pages/Preise";
import Legal from "./pages/Legal";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import AGB from "./pages/AGB";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import WerteEthik from "./pages/WerteEthik";
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/analyse-ergebnisse" element={<AnalysisResults />} />
          <Route path="/demo-analyse" element={<DemoAnalysis />} />
          
          {/* Geschützte Analyse-Seite */}
          <Route path="/analyse-geheim" element={<AnalyseGeheim />} />
          
          {/* Payment Flow */}
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          
          {/* Alte Upload-Route leitet zu Preise um */}
          <Route path="/vertrag-hochladen" element={<Navigate to="/preise" replace />} />
          
          <Route path="/preise" element={<Preise />} />
          <Route path="/rechtliches" element={<Legal />} />
          <Route path="/kontakt" element={<Contact />} />
          
          {/* New routes */}
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/agb" element={<AGB />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/werte-ethik" element={<WerteEthik />} />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/analysis-results" element={<AnalysisResults />} />
          <Route path="/demo-analysis" element={<DemoAnalysis />} />
          <Route path="/upload-contract" element={<Navigate to="/preise" replace />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
